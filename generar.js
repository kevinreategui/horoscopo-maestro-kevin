const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const fs = require("fs");
const config = require("./config");
const promptBuilder = require("./prompt");

async function ejecutar() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: Falta GEMINI_API_KEY");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // 🛡️ Desactivamos filtros para que no bloquee el contenido místico
  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ];

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    safetySettings 
  });
  
  const hoy = new Date().toLocaleDateString('es-ES', { timeZone: config.zonaHoraria });
  const results = { fecha_actualizacion: hoy, signos: {} };

  console.log(`🚀 Generando destino para: ${hoy}`);

  for (const signo of config.signos) {
    try {
      const prompt = promptBuilder.construirPrompt(signo, hoy);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Extractor de JSON para limpiar cualquier texto extra de la IA
      const inicio = text.indexOf('{');
      const fin = text.lastIndexOf('}');
      if (inicio === -1 || fin === -1) throw new Error("Formato inválido");

      const jsonLimpio = text.substring(inicio, fin + 1);
      results.signos[signo.toLowerCase()] = JSON.parse(jsonLimpio);
      
      console.log(`✅ ${signo} procesado.`);
    } catch (e) {
      console.log(`❌ Error en ${signo}: ${e.message}`);
      
      // Datos de respaldo para que la web nunca esté vacía
      results.signos[signo.toLowerCase()] = { 
        diario: "Hoy los astros te invitan a la calma y reflexión profunda.",
        semanal: "Una semana de grandes revelaciones se aproxima.",
        mensual: { amor: "Abre tu corazón.", dinero: "Llega prosperidad.", salud: "Cuida tu descanso." },
        numero_suerte: Math.floor(Math.random() * 99) + 1,
        color: "Dorado",
        palabra_clave: "Paciencia",
        compatible_con: "Cáncer",
        desafio_dia: "Evita discusiones innecesarias."
      };
    }
  }

  fs.writeFileSync('horoscopo.json', JSON.stringify(results, null, 2));
  console.log("✨ API Horóscopo Maestro Kevin actualizada.");
}

ejecutar();
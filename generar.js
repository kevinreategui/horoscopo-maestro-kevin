const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const fs = require("fs");
const config = require("./config");
const promptBuilder = require("./prompt");

async function ejecutar() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: No se encontró GEMINI_API_KEY");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // 🛡️ Configuramos la seguridad para que NO bloquee el contenido esotérico
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

  console.log(`🚀 Generando energías para el día: ${hoy}`);

  for (const signo of config.signos) {
    try {
      const prompt = promptBuilder.construirPrompt(signo, hoy);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Limpiamos la respuesta para asegurar que solo quede el JSON
      const inicio = text.indexOf('{');
      const fin = text.lastIndexOf('}');
      if (inicio === -1 || fin === -1) throw new Error("JSON no encontrado");

      const jsonLimpio = text.substring(inicio, fin + 1);
      results.signos[signo.toLowerCase()] = JSON.parse(jsonLimpio);
      
      console.log(`✅ ${signo} procesado con éxito.`);
    } catch (e) {
      console.log(`⚠️ Falló ${signo}, usando datos de respaldo. Motivo: ${e.message}`);
      
      // Respaldo dinámico si la IA falla
      results.signos[signo.toLowerCase()] = { 
        diario: "Los astros te invitan hoy a confiar en tu intuición y mantener la calma.",
        semanal: "Mantén el enfoque en tus metas personales, el universo conspira a tu favor.",
        mensual: { amor: "Días de armonía.", dinero: "Fluye la abundancia.", salud: "Paz mental." },
        numero_suerte: Math.floor(Math.random() * 99) + 1,
        color: "Dorado",
        palabra_clave: "Resiliencia",
        compatible_con: "Cualquier signo de fuego",
        desafio_dia: "Respira profundo antes de actuar."
      };
    }
  }

  fs.writeFileSync('horoscopo.json', JSON.stringify(results, null, 2));
  console.log("✨ Archivo horoscopo.json actualizado correctamente.");
}

ejecutar();
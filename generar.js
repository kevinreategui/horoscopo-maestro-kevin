const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const fs = require("fs");
const config = require("./config");
const promptBuilder = require("./prompt");

async function ejecutar() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: No se encontró GEMINI_API_KEY en Secrets.");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // 🛡️ CONFIGURACIÓN DE SEGURIDAD TOTAL (BLOCK_NONE)
  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ];

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", // Modelo más rápido y menos restrictivo
    safetySettings 
  });
  
  const hoy = new Date().toLocaleDateString('es-ES', { timeZone: config.zonaHoraria });
  const results = { fecha_actualizacion: hoy, signos: {} };

  console.log(`🚀 Iniciando conexión astral para: ${hoy}`);

  for (const signo of config.signos) {
    try {
      const prompt = promptBuilder.construirPrompt(signo, hoy);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Limpieza de JSON para evitar textos basura de la IA
      const inicio = text.indexOf('{');
      const fin = text.lastIndexOf('}');
      if (inicio === -1 || fin === -1) throw new Error("JSON Inválido");

      const jsonLimpio = text.substring(inicio, fin + 1);
      results.signos[signo.toLowerCase()] = JSON.parse(jsonLimpio);
      
      console.log(`✅ ${signo} canalizado.`);
    } catch (e) {
      console.log(`⚠️ Error en ${signo}: ${e.message}`);
      
      // Respaldo por si un signo falla individualmente
      results.signos[signo.toLowerCase()] = { 
        diario: "Los astros te piden hoy calma y observación antes de actuar.",
        semanal: "Una semana para sembrar intenciones claras.",
        mensual: { amor: "Paciencia.", dinero: "Ahorro.", salud: "Meditación." },
        numero_suerte: Math.floor(Math.random() * 99),
        color: "Violeta",
        palabra_clave: "Intuición",
        compatible_con: "Leo",
        desafio_dia: "No te apresures."
      };
    }
  }

  fs.writeFileSync('horoscopo.json', JSON.stringify(results, null, 2));
  console.log("✨ horoscopo.json actualizado con éxito.");
}

ejecutar();
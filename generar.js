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

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ];

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    safetySettings,
    generationConfig: {
      responseMimeType: "application/json", // ← Fuerza respuesta JSON pura
    }
  });

  const hoy = new Date().toLocaleDateString('es-ES', { timeZone: config.zonaHoraria });
  const results = { fecha_actualizacion: hoy, signos: {} };

  console.log(`🚀 Iniciando conexión astral para: ${hoy}`);

  for (const signo of config.signos) {
    try {
      const prompt = promptBuilder.construirPrompt(signo, hoy);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log(`📝 Respuesta raw de ${signo}:`, text.substring(0, 100));

      // Intentar parsear directamente (con responseMimeType: application/json debería ser JSON limpio)
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        // Fallback: extraer el JSON manualmente
        const inicio = text.indexOf('{');
        const fin = text.lastIndexOf('}');
        if (inicio === -1 || fin === -1) throw new Error(`No se encontró JSON en la respuesta: ${text.substring(0, 200)}`);
        parsed = JSON.parse(text.substring(inicio, fin + 1));
      }

      results.signos[signo.toLowerCase()] = parsed;
      console.log(`✅ ${signo} canalizado.`);

      // Pequeña pausa para no sobrecargar la API
      await new Promise(r => setTimeout(r, 500));

    } catch (e) {
      console.error(`⚠️ Error en ${signo}: ${e.message}`);

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
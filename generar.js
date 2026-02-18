const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const config = require("./config");
const promptBuilder = require("./prompt");

async function ejecutar() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const hoy = new Date().toLocaleDateString(config.idioma, { timeZone: config.zonaHoraria });
  const results = { fecha_actualizacion: hoy, signos: {} };

  for (const signo of config.signos) {
    try {
      const prompt = promptBuilder.construirPrompt(signo, hoy);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().replace(/```json|```/g, "").trim();
      
      results.signos[signo.toLowerCase()] = JSON.parse(text);
      console.log(`✅ ${signo} procesado.`);
    } catch (e) {
      console.log(`❌ Error en ${signo}:`, e.message);
    }
  }

  fs.writeFileSync('horoscopo.json', JSON.stringify(results, null, 2));
  console.log("✨ Proceso modular completado.");
}

ejecutar();
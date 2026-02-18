const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

async function ejecutar() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const signos = ['Aries', 'Tauro', 'Geminis', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  const hoy = new Date().toLocaleDateString('es-ES', { timeZone: 'America/Lima' }); 
  const results = { fecha: hoy, signos: {} };

  console.log("Iniciando generación de horóscopos...");

  for (const signo of signos) {
    try {
      const prompt = `Genera el horóscopo místico para el signo ${signo} del día ${hoy}. 
      Tono: Maestro Kevin, espiritual, profesional y esperanzador. 
      Responde SOLO un JSON con: prediccion (máximo 250 caracteres), numero_suerte (1-99), color (nombre del color). 
      No uses markdown ni bloques de código.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().replace(/```json|```/g, "").trim();
      
      results.signos[signo.toLowerCase()] = JSON.parse(text);
      console.log(`✅ ${signo} completado`);
    } catch (e) {
      console.log(`❌ Error en ${signo}:`, e.message);
    }
  }

  fs.writeFileSync('horoscopo.json', JSON.stringify(results, null, 2));
  console.log("✨ Proceso terminado. Archivo horoscopo.json creado.");
}

ejecutar();
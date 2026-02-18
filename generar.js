const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

async function ejecutar() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const signos = ['Aries', 'Tauro', 'Geminis', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
  const hoy = new Date().toLocaleDateString('es-ES', { timeZone: 'America/Lima' }); 
  const results = { fecha_actualizacion: hoy, signos: {} };

  console.log("Generando horóscopos ultra-detallados...");

  for (const signo of signos) {
    try {
      const prompt = `Actúa como el Maestro Kevin. Genera el horóscopo para ${signo} de hoy ${hoy}.
      
      Debes incluir:
      1. Diario: Breve consejo místico.
      2. Semanal: Guía espiritual para la semana.
      3. Mensual: Detalle extenso para Salud, Dinero y Amor.
      4. Extras: Número de la suerte, Color, Palabra Clave, Signo Compatible y Desafío del día.
      
      Responde ESTRICTAMENTE en este formato JSON:
      {
        "diario": "texto",
        "semanal": "texto",
        "mensual": { "salud": "texto", "dinero": "texto", "amor": "texto" },
        "numero_suerte": 19,
        "color": "Naranja",
        "palabra_clave": "Éxito",
        "compatible_con": "Leo",
        "desafio_dia": "No seas intransigente con los demás."
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().replace(/```json|```/g, "").trim();
      
      results.signos[signo.toLowerCase()] = JSON.parse(text);
      console.log(`✅ ${signo} generado con todos sus detalles.`);
    } catch (e) {
      console.log(`❌ Error en ${signo}:`, e.message);
    }
  }

  fs.writeFileSync('horoscopo.json', JSON.stringify(results, null, 2));
  console.log("✨ API Maestra completada.");
}

ejecutar();
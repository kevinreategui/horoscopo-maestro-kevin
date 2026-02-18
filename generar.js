const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const config = require("./config");
const promptBuilder = require("./prompt");

async function ejecutar() {
  // Verificamos que la API KEY exista
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: No se encontró la GEMINI_API_KEY en las variables de entorno.");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  // Fecha exacta para el archivo
  const hoy = new Date().toLocaleDateString('es-ES', { timeZone: 'America/Lima' });
  const results = { fecha_actualizacion: hoy, signos: {} };

  console.log(`🚀 Iniciando generación para el día: ${hoy}`);

  for (const signo of config.signos) {
    try {
      const prompt = promptBuilder.construirPrompt(signo, hoy);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // --- BLOQUE DE EXTRACCIÓN SEGURA ---
      // Buscamos donde empieza el primer '{' y termina el último '}'
      const inicio = text.indexOf('{');
      const fin = text.lastIndexOf('}');
      
      if (inicio === -1 || fin === -1) {
        throw new Error("La IA no devolvió un formato JSON válido.");
      }

      const jsonLimpio = text.substring(inicio, fin + 1);
      // ------------------------------------

      results.signos[signo.toLowerCase()] = JSON.parse(jsonLimpio);
      console.log(`✅ ${signo} procesado correctamente.`);
      
    } catch (e) {
      console.log(`❌ Error en ${signo}: ${e.message}`);
      // Opcional: Guardar un mensaje de error por signo para que la web no rompa
      results.signos[signo.toLowerCase()] = { diario: "Los astros están en silencio para este signo. Intenta más tarde." };
    }
  }

  // Escribimos el archivo siempre, aunque algunos signos fallen
  fs.writeFileSync('horoscopo.json', JSON.stringify(results, null, 2));
  console.log("✨ Archivo horoscopo.json generado con éxito.");
}

ejecutar();
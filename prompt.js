module.exports = {
  construirPrompt: (signo, fecha) => {
    return `Genera un análisis de bienestar y energías positivas para el signo ${signo} con fecha ${fecha}. 
    Usa un tono místico, sabio y alentador. No menciones temas médicos ni legales.
    
    Responde ÚNICAMENTE con este formato JSON:
    {
      "diario": "Un párrafo inspirador sobre la energía de hoy.",
      "semanal": "Un consejo clave para afrontar los próximos días.",
      "mensual": { 
          "amor": "Reflexión sobre las relaciones.", 
          "dinero": "Tendencia sobre la abundancia.", 
          "salud": "Consejo de bienestar espiritual." 
      },
      "numero_suerte": ${Math.floor(Math.random() * 99) + 1},
      "color": "Un color místico",
      "palabra_clave": "Una palabra de poder",
      "compatible_con": "Un signo zodiacal",
      "desafio_dia": "Un pequeño reto positivo para hoy"
    }`;
  }
};
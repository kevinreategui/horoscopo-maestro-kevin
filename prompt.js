module.exports = {
  construirPrompt: (signo, fecha) => {
    return `Actúa como un guía espiritual experto. Crea un análisis de bienestar y tendencias energéticas para el signo ${signo} con fecha ${fecha}. 
    Usa un tono sabio, místico y alentador.
    
    IMPORTANTE: Responde ÚNICAMENTE con el siguiente formato JSON puro:
    {
      "diario": "Un párrafo inspirador único para hoy.",
      "semanal": "Un consejo clave para esta semana.",
      "mensual": { 
          "amor": "Reflexión sobre los sentimientos.", 
          "dinero": "Perspectiva de abundancia.", 
          "salud": "Consejo de equilibrio espiritual." 
      },
      "numero_suerte": ${Math.floor(Math.random() * 99) + 1},
      "color": "Color del día",
      "palabra_clave": "Palabra de poder",
      "compatible_con": "Signo afín",
      "desafio_dia": "Reto positivo"
    }`;
  }
};
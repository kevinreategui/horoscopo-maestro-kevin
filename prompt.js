module.exports = {
  construirPrompt: (signo, fecha) => {
    return `Actúa como el Maestro Kevin. Genera el horóscopo para ${signo} de hoy ${fecha}.
      Responde ESTRICTAMENTE en este formato JSON:
      {
        "diario": "Resumen místico corto",
        "semanal": "Guía para la semana",
        "mensual": { "salud": "texto", "dinero": "texto", "amor": "texto" },
        "numero_suerte": 29,
        "color": "Verde oliva",
        "palabra_clave": "Libertad",
        "compatible_con": "Leo",
        "energia": { "amor": 87, "dinero": 66, "salud": 72, "espiritu": 95 }
      }`;
  }
};
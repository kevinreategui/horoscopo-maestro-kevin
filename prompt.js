module.exports = {
  construirPrompt: (signo, fecha) => {
    return `Actúa como el Maestro Kevin. Genera el horóscopo para ${signo} de hoy ${fecha}.
      Reglas de contenido:
      1. Diario: Breve consejo místico (máx 150 caracteres).
      2. Semanal: Guía espiritual para la semana (máx 300 caracteres).
      3. Mensual: Detalle extenso para Salud, Dinero y Amor.
      4. Extras: Número de la suerte, Color, Palabra Clave, Signo Compatible y Desafío.
      
      Responde ESTRICTAMENTE en formato JSON:
      {
        "diario": "texto",
        "semanal": "texto",
        "mensual": { "salud": "texto", "dinero": "texto", "amor": "texto" },
        "numero_suerte": 19,
        "color": "ColorNombre",
        "palabra_clave": "Palabra",
        "compatible_con": "Signo",
        "desafio_dia": "Consejo de advertencia"
      }`;
  }
};
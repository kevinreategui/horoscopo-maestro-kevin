module.exports = {
  construirPrompt: (signo, fecha) => {
    return `Actúa como el Maestro Kevin. Genera el horóscopo para el signo ${signo} de hoy ${fecha}.
      Responde EXCLUSIVAMENTE en formato JSON puro.
      
      Estructura:
      {
        "diario": "frase mística corta",
        "semanal": "consejo breve",
        "mensual": { 
            "salud": "predicción larga", 
            "dinero": "predicción larga", 
            "amor": "predicción larga" 
        },
        "numero_suerte": 12,
        "color": "NombreColor",
        "palabra_clave": "Palabra",
        "compatible_con": "Signo",
        "desafio_dia": "Frase de advertencia"
      }`;
  }
};
const GEMINI_API_KEY = "AIzaSyAuT4i1pF5PJ7zY9BG9RF4iatQuHPDjK_k";
const SYSTEM_PROMPT = `
ROL:
Actúa como un docente de primera infancia experto en el diseño de actividades STEAM para niños de primer grado. Tu objetivo es generar actividades educativas adaptadas a los hitos neurocognitivos que le permitan a los estudiantes y demás actores educativos vivir experiencias de aprendizaje activo e integrar diversas áreas de conocimiento a fin de desarrollar competencias para la vida y conectarse con las dinámicas y desafíos del contexto local y global.

Áreas que promueve: Por sus siglas en inglés, STEAM se refiere a la integración entre las áreas de las ciencia, tecnología, ingeniería y matemáticas. Invita a integrar otras áreas del conocimiento; diversos actores escolares y del contexto para desarrollar proyectos que beneficien el territorio; integrar diferentes metodologías que inviten a la experimentación, a la lectura del entorno y al análisis de situaciones problémicas de manera interdisciplinar.

HITOS NEUROCOGNITIVOS PARA CONSIDERAR:

CODIFICACIÓN DE HITOS (5-7 años)
Cada hito está representado con un código H seguido de un número y su respectiva descripción.
ETAPA PREOPERACIONAL
H1- Pensamiento simbólico: Los niños representan objetos no presentes mediante palabras, dibujos, gestos y juegos. 
H2- Juego simbólico: Inventan utilería, roles sociales y narrativas.
H3- Lenguaje en expansión: Pueden usar palabras para referirse a objetos ausentes, acontecimientos pasados y futuros. 
H4- Egocentrismo: Dificultad para asumir la perspectiva de otros. 
H5- Animismo y teorías intuitivas: Atribuyen vida o intención a objetos inanimados y explican fenómenos naturales con ideas propias.
H6- Limitaciones lógicas: Piensan en una sola dimensión de un problema (Centralización) y no comprenden aun la reversibilidad. 
H7- Desarrollo del dibujo representacional: Evolución desde garabatos hasta dibujos con significados concretos y simbólicos. 
H8- Inicio de conceptos numéricos: Entienden principios básicos del conteo, aunque cometen errores frecuentes. 
INICIO DE LA ETAPA DE OPERACIONES CONCRETAS
H9- Inicio del pensamiento lógico concreto: Pueden razonar con base en objetos reales y situaciones tangibles.
H10- Comprensión de la conservación: Comienzan a entender que la cantidad no cambia, aunque la forma del objeto lo haga (Liquido, numero, masa) 
H11- Menor egocentrismo: Empiezan a adoptar la perspectiva del otro.
H12- Seriación: Ordenan objetos según atributos como tamaño o peso.  
H13- Clasificación múltiple: Agrupan objetos según más de una característica (ejemplo, forma y color)
H14- Inclusión de clases: Entienden que un conjunto puede incluir subclases.
H15- Reversibilidad mental: Comienzan a invertir operaciones en su mente.
H16- Pensamiento menos centrado: Consideran más de un aspecto de una situación. 

PRINCIPIOS DEL ENFOQUE STEAM 

Planificación de actividades STEAM
➔ Objetivos claros y alineados con el currículo y el desarrollo infantil.
➔ Integración interdisciplinaria combinando ciencia, tecnología, ingeniería, arte y matemáticas.
➔ Materiales y entornos adecuados que fomenten la exploración y la creatividad. 

Implementación de actividades STEAM
➔ Exploración y experimentación a través de preguntas abiertas y resolución de problemas.
➔ Trabajo colaborativo que promueva la comunicación y el aprendizaje social. 
➔ Uso significativo de tecnología adaptada a la edad y al contexto educativo. 

Evaluación de actividades STEAM
➔ Observación y documentación del proceso de aprendizaje.
➔ Autoevaluación y reflexión con preguntas que estimulen el pensamiento crítico.
➔ Retroalimentación constructiva enfocada en el esfuerzo y la creatividad.

Estos son algunos puntos claves según el artículo DEVELOPING COMPETENCY FRAMEWORK FOR ORGANIZING STEAM EDUCATION ACTIVITIES FOR EARLY CHILDHOOD EDUCATION STUDENTS por Dinh Lan Anh que permiten planificar, implementar y evaluar actividades STEAM adaptadas a niños en primera infancia.

SOLICITUD DE INFORMACIÓN PARA PERSONALIZAR LA ACTIVIDAD:

La primera interacción con el chat debe inmediatamente solicitar la siguiente información con fines de generar la actividad brindando un breve saludo y explicando el propósito. Además, una vez muestres la solicitud de información despliega los hitos en una tabla HTML clara y ordenada (usa <table>, <tr>, <td>), el resto de información fuera de la tabla:

Edad del estudiante: (Ejemplo: 5 años) 
Hito para desarrollar: (Seleccionar entre H1 y H16).
Contexto educativo: (Ejemplo: aula de clase, aprendizaje en casa, espacio al aire libre)
Tema de la actividad: (ejemplo: recursos naturales del entorno, artefactos tecnológicos)
Objetivo de estudio: (Ejemplo: fortalecer la creatividad mediante la resolución de problemas)
Duración de la actividad: (ejemplo: 30 minutos, 1 hora…)
Imprime este mensaje: Adjunte formato de plan de clase si desea.
(Especifica detalles claves sobre el hito que escogió el usuario.)

FORMATO DE RESPUESTA:
Genera una actividad STEAM clara y estructurada siguiendo este formato:

➔ Título de la actividad: (Nombre atractivo y representativo)
➔ Descripción breve: (Explicación general de la actividad)
➔ Hito neurocognitivo trabajado: (Indicar H1 y H16)
➔ Materiales necesarios: (Lista de materiales)
➔ Desarrollo de la actividad: (Instrucciones paso a paso)
➔ Preguntas de reflexión: (Para fomentar el pensamiento crítico y la creatividad)
➔ Sugerencias de adaptación: (Modificaciones para diferentes contextos o necesidades)

Cuando muestres la tabla de hitos, usa formato HTML de tabla (<table>, <tr>, <td>) para que se vea ordenada y clara en la interfaz.
`;

const loginContainer = document.getElementById("loginContainer");
const mainContainer = document.getElementById("mainContainer");
const loginBtn = document.getElementById("loginBtn");
const chatInput = document.getElementById("chatInput");
const chatSubmitBtn = document.getElementById("chatSubmitBtn");
const chatResponse = document.getElementById("chatResponse");

let conversationHistory = [];
let isFirstInteraction = true;

chatSubmitBtn.addEventListener("click", async function () {
  const userText = chatInput.value.trim();
  if (userText !== "") {
    chatResponse.innerHTML += `<div class="user-message"><strong>Tú:</strong> ${userText}</div>`;
    conversationHistory.push({ role: "user", text: userText });

    let messages = [];
    if (isFirstInteraction) {
      messages.push({ text: SYSTEM_PROMPT });
      isFirstInteraction = false;
    }
    messages = messages.concat(conversationHistory.map(m => ({ text: m.text })));

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: messages
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (
        data.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0
      ) {
        let botResponse = data.candidates[0].content.parts[0].text;
        botResponse = botResponse.replace(/```html|```/g, "").trim();
        chatResponse.innerHTML += `<div class="bot-message"><strong>Agente:</strong> ${botResponse}</div>`;
        conversationHistory.push({ role: "model", text: botResponse });
      } else {
        chatResponse.innerHTML += `<div class="bot-message"><strong>Agente:</strong> Lo siento, no puedo responder en este momento.</div>`;
      }
    } catch (error) {
      chatResponse.innerHTML += `<div class="bot-message"><strong>Agente:</strong> ${error.message}</div>`;
    }

    chatInput.value = "";
    chatResponse.scrollTop = chatResponse.scrollHeight;
  } else {
    alert("Por favor, escribe algo en el chat.");
  }
});

chatInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    chatSubmitBtn.click();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  chatResponse.innerHTML += `<div class="bot-message"><strong>Agente:</strong> ¡Hola! Soy tu asistente STEAM. ¿En qué puedo ayudarte hoy?</div>`;
});

document.getElementById('btnHijos').addEventListener('click', () => {
  const infoHitos = document.getElementById('infoHitos');
  infoHitos.innerHTML = `
    <h2>Hitos de la Primera Infancia</h2>
    <img src="hitos.png" alt="Hitos de la Primera Infancia" style="max-width: 100%; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);" />
  `;
  infoHitos.style.display = 'block';
});

document.getElementById('btnSoporte').addEventListener('click', () => {
  alert('Redirigiendo a la página de Soporte...');
});

document.getElementById('btnMisActividades').addEventListener('click', () => {
  alert('Mostrando tus actividades...');
});

document.getElementById('btnFavoritos').addEventListener('click', () => {
  alert('Mostrando tus actividades favoritas...');
});

document.getElementById('btnActividadesEditadas').addEventListener('click', () => {
  alert('Mostrando tus actividades editadas...');
});

loginBtn.addEventListener("click", function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (username && password) {
    loginContainer.style.display = "none";
    mainContainer.style.display = "block";
  } else {
    alert("Por favor, ingresa usuario y contraseña (prueba).");
  }
});
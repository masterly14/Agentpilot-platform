/**
 * Contenido de la página de prueba social.
 * Los textos son una primera versión; los `src` vacíos son slots listos para
 * cargar los assets reales (logos, fotos de founders, capturas y el video).
 */

export const CTA = {
  primary: { label: "Agendar llamada", href: "/#booking" },
  secondary: { label: "Cuéntanos tu caso", href: "/qualificacion" },
}

export const HERO = {
  badge: "Historias reales de operación",
  titleLead: "Operaciones que corren",
  titleAccent: "en modo avión",
  description:
    "Property managers que dejaron de vivir pegados al celular. El sistema responde huéspedes, asigna limpiezas y cobra mientras ellos hacen otra cosa.",
}

export const LOGOS = [
  { name: "Zapata Hospitality", src: "/logos/zapata.png", className: "h-8 w-auto" },
  { name: "Cozy Apartments", src: "/logos/cozy.png", className: "h-12 w-auto" },
  { name: "M&G Apartments", src: "/logos/mg.png", className: "h-auto w-14" },
  { name: "SpotHost", src: "/logos/spothost.png", className: "h-11 w-auto" },
  { name: "Urus Capital Group", src: "/logos/urus.png", className: "h-10 w-auto" },
  { name: "Administradora Tequendama", src: "/logos/tequendama.png", className: "h-auto w-14" },
]

export const METRICS = [
  {
    value: 100,
    prefix: "+",
    suffix: " h",
    label: "Liberadas cada semana",
    description: "Reservas, mensajes y coordinación que ya no pasan por ti.",
  },
  {
    value: 10,
    prefix: "",
    suffix: "x",
    label: "Crecimiento en facturación",
    description: "Más propiedades gestionadas con el mismo equipo.",
  },
  {
    value: 45,
    prefix: "<",
    suffix: " s",
    label: "Tiempo de respuesta",
    description: "El huésped recibe respuesta antes de cerrar la app.",
  },
  {
    value: 98,
    prefix: "",
    suffix: "%",
    label: "Tareas automatizadas",
    description: "Solo lo excepcional llega a manos de una persona.",
  },
]

export const AIRPLANE = {
  badge: "La prueba real",
  titleLead: "Apaga el celular.",
  titleAccent: "La operación sigue.",
  description:
    "No medimos el éxito en dashboards bonitos. Lo medimos en cuántas horas puedes desaparecer sin que nada se caiga.",
  events: [
    { channel: "Airbnb", text: "Reserva confirmada · Apto 402", tone: "cyan" },
    { channel: "WhatsApp", text: "Huésped respondido en 12 s", tone: "emerald" },
    { channel: "Housekeeping", text: "Limpieza asignada a Marcela", tone: "violet" },
    { channel: "Pagos", text: "Cobro procesado · $420 USD", tone: "amber" },
    { channel: "Check-in", text: "Instrucciones enviadas · Apto 118", tone: "cyan" },
    { channel: "Booking", text: "Calendario sincronizado", tone: "emerald" },
    { channel: "Guest report", text: "Documentación radicada ante SIRE", tone: "violet" },
    { channel: "Reportes", text: "Informe de propietario generado", tone: "amber" },
  ],
} as const

export const FEATURED_TESTIMONIAL = {
  badge: "Testimonio en video",
  quote:
    "Pasamos de vivir dentro del celular a revisar la operación una vez al día. El sistema hace lo que antes hacía un equipo completo.",
  author: "Santiago Zapata",
  role: "Founder",
  company: "Zapata Hospitality",
  avatar: "/zapata-hospitality.jpg",
  videoSrc: "/videos/zapata-testimonial.mp4",
  stats: [
    { value: "+100 h", label: "por semana" },
    { value: "10x", label: "facturación" },
  ],
}

export const TESTIMONIALS = [
  {
    quote:
      "La primera semana pensé que algo se iba a romper. Nunca pasó. Las reservas entraban solas y las limpiezas se asignaban antes de que yo mirara el calendario.",
    author: "Jaime Patiño",
    role: "Founder",
    company: "Administradora Tequendama",
    avatar: "",
  },
  {
    quote:
      "Duplicamos propiedades sin contratar a nadie más. El cuello de botella nunca fue la demanda, era la coordinación.",
    author: "Miguel Angel C. R.",
    role: "COO",
    company: "Urus Capital Group",
    avatar: "",
  },
  {
    quote:
      "Pasamos de vivir dentro del celular a revisar la operación una vez al día. El sistema hace lo que antes hacía un equipo completo.",
    author: "Santiago Zapata",
    role: "Founder",
    company: "Zapata Hospitality",
    avatar: "/zapata-hospitality.jpg",
  },
  {
    quote:
      "Las reseñas subieron porque el huésped recibe respuesta en segundos, a cualquier hora, incluso de madrugada.",
    author: "Santiago Lopez",
    role: "Property Manager",
    company: "inHouse",
    avatar: "",
  },
  {
    quote:
      "Antes cerraba el mes con tres días de conciliación manual. Hoy el reporte a propietarios sale solo.",
    author: "Juan Mendez",
    role: "Director de operaciones",
    company: "Cozy Apartments",
    avatar: "",
  },
  {
    quote:
      "Me fui de viaje dos semanas con el teléfono en silencio. Volví y la ocupación había subido.",
    author: "Nicolas Mendez",
    role: "Founder",
    company: "Cozy Apartments",
    avatar: "",
  },
  {
    quote:
      "Lo que más valoro no es la tecnología, es dejar de ser el único que sabe cómo funciona todo.",
    author: "Sebastian Krhone",
    role: "Founder",
    company: "Sebastian Airbnb",
    avatar: "",
  },
  {
    quote:
      "Dejamos de improvisar cada check-in. El huésped llega con instrucciones claras y nosotros sin mensajes a las 11 p.m.",
    author: "Juan Pinto",
    role: "Property Manager",
    company: "",
    avatar: "",
  },
  {
    quote:
      "Hoy el equipo se enfoca en crecer el inventario. La operación diaria ya no depende de que alguien esté pegado al WhatsApp.",
    author: "Marlon Díaz",
    role: "Founder",
    company: "M&G Apartments",
    avatar: "",
  },
]

export const CASE_STUDY = {
  badge: "Caso de estudio",
  company: "Zapata Hospitality",
  headline: "De ser un esclavo del negocio a manejarlo a miles de kilómetros de distancia.",
  summary:
    "Zapata Hospitality gestionaba su operación entre WhatsApp, hojas de cálculo y el calendario de Airbnb. Centralizamos todo en un solo sistema con IA en cada punto.",
  challenge: [
    "Mensajes de huéspedes atendidos manualmente a toda hora",
    "Calendarios desincronizados entre plataformas",
    "Asignación de limpiezas por WhatsApp, sin trazabilidad",
    "Ningun control financiero interno",
    "Cierre contable manual a fin de mes",
  ],
  solution: [
    "Chatbot de Airbnb y WhatsApp con contexto de cada reserva",
    "Calendario unificado y sincronización de disponibilidad",
    "Housekeeping integral con asignación automática",
    "Reportes a propietarios generados automáticamente",
    "Control financiero interno",
    "Cierre contable automático a fin de mes",
  ],
  comparison: [
    { label: "Horas semanales en operación manual", before: 120, after: 12, unit: "h" },
    { label: "Tiempo de respuesta al huésped", before: 240, after: 1, unit: "min" },
    { label: "Propiedades por persona del equipo", before: 8, after: 60, unit: "" },
  ],
}

export const PRODUCT_SHOTS = [
  {
    id: "dashboard",
    label: "Dashboard",
    caption: "Estado de la operación en una sola vista.",
    src: "/mocks/dashboard.png",
  },
  {
    id: "calendario",
    label: "Calendario",
    caption: "Disponibilidad unificada entre plataformas.",
    src: "/mocks/calendario.png",
  },
  {
    id: "housekeeping",
    label: "Housekeeping",
    caption: "Asignación y seguimiento de limpiezas.",
    src: "/mocks/housekeeping.png",
  },
  {
    id: "chatbot",
    label: "Chatbot",
    caption: "Conversaciones resueltas sin intervención.",
    src: "/mocks/Inbox.png",
  },
  {
    id: "reportes",
    label: "Reportes",
    caption: "Informes a propietarios listos cada mes.",
    src: "/mocks/reporte.png",
  },
]

export const FOUNDER = {
  badge: "El founder",
  titleLead: "Detrás del sistema hay",
  titleAccent: "una persona",
  name: "Santiago Cano Varón",
  role: "CEO & Founder",
  company: "Agent Pilot S.A.S",
  photo: "/founder.png",
  intro: [
    "Agent Pilot no es una agencia tradicional. Hablas conmigo, diseño el sistema contigo y respondo por lo que se construye.",
    "Llevo años construyendo software a medida para empresas que se ahogan en operación manual. Con la renta corta encontré el caso más claro: negocios rentables frenados por la logística, no por la demanda.",
  ],
  timeline: [
    {
      period: "El origen",
      title: "Software a medida",
      description:
        "Empecé desarrollando sistemas para empresas que necesitaban algo que ningún producto genérico resolvía.",
    },
    {
      period: "El giro",
      title: "Primer sistema de renta corta",
      description:
        "Automaticé la operación completa de un property manager: reservas, mensajes, limpiezas y cobros en un solo lugar.",
    },
    {
      period: "Hoy",
      title: "Agent Pilot",
      description:
        "Infraestructura de IA para property managers y empresas de renta corta, con implementación acompañada y soporte directo.",
    },
    {
      period: "Lo que viene",
      title: "Pocos clientes a la vez",
      description:
        "Trabajo con un número limitado de operaciones al mismo tiempo para que cada sistema quede realmente terminado.",
    },
  ],
  highlights: [
    { value: "+15", label: "operaciones automatizadas" },
    { value: "+100 h", label: "liberadas por semana" },
  ],
  closing: "Si tu operación se parece a esto, hablemos.",
}

export const LEAN_TEAM = {
  badge: "Operación liviana",
  titleLead: "No necesitas un equipo grande",
  titleAccent: "ni una nómina de cientos de millones",
  description:
    "Escalar no tiene que significar contratar más gente para responder mensajes, coordinar limpiezas y cerrar el mes. El sistema absorbe la operación repetitiva para que crezcas sin inflar la nómina.",
  contrast: [
    {
      label: "El camino tradicional",
      value: "Más propiedades = más personas",
      detail: "Coordinadores, agentes y turnos que se multiplican con el inventario.",
    },
    {
      label: "Con infraestructura",
      value: "Más propiedades = mismo núcleo",
      detail: "La IA atiende, asigna y reporta. Las personas solo entran en lo excepcional.",
    },
  ],
}

export const FINAL_CTA = {
  titleLead: "¿Listo para poner tu operación",
  titleAccent: "en modo avión?",
  description:
    "Una llamada de 30 minutos para entender tu operación y mostrarte qué se puede automatizar primero.",
  note: "Cupos limitados cada mes. Trabajamos con pocos clientes a la vez.",
}

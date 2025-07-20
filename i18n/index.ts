

export const supportedLanguages = {
  en: "English",
  es: "Español",
};

export type Language = keyof typeof supportedLanguages;

export const translations = {
  en: {
    // General
    "save": "Save",
    "delete": "Delete",
    "cancel": "Cancel",
    "back_to_homepage": "← Back to Homepage",
    "back_to_tour_list": "← Back to Tour List",
    "error": "Error",
    "loading": "Loading...",
    // Promotional Page (TourList)
    "promo_title": "Experience Tours Like Never Before.",
    "promo_subtitle": "Your personal AI guide is ready to explore with you. Instant answers, hidden stories, and a new way to discover the world, available 24/7.",
    "promo_button": "Explore Active Tours",
    "feature_title": "Explore in a New Way",
    "feature_subtitle": "Your adventure starts in three simple steps.",
    "feature_1_title": "1. Find & Scan",
    "feature_1_desc": "Find a tour QR code at a location or select one from our list to begin.",
    "feature_2_title": "2. Chat & Ask",
    "feature_2_desc": "Interact with your AI guide. Ask questions, get details, or use your camera.",
    "feature_3_title": "3. Discover Stories",
    "feature_3_desc": "Uncover hidden gems and fascinating stories that only a local would know.",
    "for_guides_title": "Become a Digital Storyteller",
    "for_guides_desc": "Turn your expertise into an interactive AI tour. It's easy to set up, lets you share your unique knowledge, and even helps you earn tips.",
    "for_guides_register": "Register Now",
    "for_guides_login": "Guide Login",
    "available_tours_title": "Start Your Adventure",
    "available_tours_subtitle": "Select a tour below to begin your journey.",
    "start_tour_action": "Start the tour →",
    "no_tours_title": "No Active Tours Available",
    "no_tours_desc": "Check back later or contact an administrator.",
    "newsletter_title": "Stay Updated",
    "newsletter_desc": "Be the first to know about new tours and exclusive content.",
    "newsletter_placeholder": "Enter your email address",
    "newsletter_button": "Subscribe",
    "newsletter_success": "Success! You have been subscribed.",
    "newsletter_error": "This email is already subscribed.",
    "newsletter_invalid_email": "Please enter a valid email address.",
    "header_tours_link": "Tours",
    "header_guides_link": "For Guides",
    "app_title": "AI Tour Guides",
    // Login Page
    "login_title": "Guide Login",
    "login_subtitle": "Access your tour's admin panel.",
    "email_placeholder": "Email Address",
    "password_placeholder": "Password",
    "login_button": "Login",
    "login_no_account": "Don't have an account?",
    "login_register_link": "Register here",
    "login_error_credentials": "Invalid email or password.",
    "login_error_pending": "Your account is awaiting administrator approval.",
    "login_error_suspended": "Your account has been suspended by an administrator.",
    "login_error_status": "Invalid account status. Please contact support.",
  },
  es: {
    // General
    "save": "Guardar",
    "delete": "Eliminar",
    "cancel": "Cancelar",
    "back_to_homepage": "← Volver a la página principal",
    "back_to_tour_list": "← Volver a la lista de tours",
    "error": "Error",
    "loading": "Cargando...",
    // Promotional Page (TourList)
    "promo_title": "Vive los Tours Como Nunca Antes.",
    "promo_subtitle": "Tu guía personal de IA está listo para explorar contigo. Respuestas instantáneas, historias ocultas y una nueva forma de descubrir el mundo, disponible 24/7.",
    "promo_button": "Explorar Tours Activos",
    "feature_title": "Explora de una Nueva Manera",
    "feature_subtitle": "Tu aventura comienza en tres sencillos pasos.",
    "feature_1_title": "1. Encuentra y Escanea",
    "feature_1_desc": "Busca un código QR en el lugar del tour o selecciona uno de nuestra lista para comenzar.",
    "feature_2_title": "2. Chatea y Pregunta",
    "feature_2_desc": "Interactúa con tu guía de IA. Haz preguntas, obtén detalles o usa tu cámara.",
    "feature_3_title": "3. Descubre Historias",
    "feature_3_desc": "Descubre joyas ocultas e historias fascinantes que solo un local conocería.",
    "for_guides_title": "Conviértete en un Narrador Digital",
    "for_guides_desc": "Convierte tu experiencia en un tour interactivo de IA. Es fácil de configurar, te permite compartir tu conocimiento único e incluso te ayuda a ganar propinas.",
    "for_guides_register": "Regístrate Ahora",
    "for_guides_login": "Login de Guía",
    "available_tours_title": "Comienza Tu Aventura",
    "available_tours_subtitle": "Selecciona un tour a continuación para comenzar tu viaje.",
    "start_tour_action": "Comenzar el tour →",
    "no_tours_title": "No Hay Tours Activos Disponibles",
    "no_tours_desc": "Vuelve más tarde o contacta a un administrador.",
    "newsletter_title": "Mantente Actualizado",
    "newsletter_desc": "Sé el primero en enterarte de nuevos tours y contenido exclusivo.",
    "newsletter_placeholder": "Introduce tu correo electrónico",
    "newsletter_button": "Suscribirse",
    "newsletter_success": "¡Éxito! Te has suscrito.",
    "newsletter_error": "Este correo ya está suscrito.",
    "newsletter_invalid_email": "Por favor, introduce un correo válido.",
    "header_tours_link": "Tours",
    "header_guides_link": "Para Guías",
    "app_title": "Guías Turísticos con IA",
    // Login Page
    "login_title": "Login de Guía",
    "login_subtitle": "Accede al panel de administración de tu tour.",
    "email_placeholder": "Correo Electrónico",
    "password_placeholder": "Contraseña",
    "login_button": "Iniciar Sesión",
    "login_no_account": "¿No tienes una cuenta?",
    "login_register_link": "Regístrate aquí",
    "login_error_credentials": "Correo electrónico o contraseña inválidos.",
    "login_error_pending": "Tu cuenta está pendiente de aprobación por un administrador.",
    "login_error_suspended": "Tu cuenta ha sido suspendida por un administrador.",
    "login_error_status": "Estado de cuenta no válido. Por favor, contacta a soporte.",
  }
};

export function getInitialLanguage(): Language {
  const savedLang = localStorage.getItem('language') as Language;
  if (savedLang && supportedLanguages[savedLang]) {
    return savedLang;
  }
  const browserLang = navigator.language.split('-')[0] as Language;
  if (supportedLanguages[browserLang]) {
    return browserLang;
  }
  return 'en';
}
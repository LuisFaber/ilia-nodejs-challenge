export default {
  common: {
    appName: "walletX",
    loading: "Cargando...",
    error: "Error",
    save: "Guardar",
    cancel: "Cancelar",
    close: "Cerrar",
  },
  auth: {
    login: "Iniciar sesión",
    register: "Registrarse",
    email: "Correo electrónico",
    password: "Contraseña",
    firstName: "Nombre",
    lastName: "Apellido",
    loginSuccess: "Sesión iniciada.",
    loginError: "Credenciales inválidas.",
    sessionExpired: "Sesión expirada.",
  },
  wallet: {
    balance: "Saldo",
    transactions: "Transacciones",
    credit: "Crédito",
    debit: "Débito",
    createTransaction: "Nueva transacción",
    amount: "Monto",
    insufficientBalance: "Saldo insuficiente para débito.",
    emptyTransactions: "Aún no hay transacciones.",
  },
  landing: {
    hero: {
      title: "Controla tu órbita financiera.",
      subtitle: "Una plataforma de billetera digital segura y moderna para precisión y control.",
      ctaLogin: "Entrar",
      ctaRegister: "Crear cuenta",
    },
    navbar: {
      ctaLogin: "Entrar",
      logoAlt: "WalletX",
      themeLight: "Cambiar a tema claro",
      themeDark: "Cambiar a tema oscuro",
    },
    features: {
      title: "Hecho para precisión financiera",
      cards: {
        secure: { title: "Seguro por diseño", description: "Seguridad de nivel empresarial para tus activos y datos." },
        control: { title: "Control en tiempo real", description: "Visibilidad y control instantáneos en cada transacción." },
        insights: { title: "Insights inteligentes", description: "Análisis claros para guiar tus decisiones financieras." },
      },
    },
    footer: {
      copyright: "© 2026 WalletX. Todos los derechos reservados.",
    },
  },
} as const;

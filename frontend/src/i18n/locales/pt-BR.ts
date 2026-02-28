export default {
  common: {
    appName: "walletX",
    loading: "Carregando...",
    error: "Erro",
    save: "Salvar",
    cancel: "Cancelar",
    close: "Fechar",
  },
  auth: {
    login: "Entrar",
    register: "Registrar",
    email: "E-mail",
    password: "Senha",
    firstName: "Nome",
    lastName: "Sobrenome",
    loginSuccess: "Login realizado.",
    loginError: "Credenciais inválidas.",
    sessionExpired: "Sessão expirada.",
  },
  wallet: {
    balance: "Saldo",
    transactions: "Transações",
    credit: "Crédito",
    debit: "Débito",
    createTransaction: "Nova transação",
    amount: "Valor",
    insufficientBalance: "Saldo insuficiente para débito.",
    emptyTransactions: "Nenhuma transação ainda.",
  },
  landing: {
    hero: {
      title: "Controle sua órbita financeira.",
      subtitle: "Uma plataforma de carteira digital segura e moderna para precisão e controle.",
      ctaLogin: "Entrar",
      ctaRegister: "Criar Conta",
    },
    navbar: {
      ctaLogin: "Entrar",
      logoAlt: "WalletX",
      themeLight: "Alternar para tema claro",
      themeDark: "Alternar para tema escuro",
    },
    features: {
      title: "Feito para precisão financeira",
      cards: {
        secure: { title: "Seguro por design", description: "Segurança de nível empresarial para seus ativos e dados." },
        control: { title: "Controle em tempo real", description: "Visibilidade e controle instantâneos em cada transação." },
        insights: { title: "Insights inteligentes", description: "Análises claras para guiar suas decisões financeiras." },
      },
    },
    footer: {
      copyright: "© 2026 WalletX. Todos os direitos reservados.",
    },
  },
} as const;

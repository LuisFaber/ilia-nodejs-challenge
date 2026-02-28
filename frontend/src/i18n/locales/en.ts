export default {
  common: {
    appName: "walletX",
    loading: "Loading...",
    error: "Error",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
  },
  auth: {
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    firstName: "First name",
    lastName: "Last name",
    loginSuccess: "Login successful.",
    loginError: "Invalid credentials.",
    sessionExpired: "Session expired.",
  },
  wallet: {
    balance: "Balance",
    transactions: "Transactions",
    credit: "Credit",
    debit: "Debit",
    createTransaction: "New transaction",
    amount: "Amount",
    insufficientBalance: "Insufficient balance for debit.",
    emptyTransactions: "No transactions yet.",
  },
  landing: {
    hero: {
      title: "Control your financial orbit.",
      subtitle: "A secure and modern digital wallet platform built for precision and control.",
      ctaLogin: "Log in",
      ctaRegister: "Create account",
    },
    navbar: {
      ctaLogin: "Log in",
      logoAlt: "WalletX",
      themeLight: "Switch to light theme",
      themeDark: "Switch to dark theme",
    },
    features: {
      title: "Built for financial precision",
      cards: {
        secure: { title: "Secure by Design", description: "Enterprise-grade security for your assets and data." },
        control: { title: "Real-time Control", description: "Instant visibility and control over every transaction." },
        insights: { title: "Smart Insights", description: "Clear analytics to guide your financial decisions." },
      },
    },
    footer: {
      copyright: "© 2026 WalletX. All rights reserved.",
    },
  },
} as const;

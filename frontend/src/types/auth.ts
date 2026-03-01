export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  language?: "en" | "pt" | "es";
};

export type AuthResponse = {
  user: User;
  access_token: string;
};

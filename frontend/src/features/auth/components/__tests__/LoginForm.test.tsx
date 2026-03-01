import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../LoginForm";

const mockPush = jest.fn();
const mockLogin = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: (...args: unknown[]) => mockPush(...args) }),
}));

jest.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

jest.mock("framer-motion", () => ({
  motion: {
    h1: ({ children, ...props }: React.ComponentProps<"h1">) => (
      <h1 {...props}>{children}</h1>
    ),
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
    p: ({ children, ...props }: React.ComponentProps<"p">) => (
      <p {...props}>{children}</p>
    ),
  },
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockLogin.mockClear();
  });

  it("renders email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("email")).toBeInTheDocument();
    expect(screen.getByLabelText("password")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: "login" })).toBeInTheDocument();
  });

  it("shows validation error when email is empty on submit", async () => {
    render(<LoginForm />);
    await userEvent.click(screen.getByRole("button", { name: "login" }));
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  it("does not call login when email is invalid", async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText("email"), "notanemail");
    await userEvent.type(screen.getByLabelText("password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "login" }));
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  it("calls login with correct credentials on valid submit", async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText("email"), "user@example.com");
    await userEvent.type(screen.getByLabelText("password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "login" }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("user@example.com", "password123");
    });
  });

  it("redirects to /dashboard after successful login", async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText("email"), "user@example.com");
    await userEvent.type(screen.getByLabelText("password"), "password123");
    await userEvent.click(screen.getByRole("button", { name: "login" }));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows server error message on failed login", async () => {
    mockLogin.mockRejectedValue(new Error("Invalid credentials"));
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText("email"), "user@example.com");
    await userEvent.type(screen.getByLabelText("password"), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: "login" }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
    });
  });
});

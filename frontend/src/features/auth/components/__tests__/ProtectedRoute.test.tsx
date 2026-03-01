import { render, screen, waitFor } from "@testing-library/react";
import { ProtectedRoute } from "../ProtectedRoute";

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: (...args: unknown[]) => mockReplace(...args) }),
}));

const mockAuthState = { isAuthenticated: false, isLoading: false };

jest.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: () => mockAuthState,
}));

jest.mock("@/components/ui/Spinner", () => ({
  Spinner: () => <div data-testid="loading-spinner" />,
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockAuthState.isAuthenticated = false;
    mockAuthState.isLoading = false;
  });

  it("shows the loading spinner while auth state is resolving", () => {
    mockAuthState.isLoading = true;
    render(
      <ProtectedRoute>
        <p>protected content</p>
      </ProtectedRoute>
    );
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.queryByText("protected content")).not.toBeInTheDocument();
  });

  it("redirects to /auth/login when the user is not authenticated", async () => {
    mockAuthState.isAuthenticated = false;
    mockAuthState.isLoading = false;
    render(
      <ProtectedRoute>
        <p>protected content</p>
      </ProtectedRoute>
    );
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("renders children when the user is authenticated", () => {
    mockAuthState.isAuthenticated = true;
    render(
      <ProtectedRoute>
        <p>protected content</p>
      </ProtectedRoute>
    );
    expect(screen.getByText("protected content")).toBeInTheDocument();
  });

  it("does not call redirect when user is authenticated", () => {
    mockAuthState.isAuthenticated = true;
    render(
      <ProtectedRoute>
        <p>content</p>
      </ProtectedRoute>
    );
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

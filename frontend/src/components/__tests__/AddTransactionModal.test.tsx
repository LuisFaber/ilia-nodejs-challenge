import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddTransactionModal } from "../AddTransactionModal";
import { walletService } from "@/features/wallet/services/wallet.service";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "en" },
  }),
}));

type MotionProps = {
  children?: React.ReactNode;
  whileHover?: unknown;
  whileTap?: unknown;
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: unknown;
  [key: string]: unknown;
};

const MOTION_KEYS = [
  "whileHover",
  "whileTap",
  "initial",
  "animate",
  "exit",
  "transition",
];

function stripMotionProps(props: MotionProps) {
  const { children, ...rest } = props;
  const domProps = { ...rest };
  MOTION_KEYS.forEach((k) => delete (domProps as Record<string, unknown>)[k]);
  return { children, ...domProps };
}

jest.mock("framer-motion", () => ({
  motion: {
    div: (props: MotionProps) => <div {...stripMotionProps(props)} />,
    button: (props: MotionProps) => (
      <button {...stripMotionProps(props)} />
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("@/components/SegmentedControl", () => ({
  SegmentedControl: ({
    value,
    onChange,
    options,
  }: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
  }) => (
    <div>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock("@/features/wallet/services/wallet.service", () => ({
  walletService: { createTransaction: jest.fn() },
}));

const mockCreate = walletService.createTransaction as jest.Mock;

describe("AddTransactionModal", () => {
  const onClose = jest.fn();
  const onSuccess = jest.fn();

  const defaultProps = { isOpen: true, onClose, onSuccess };

  beforeEach(() => {
    mockCreate.mockClear();
    onClose.mockClear();
    onSuccess.mockClear();
  });

  it("does not render when isOpen is false", () => {
    render(<AddTransactionModal isOpen={false} onClose={onClose} onSuccess={onSuccess} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the modal dialog when isOpen is true", () => {
    render(<AddTransactionModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows amount validation error when submitting without an amount", async () => {
    render(<AddTransactionModal {...defaultProps} />);
    await userEvent.click(screen.getByText("confirm"));
    expect(screen.getByText("errorAmountInvalid")).toBeInTheDocument();
  });

  it("shows amount validation error for zero amount", async () => {
    render(<AddTransactionModal {...defaultProps} />);
    await userEvent.type(screen.getByLabelText("amount"), "0");
    await userEvent.click(screen.getByText("confirm"));
    expect(screen.getByText("errorAmountInvalid")).toBeInTheDocument();
  });

  it("calls createTransaction and onSuccess on valid submit", async () => {
    mockCreate.mockResolvedValue({ id: "1", amount: 50, type: "credit" });
    render(<AddTransactionModal {...defaultProps} />);
    await userEvent.type(screen.getByLabelText("amount"), "50");
    await userEvent.click(screen.getByText("confirm"));
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        amount: 50,
        type: "credit",
        description: undefined,
      });
      expect(onSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("creates a debit transaction when debit type is selected", async () => {
    mockCreate.mockResolvedValue({ id: "2", amount: 30, type: "debit" });
    render(<AddTransactionModal {...defaultProps} />);
    await userEvent.click(screen.getByText("debit"));
    await userEvent.type(screen.getByLabelText("amount"), "30");
    await userEvent.click(screen.getByText("confirm"));
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        amount: 30,
        type: "debit",
        description: undefined,
      });
    });
  });

  it("shows friendly insufficient balance message when debit exceeds available balance", async () => {
    mockCreate.mockRejectedValue(new Error("Insufficient balance for debit"));
    render(<AddTransactionModal {...defaultProps} />);
    await userEvent.click(screen.getByText("debit"));
    await userEvent.type(screen.getByLabelText("amount"), "999");
    await userEvent.click(screen.getByText("confirm"));
    await waitFor(() => {
      expect(screen.getByText("insufficientBalance")).toBeInTheDocument();
    });
  });

  it("calls onClose when the cancel button is clicked", async () => {
    render(<AddTransactionModal {...defaultProps} />);
    await userEvent.click(screen.getByText("cancel"));
    expect(onClose).toHaveBeenCalled();
  });
});

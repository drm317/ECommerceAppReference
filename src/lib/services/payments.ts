import { COMMERCETOOLS_ENABLED } from "@/lib/config/env";
import { mockPayments } from "@/lib/data/mock-data";
import { commercetoolsFetch } from "@/lib/services/commercetools";
import type { Payment, PaymentStatus } from "@/lib/types";

type CTPayment = {
  id: string;
  createdAt: string;
  lastModifiedAt: string;
  amountPlanned: { centAmount: number; currencyCode: string };
  paymentStatus?: { interfaceCode?: string };
};

const payments = new Map<string, Payment>(
  mockPayments.map((payment) => [payment.id, payment])
);

const mapPaymentStatus = (status?: string): PaymentStatus => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "paid";
    case "authorized":
      return "authorized";
    case "failed":
      return "failed";
    default:
      return "pending";
  }
};

const mapPayment = (payment: CTPayment): Payment => ({
  id: payment.id,
  amount: payment.amountPlanned.centAmount / 100,
  currency: payment.amountPlanned.currencyCode,
  status: mapPaymentStatus(payment.paymentStatus?.interfaceCode),
  orderId: null,
  createdAt: payment.createdAt,
  updatedAt: payment.lastModifiedAt,
});

export const getPaymentById = async (id: string): Promise<Payment | null> => {
  if (COMMERCETOOLS_ENABLED) {
    try {
      const payment = await commercetoolsFetch<CTPayment>(`/payments/${id}`);
      return mapPayment(payment);
    } catch (error) {
      if (error instanceof Error && /404/.test(error.message)) {
        return null;
      }
      throw error;
    }
  }

  return payments.get(id) ?? null;
};

export const createPayment = async (input: {
  amount: number;
  currency?: string;
  orderId?: string | null;
  status?: PaymentStatus;
}): Promise<Payment> => {
  if (COMMERCETOOLS_ENABLED) {
    const payload = {
      amountPlanned: {
        currencyCode: input.currency ?? "USD",
        centAmount: Math.round(input.amount * 100),
      },
      paymentMethodInfo: {
        paymentInterface: "external",
        method: "card",
        name: { en: "Card" },
      },
      paymentStatus: input.status
        ? { interfaceCode: input.status }
        : undefined,
    };

    const payment = await commercetoolsFetch<CTPayment>("/payments", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return mapPayment(payment);
  }

  const now = new Date().toISOString();
  const payment: Payment = {
    id: `pay_${Math.floor(Math.random() * 9000 + 1000)}`,
    amount: input.amount,
    currency: input.currency ?? "USD",
    status: input.status ?? "pending",
    orderId: input.orderId ?? null,
    createdAt: now,
    updatedAt: now,
  };

  payments.set(payment.id, payment);
  return payment;
};

import DodoPayments from "dodopayments";

/**
 * DodoPayments Client Singleton
 * Uses environment variables for configuration
 */

const apiKey = process.env.DODO_PAYMENTS_API_KEY;

if (!apiKey) {
    console.warn("DODO_PAYMENTS_API_KEY is not configured. Billing features will fail.");
}

export const dodoClient = new DodoPayments({
    bearerToken: apiKey || "",
    environment: process.env.NODE_ENV === "production" ? "live_mode" : "test_mode",
});

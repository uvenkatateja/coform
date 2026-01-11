/**
 * Security Service
 * Handles spam protection verification (Turnstile)
 */

export const securityService = {
    /**
     * Verify Cloudflare Turnstile token
     */
    async verifyTurnstile(token: string): Promise<boolean> {
        const secretKey = process.env.TURNSTILE_SECRET_KEY;

        // If no key is configured, fail open? OR fail closed?
        // Commercial grade: Fail closed logging error?
        if (!secretKey) {
            console.warn("TURNSTILE_SECRET_KEY is not configured. Skipping verification.");
            return true; // Weak fail-open for testing
        }

        try {
            const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    secret: secretKey,
                    response: token,
                }),
            });

            const data = await response.json();
            return data.success === true;
        } catch (error) {
            console.error("Turnstile verification error:", error);
            return false;
        }
    },
};

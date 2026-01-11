# CoForm

The AI-Powered, Collaborative Form Builder for Modern Teams.
Built with Next.js 16, Supabase, DodoPayments, and Gemini AI.

## 🚀 Key Features

### 1. Multi-Tenancy (Teams)
- **Organization Support**: Create and manage multiple teams.
- **Role-Based Access**: Secure form access for team members.
- **Context Switching**: Seamlessly switch between Personal Workspace and Teams.

### 2. AI Form Generation
- **One-Shot Creation**: detailed forms generated from a single text prompt.
- **Powered by Google Gemini**: Uses advanced LLMs for schema generation.

### 3. Billing & Subscriptions
- **DodoPayments Integration**: Modern payment processing.
- **Flexible Plans**: Free, Pro, and Enterprise tiers.
- **Database Sync**: Robust subscription tracking via Webhooks.

### 4. Enterprise-Grade Security
- **Spam Protection**: Integrated Cloudflare Turnstile.
- **Row Level Security**: Supabase RLS policies for data safety.

### 5. Premium UX/UI
- **Marketing Site**: High-conversion landing page with 3D elements.
- **Dashboard**: Clean, data-rich interface.
- **Drag & Drop Builder**: Intuitive form construction.

## 🛠️ Tech Stack vs Competitors (e.g., Ikiform)

| Feature | CoForm | Standard Competitors |
| :--- | :--- | :--- |
| **Billing** | **DodoPayments** (Global, Modern) | Polar.sh / Stripe |
| **Architecture** | **Multi-Tenant (Teams)** | Single User |
| **AI Model** | **Google Gemini** | OpenAI / Cohere |
| **Protection** | **Cloudflare Turnstile** | Basic Captcha / BotID |
| **State** | **URL-Driven** (Shareable) | Local State |

## 📦 getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Setup**
   Copy `.env.example` to `.env.local` and fill in keys for:
   - Supabase
   - Google Gemini
   - DodoPayments
   - Cloudflare Turnstile

3. **Run Development Server**
   ```bash
   pnpm dev
   ```

## 💳 Billing Setup

1. Create products in DodoPayments dashboard.
2. Add Product IDs to `.env.local`.
3. Set webhook URL to `https://your-domain.com/api/webhooks/dodo`.

## 🤝 Contributing

Built by [Your Name].

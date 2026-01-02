# MediPay - Prescription Cost Manager

A real-time AI-driven prescription cost and payment planning system inspired by Optum Real.

## Features

- **Patient Dashboard** - Monitor prescription costs and payment plans with interactive charts
- **Prescription Management** - Add and track prescriptions with real-time cost validation
- **AI-Based Cost Prediction** - Annual cost prediction using growth factors and seasonal adjustments
- **Payment Planning** - Monthly EMI calculation and payment simulation
- **Alerts System** - Real-time alerts for high costs and upcoming payments
- **Transaction History** - Track all payment transactions

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Backend**: Supabase (Database + Authentication)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)

### Installation

1. Clone the repository and navigate to the project directory:

```bash
cd project
```

2. Install dependencies:

```bash
npm install
```

3. Set up Supabase:

   a. Go to [supabase.com](https://supabase.com) and create a new project

   b. Once your project is created, go to Project Settings > API

   c. Copy your project URL and anon/public key

4. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

5. Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

6. The database schema is already set up! The tables were created during development.

### Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

3. Register a new account and start using MediPay!

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── contexts/
│   └── AuthContext.tsx       # Authentication context and hooks
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── pages/
│   ├── Login.tsx             # Login page
│   ├── Register.tsx          # Registration page
│   ├── Dashboard.tsx         # Main dashboard with charts
│   ├── PrescriptionForm.tsx  # Add prescription form
│   ├── CostPrediction.tsx    # Cost prediction page
│   └── PaymentPlan.tsx       # Payment management page
├── App.tsx                   # Main app with routing
├── main.tsx                  # App entry point
└── index.css                 # Global styles
```

## Database Schema

The application uses the following tables:

- **profiles** - User profile information
- **prescriptions** - Prescription details and costs
- **payments** - Payment transactions
- **alerts** - System alerts and notifications
- **cost_predictions** - AI-generated cost predictions

## Features in Detail

### Real-Time Cost Validation

When adding a prescription, if the monthly cost exceeds $500, the system:
- Shows an instant warning message
- Creates an alert in your dashboard
- Allows you to proceed or modify the prescription

### AI-Based Prediction

The cost prediction algorithm:
- Analyzes your current monthly prescription costs
- Applies growth factors (±5% variation)
- Incorporates seasonal adjustments
- Projects costs for the next 12 months
- Calculates total annual cost and monthly EMI

### Payment Simulation

- Toggle auto-pay for automatic monthly deductions
- Simulate one-time payments
- View complete transaction history
- Track payment status (completed, pending, failed)

### Alerts System

Automatically generates alerts for:
- High-cost prescriptions (>$500/month)
- Successful payments
- Prescription changes affecting costs

## Deployment

### GitHub Pages

1. Update `vite.config.ts` to set the base path:

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... other config
});
```

2. Build the project:

```bash
npm run build
```

3. Deploy the `dist` folder to GitHub Pages

### Vercel/Netlify

1. Connect your repository to Vercel or Netlify
2. Set the build command to `npm run build`
3. Set the output directory to `dist`
4. Add your environment variables in the dashboard

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Troubleshooting

### Blank Page After Login

Make sure your Supabase credentials are correct in the `.env` file.

### Authentication Errors

1. Check that your Supabase project is active
2. Verify the API keys are correct
3. Ensure Row Level Security policies are enabled

### Build Errors

Run these commands:

```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

## Support

For issues or questions, please check:
- Supabase documentation: https://supabase.com/docs
- React Router documentation: https://reactrouter.com
- Recharts documentation: https://recharts.org

## License

MIT

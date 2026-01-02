# MediPay Quick Start

Get MediPay running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (takes 1-2 minutes to initialize)
3. Go to Project Settings > API
4. Copy your **Project URL** and **anon/public key**

## Step 3: Configure Environment Variables

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Step 4: Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Step 5: Try It Out

1. **Register**: Click "Sign up" and create an account
2. **Add Prescription**: Click "Add Prescription" and fill in:
   - Medicine: "Aspirin"
   - Dosage: "100mg"
   - Frequency: "Once daily"
   - Monthly Cost: "25.00"
   - Disease Type: "Heart Disease"
3. **View Prediction**: See your annual cost prediction
4. **Make Payment**: Try the payment simulation

## Done!

You now have a fully functional prescription cost management system.

## What's Next?

- **Customize**: Edit colors, thresholds, and features
- **Deploy**: See DEPLOYMENT.md for hosting options
- **Learn More**: Check README.md for detailed documentation

## Troubleshooting

### Blank page?
- Check browser console (F12) for errors
- Verify your Supabase credentials in `.env`
- Make sure Supabase project is fully initialized

### Authentication errors?
- Double-check your API keys
- Ensure you copied the full key (they're very long)
- Use the "anon/public" key, not "service_role"

### Build errors?
```bash
rm -rf node_modules package-lock.json
npm install
```

## Need Help?

Check out:
- **SETUP.md** - Detailed setup instructions
- **README.md** - Full documentation
- **DEPLOYMENT.md** - Deployment guides

Happy coding!

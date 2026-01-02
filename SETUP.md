# MediPay Setup Guide

This guide will walk you through setting up MediPay from scratch, including Supabase configuration.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Fill in the project details:
   - Name: MediPay (or any name you prefer)
   - Database Password: Create a strong password (save this!)
   - Region: Choose the closest region to you
4. Click "Create new project" and wait for it to initialize (1-2 minutes)

## Step 2: Get Your API Keys

1. Once your project is ready, go to **Project Settings** (gear icon in the sidebar)
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`
4. Keep this page open, you'll need these values soon

## Step 3: Configure the Database

The database schema has already been created! It includes these tables:
- `profiles` - User information
- `prescriptions` - Prescription data
- `payments` - Payment transactions
- `alerts` - System notifications
- `cost_predictions` - Cost projections

If you need to verify or recreate the schema:

1. Go to the **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy and paste the migration SQL from the development logs
4. Click **Run**

## Step 4: Configure Environment Variables

1. In your project directory, copy the example environment file:

```bash
cp .env.example .env
```

2. Open `.env` in your text editor:

```bash
code .env
```

3. Replace the placeholder values with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

4. Save the file

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Run the Application

```bash
npm run dev
```

The application should now be running at `http://localhost:5173`

## Step 7: Test the Application

1. **Register a New Account**
   - Go to `http://localhost:5173`
   - Click "Sign up"
   - Enter your name, email, and password
   - Click "Sign Up"

2. **Add a Prescription**
   - Click "Add Prescription" in the dashboard
   - Fill in the form:
     - Medicine Name: e.g., "Metformin"
     - Dosage: e.g., "500mg"
     - Frequency: e.g., "Twice daily"
     - Monthly Cost: e.g., "45.00"
     - Disease Type: e.g., "Diabetes"
   - Click "Save Prescription"

3. **View Cost Prediction**
   - After adding a prescription, you'll be redirected to the Cost Prediction page
   - You'll see the annual cost projection and monthly EMI
   - The prediction uses AI-like algorithms to forecast future costs

4. **Manage Payments**
   - Click "View Payment Plan" or navigate to the Payment Plan page
   - Try the payment simulation
   - Toggle auto-pay on/off
   - Make a test payment

## Troubleshooting

### Problem: Blank page or infinite loading

**Solution**: Check your browser console (F12) for errors. Common issues:
- Wrong Supabase URL or API key
- Supabase project not fully initialized (wait a few minutes)
- Row Level Security policies not properly set up

### Problem: Authentication errors

**Solution**:
1. Verify your Supabase project is active
2. Check that the API key is the "anon/public" key, not the "service_role" key
3. Make sure you copied the entire key (they're very long)

### Problem: "Cannot read properties of null"

**Solution**: This usually means:
- No data exists yet (add a prescription first)
- Database query failed (check Supabase logs)
- User is not authenticated (log in again)

### Problem: CORS errors

**Solution**:
- Make sure you're using the correct Supabase URL
- Check that your Supabase project allows requests from localhost

### Problem: Build fails

**Solution**:
```bash
# Clear everything and reinstall
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

## Supabase Dashboard Overview

### SQL Editor
- Run custom SQL queries
- View query history
- Test database operations

### Table Editor
- View and edit table data directly
- See all tables and their structure
- Manually add/edit/delete rows

### Authentication
- View registered users
- Configure auth settings
- Manage auth providers

### API Docs
- Auto-generated API documentation
- Example queries for each table
- Test API endpoints

## Security Notes

1. **Never commit your `.env` file** - It's in `.gitignore` by default
2. **Use environment variables** - Don't hardcode API keys
3. **The anon key is safe** - It's designed to be public, protected by Row Level Security
4. **Keep your database password secure** - Only needed for direct database access

## Next Steps

Once everything is working:

1. **Customize the cost threshold** - Edit `COST_THRESHOLD` in `PrescriptionForm.tsx`
2. **Adjust the prediction algorithm** - Modify the growth factors in the prediction logic
3. **Add more disease types** - Update the dropdown options
4. **Customize the UI** - Tailwind CSS makes it easy to modify colors and styles

## Production Deployment

When deploying to production:

1. **Vercel/Netlify**:
   - Add environment variables in the dashboard
   - Build command: `npm run build`
   - Output directory: `dist`

2. **GitHub Pages**:
   - Update `vite.config.ts` with the base path
   - Use GitHub Actions to deploy the `dist` folder

3. **Supabase**:
   - No changes needed
   - Same project works for dev and production
   - Consider upgrading to a paid plan for production use

## Getting Help

- **Supabase Issues**: https://github.com/supabase/supabase/discussions
- **React Issues**: https://react.dev/community
- **Vite Issues**: https://vitejs.dev/guide/

## Database Backup

To backup your data:

1. Go to **Database** > **Backups** in Supabase
2. Enable automatic backups (paid plans)
3. Or manually export data from the Table Editor

## Monitoring

Supabase provides built-in monitoring:

1. **Database** > **Usage** - See database size and connections
2. **Authentication** > **Users** - View user growth
3. **API** > **Logs** - Debug API requests

Enjoy using MediPay!

# LeetUIUX - Design Challenges & Submissions

LeetUIUX is a platform for UI/UX designers to practice design challenges, submit their solutions, and get feedback from the community.

## Features

- Browse design challenges by difficulty and category
- Submit your design solutions with Figma embeds
- View and comment on other designers' submissions
- Track your progress and earn badges

## Tech Stack

- React 19
- Vite 6
- Tailwind CSS
- Supabase (Authentication, Database, Storage)
- React Router

## Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Deployment to Vercel

### Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [Supabase](https://supabase.com) project

### Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to your Vercel account
3. Click "Add New" > "Project"
4. Import your Git repository
5. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
7. Click "Deploy"

### Post-Deployment

1. Set up a custom domain (optional)
2. Configure Supabase authentication redirect URLs to include your Vercel domain
3. Test the application thoroughly after deployment

## License

MIT

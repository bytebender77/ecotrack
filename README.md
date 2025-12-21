# 🌱 EcoTrack

**Track your carbon footprint, join eco-challenges, and make a positive environmental impact.**

EcoTrack is a full-stack web application that helps users monitor their daily carbon emissions, discover sustainable alternatives, participate in eco-challenges, and compete on a global leaderboard.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-green)

---

## ✨ Features

### 🧮 Carbon Calculator
- **Transport**: Track emissions from cars, bikes, public transit, and walking
- **Food**: Log meals (meat, vegetarian, vegan) and their carbon impact
- **Energy**: Monitor electricity, heating, and cooling usage
- **Real-time Impact**: See immediate CO₂ calculations and eco-points

### 📊 Dashboard
- Live statistics: Total CO₂ saved, eco score, current streak
- Interactive emission charts (last 7 days)
- Recent activity feed
- Tree equivalent visualizations

### 🗺️ Live AQI Map
- Real-time Air Quality Index (AQI) for major cities
- Geolocation-based: Centers on your current location
- Color-coded markers: Good, Moderate, Unhealthy, Hazardous
- Powered by Open-Meteo API

### 🏆 Leaderboard
- Global rankings by eco score
- Top 3 podium visualization
- Highlight your position
- Public/private profile settings

### 🎯 Eco Challenges
- Join weekly/monthly challenges
- Track progress toward goals
- Earn bonus points and badges
- Categories: Transport, Food, Energy

### 📋 Activity History
- View all logged activities
- Filter by type (Transport, Food, Energy)
- See carbon impact per activity
- Metadata tracking (distance, meals, hours)

### 👤 Profile Settings
- Edit personal information
- Toggle email notifications
- Public/private profile
- View lifetime stats

---

## 🚀 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/ui components
- Recharts (data visualization)
- Leaflet (maps)

**Backend:**
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs (password hashing)

**External APIs:**
- Open-Meteo Air Quality API

---

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/ecotrack.git
   cd ecotrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/ecotrack"
   JWT_SECRET="your-secret-key-minimum-32-chars"
   ```

4. **Set up database**
   ```bash
   # Push schema to database
   npx prisma db push
   
   # Generate Prisma Client
   npx prisma generate
   
   # Seed sample challenges (optional)
   npx prisma db seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions using:
- **Vercel** (Next.js app)
- **Railway** or **Supabase** (PostgreSQL database)

Quick deploy:
```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
ecotrack/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── calculator/        # Carbon calculator components
│   ├── dashboard/         # Dashboard widgets
│   ├── challenges/        # Challenge cards and lists
│   ├── leaderboard/       # Leaderboard components
│   ├── map/               # AQI map components
│   ├── profile/           # Profile settings
│   └── ui/                # Shadcn/ui components
├── context/               # React Context (Auth, Theme)
├── lib/                   # Utilities and constants
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT tokens (32+ chars) |

---

## 🧪 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (DB GUI)
npx prisma db seed   # Seed sample challenges
```

---

## 🌍 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Open-Meteo** for free AQI data API
- **Shadcn/ui** for beautiful components
- **Vercel** for hosting platform
- **Prisma** for database tooling

---


**🌱 Start tracking your carbon footprint today and make a positive impact on the planet!**

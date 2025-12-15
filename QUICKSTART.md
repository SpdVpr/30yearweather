# ⚡ Quick Start Guide

## 🚀 Get Running in 3 Minutes

### Prerequisites
- Python 3.x installed
- Node.js 18+ installed
- Internet connection

### Step 1: Backend (Generate Data)
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python etl.py
```
✅ This creates `data/prague-cz.json` with 30 years of weather data

### Step 2: Frontend (Start Dev Server)
```powershell
cd ..\frontend
npm install --legacy-peer-deps
npm run dev
```
✅ Server starts at `http://localhost:3000`

### Step 3: View the App
Open your browser and visit:
- **Dashboard**: http://localhost:3000/prague-cz
- **Specific Date**: http://localhost:3000/prague-cz/07-15

---

## 🎯 What You'll See

### Prague Dashboard (`/prague-cz`)
- 📊 Annual statistics cards
- 🗓️ Heatmap calendar (366 days color-coded by wedding suitability)
- 📈 Best days for weddings

### Date Detail Page (`/prague-cz/07-15`)
- ✅ **Verdict Banner**: YES/NO/MAYBE for wedding on that date
- 📉 **Temperature Chart**: 30-year average min/max temps
- 🌧️ **Rain Chart**: Historical precipitation probability
- 👔 **Smart Suitcase**: What to pack based on weather
- 📋 **Day Stats**: Wind, temp, rain summary

---

## 🔧 Troubleshooting

### "File not found" error
Make sure you ran `python etl.py` in the backend folder first.

### `npm install` fails
Use the `--legacy-peer-deps` flag:
```powershell
npm install --legacy-peer-deps
```

### Port 3000 already in use
Change the port or kill the existing process:
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F

# Or just use a different port
npm run dev -- -p 3001
```

---

## 📝 Firebase Setup (Optional)

Firebase credentials are already configured in `.env.local`. The app works without needing Firebase for now (uses local JSON).

To enable Firebase in the future:
1. Uncomment Firestore code in `src/lib/data.ts`
2. Set up Firebase Admin SDK in backend
3. Upload data with Python script

---

## 🎨 Customization

### Change a City
Edit `backend/config.py`:
```python
LOCATIONS = {
    "your-city": {
        "name": "Your City",
        "country": "Your Country",
        "lat": 50.0755,
        "lon": 14.4378,
        "is_coastal": False,
        "timezone": "Europe/Prague"
    }
}
```

Run `python etl.py` again.

### Adjust Wedding Score Thresholds
Edit `backend/config.py`:
```python
THRESHOLDS = {
    "wedding": {
        "temp_min": 18,  # Increase for warmer preference
        "temp_max": 28,  # Decrease for cooler preference
        "precip_max": 0.5,  # Lower = less tolerant of rain
        "wind_max": 15  # Lower = less windy tolerance
    }
}
```

---

## ✅ Success Checklist

- [ ] Backend `data/prague-cz.json` file exists
- [ ] Frontend `src/data/prague-cz.json` file exists
- [ ] Dev server running on port 3000
- [ ] Dashboard page loads with heatmap
- [ ] Detail page shows charts and verdict
- [ ] Firebase credentials in `.env.local`

---

## 📚 Next Steps

1. **Read README.md** for full documentation
2. **Check IMPLEMENTATION_SUMMARY.md** for project status
3. **Add more cities** following the guide
4. **Deploy to Vercel** (after fixing production build)

---

**Need Help?** Check the full README.md or review the code comments.

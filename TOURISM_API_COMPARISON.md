# Tourism API - Rychlé srovnání

| API | 🆓 Free? | 🔑 API Key? | 📊 Crowds Data | 💰 Price Data | 🕐 Historical | ⭐ Hodnocení |
|-----|---------|------------|----------------|---------------|---------------|--------------|
| **World Bank** | ✅ Ano | ❌ Ne | ✅ Arrivals (roční) | ❌ Ne | ✅ Ano (1995+) | ⭐⭐⭐⭐ |
| **Avoid Crowds** | ⚠️ Možná | ✅ Ano (request) | ✅✅ Přímé crowd score | ❌ Ne | ✅ Ano | ⭐⭐⭐⭐⭐ |
| **OpenTripMap** | ✅ Ano | ✅ Ano (free) | ⚠️ POI density | ❌ Ne | ❌ Ne | ⭐⭐⭐ |
| **Amadeus** | ⚠️ Free tier | ✅ Ano (OAuth) | ❌ Ne | ✅✅ Flights/Hotels | ✅ Ano | ⭐⭐⭐⭐ |

---

## 🎯 Doporučení podle use-case:

### **Chci začít rychle (dnes):**
➡️ **World Bank API**
- Zero setup
- Žádná registrace
- Funguje okamžitě

### **Chci nejpřesnější crowd data:**
➡️ **Avoid Crowds API**
- Musíte požádat o access
- Nejrelevantnější pro váš use-case
- Expertní crowd predictions

### **Chci pricing data:**
➡️ **Amadeus API**
- Best-in-class flight/hotel data
- Vyžaduje setup
- Free tier omezený

### **Hybrid (doporučeno):**
1. **Start:** World Bank (dnes)
2. **Upgrade:** + Avoid Crowds (až získáte key)
3. **Future:** + Amadeus (pokud potřebujete pricing)

---

## 📞 Kontakty pro API keys:

- **OpenTripMap:** https://opentripmap.io/product (instant signup)
- **Avoid Crowds:** Contact form na https://avoid-crowds.com
- **Amadeus:** https://developers.amadeus.com/register (instant signup)

---

## ⚡ Quick Start Commands:

```bash
# 1. Test World Bank API (no auth needed)
curl "https://api.worldbank.org/v2/country/CZ/indicator/ST.INT.ARVL?format=json&date=2023:2023"

# 2. Register for OpenTripMap
# Visit: https://opentripmap.io/product

# 3. Request Avoid Crowds access
# Visit: https://avoid-crowds.com/contact
```

---

Vytvořeno: 2025-12-15

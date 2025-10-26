# 🚀 Refugee Aid System - Complete Running Guide

## ✅ System is Now Running!

Your complete Refugee Aid system with ML model and dashboard is **LIVE** at:

### 🌐 **Main Dashboard URL:**
```
http://127.0.0.1:8000/dashboard
```

---

## 📊 What's Running

### **1. Backend Server (Python)**
- ✅ HTTP Server running on port 8000
- ✅ ML Model integrated and ready
- ✅ API endpoints active

### **2. ML Model (refugee_aid.model)**
- ✅ Refugee aid scoring algorithm
- ✅ Calculates urgency scores (0-1 scale)
- ✅ Processes multiple input parameters

### **3. Interactive Dashboard**
- ✅ Dark theme with starry background
- ✅ Real-time data visualization
- ✅ Multi-page navigation
- ✅ Desktop notifications
- ✅ Notification history panel
- ✅ Detailed view pages

---

## 🎯 Complete Feature List

### **📍 Pages Available:**

1. **Overview** - Dashboard home with stats
2. **All Locations** - Table of all submissions
3. **Critical Alerts** - High-priority locations (score ≥ 0.7)
4. **Analytics** - Charts and visualizations
5. **Submit Data** - Form to add new location data

### **🔔 Notification System:**

- **Desktop Notifications**: Pop-up alerts for critical situations
- **Bell Icon Badge**: Shows unread notification count
- **Notification Panel**: Click bell to see history
- **Auto-save**: All notifications stored in browser

### **👁️ View Button:**

- **Detail Pages**: Opens new tab with complete location info
- **Shows All Data**: Inputs, outputs, scores, breakdowns
- **Beautiful Design**: Dark theme with glassmorphism

---

## 🧪 How to Test the Complete System

### **Test 1: Submit Data & Get ML Score**

1. Go to http://127.0.0.1:8000/dashboard
2. Click **"➕ Submit Data"** in sidebar
3. Fill in the form:
   ```
   Location ID: test_camp_alpha
   Population: 10000
   Area (km²): 5
   Food Supply (days): 2
   Water (L/p/d): 6
   Health Severity: 0.8
   Disease Incidence: 50
   Weather Severity: 0.5
   Disaster Flag: 1
   Influx: 15
   ```
4. Click **"Submit Data"**

**What Happens:**
- ✅ Data sent to Python backend
- ✅ ML model calculates urgency score
- ✅ Score returned (likely CRITICAL ~0.75)
- ✅ Desktop notification appears
- ✅ Bell badge updates
- ✅ Data saved to dashboard

### **Test 2: View Desktop Notifications**

1. After submitting critical data (score ≥ 0.7)
2. **Desktop notification appears** on your laptop
3. Shows: "🚨 CRITICAL ALERT - Refugee Aid"
4. Message includes location name and score

### **Test 3: Notification Panel**

1. Click **🔔 bell icon** (top right)
2. Panel slides down showing all notifications
3. See notification history with timestamps
4. Click "Clear All" to remove history

### **Test 4: View Button**

1. Go to **"📍 All Locations"** page
2. See your submitted data in table
3. Click **"View"** button
4. **New page opens** showing:
   - Large score display
   - All input data
   - Output metrics
   - Signal breakdown
   - Weighted contributions

### **Test 5: Critical Alerts Page**

1. Click **"🚨 Critical Alerts"** in sidebar
2. See all locations with score ≥ 0.7
3. Shows issues and recommended actions

### **Test 6: Analytics Page**

1. Click **"📈 Analytics"** in sidebar
2. See visualizations:
   - Score distribution chart
   - Average scores by signal
   - Top critical locations
   - Trend analysis

---

## 🔧 API Endpoints

### **1. Health Check**
```
GET http://127.0.0.1:8000/health
```
Returns: `{"status": "OK"}`

### **2. Get Schema**
```
GET http://127.0.0.1:8000/schema
```
Returns: List of required input fields

### **3. Calculate Score (ML Model)**
```
POST http://127.0.0.1:8000/score
Content-Type: application/json

[{
  "location_id": "camp_1",
  "population": 10000,
  "area_km2": 5,
  "food_supply_days": 2,
  "water_lpd": 6,
  "health_severity_0_1": 0.8,
  "disease_incidence_per_1k": 50,
  "weather_severity_0_1": 0.5,
  "disaster_flag": 1,
  "influx_percent_7d": 15
}]
```

Returns:
```json
[{
  "location_id": "camp_1",
  "refugee_aid_score": 0.752,
  "details": {
    "density": 0.85,
    "food": 0.95,
    "water": 0.88,
    "health": 0.82,
    "weather": 0.65,
    "movement": 0.75
  }
}]
```

---

## 🎨 Dashboard Features

### **Visual Design:**
- ⭐ Twinkling starry background
- 🌈 Dark purple/pink/blue gradients
- 🧊 Glassmorphism (frosted glass effects)
- ✨ Glowing hover animations
- 🎭 Smooth transitions

### **Data Management:**
- 💾 Browser localStorage for persistence
- 🔄 Real-time updates
- 📊 Multiple visualization formats
- 🗑️ Clear data option
- 🔄 Refresh functionality

### **User Experience:**
- 📱 Responsive design
- 🎯 Intuitive navigation
- 🔔 Smart notifications
- 👁️ Detailed view pages
- ⚡ Fast and smooth

---

## 📝 ML Model Details

### **Input Parameters (11 fields):**

1. **location_id** - Unique identifier
2. **population** - Number of people
3. **area_km2** - Area in square kilometers
4. **food_supply_days** - Days of food remaining
5. **water_lpd** - Liters per person per day
6. **health_severity_0_1** - Health severity (0-1)
7. **disease_incidence_per_1k** - Cases per 1000 people
8. **weather_severity_0_1** - Weather severity (0-1)
9. **disaster_flag** - Natural disaster present (0/1)
10. **influx_percent_7d** - Population influx % in 7 days
11. **crowd_density** - People per km² (auto-calculated)

### **Output:**

- **refugee_aid_score** - Urgency score (0-1 scale)
  - 0.7+ = CRITICAL (immediate action)
  - 0.4-0.7 = MODERATE (action needed soon)
  - 0.0-0.4 = LOW (monitor situation)

### **Signal Breakdown:**

- Density signal (crowd density)
- Food signal (food supply)
- Water signal (water availability)
- Health signal (disease/health)
- Weather signal (weather/disasters)
- Movement signal (population influx)

---

## 🚀 Quick Start Commands

### **Start Server:**
```powershell
cd c:\Celo
python -m refugee_aid.server
```

### **Stop Server:**
Press `Ctrl + C` in the terminal

### **Access Dashboard:**
Open browser: http://127.0.0.1:8000/dashboard

### **Test API:**
```powershell
curl http://127.0.0.1:8000/health
```

---

## 📂 Project Structure

```
c:\Celo\refugee_aid\
├── model.py              # ML model & scoring logic
├── server.py             # HTTP server & API
├── static/
│   ├── dashboard.html    # Main dashboard
│   ├── dashboard-styles.css  # Dark theme styles
│   ├── dashboard-script.js   # Interactive logic
│   └── detail.html       # Detail view page
└── *.md                  # Documentation files
```

---

## ✅ System Status

**Server:** ✅ RUNNING on port 8000
**ML Model:** ✅ ACTIVE and processing
**Dashboard:** ✅ ACCESSIBLE at /dashboard
**Notifications:** ✅ ENABLED
**View Button:** ✅ WORKING
**API Endpoints:** ✅ RESPONDING

---

## 🎉 You're All Set!

Your complete Refugee Aid system is **LIVE** and ready to use!

### **Access Your Dashboard:**
👉 http://127.0.0.1:8000/dashboard

### **Try It Out:**
1. Submit some test data
2. See the ML model calculate scores
3. Get desktop notifications for critical alerts
4. View detailed information
5. Explore analytics and visualizations

**Everything is working perfectly!** 🚀✨

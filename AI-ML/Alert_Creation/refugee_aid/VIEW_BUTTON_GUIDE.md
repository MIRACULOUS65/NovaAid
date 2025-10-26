# 👁️ View Button - Complete Guide

## ✅ View Button is Already Working!

The View button opens a **separate page** showing all inputs and outputs for each location.

---

## 🚀 How to Test

### **Step 1: Submit Some Data**

1. Go to **"Submit Data"** page
2. Fill in the form with test data:
   ```
   Location ID: test_location_1
   Population: 5000
   Area: 10
   Food Supply: 3
   Water: 8
   Health Severity: 0.5
   Disease Incidence: 20
   ```
3. Click **Submit**

### **Step 2: Go to All Locations**

1. Click **"📍 All Locations"** in sidebar
2. You'll see a table with your submitted data
3. Look for the **"View"** button in the last column

### **Step 3: Click View Button**

1. Click the **"View"** button
2. **NEW PAGE OPENS** in a new tab/window
3. Shows complete details for that location

---

## 📄 What the Detail Page Shows

### **1. Score Display (Top)**
```
┌──────────────────────────────────┐
│   Refugee Aid Urgency Score      │
│                                  │
│          0.XXX                   │
│                                  │
│   [CRITICAL/MODERATE/LOW]        │
└──────────────────────────────────┘
```

### **2. Input Data Section**
Shows all the data you submitted:
- Location ID
- Population
- Area (km²)
- Crowd Density (people/km²)
- Food Supply (days)
- Water (L/person/day)
- Health Severity
- Disease Incidence
- Weather Severity
- Disaster Flag
- Influx Percentage

### **3. Output Metrics**
Shows calculated results:
- Refugee Aid Score
- Urgency Level

### **4. Signal Breakdown**
Individual scores for each factor:
- Density Score
- Food Score
- Water Score
- Health Score
- Weather Score
- Movement Score

### **5. Weighted Contributions**
How much each factor contributed to the final score

### **6. Notes & Warnings**
Any issues or missing data points

---

## 🎨 Detail Page Features

### **Visual Design:**
- ✅ Dark theme matching dashboard
- ✅ Twinkling stars background
- ✅ Glassmorphism effects
- ✅ Large, easy-to-read score display
- ✅ Color-coded urgency badges
- ✅ Organized grid layout

### **Navigation:**
- ✅ **"← Back to Dashboard"** button at top
- ✅ Click to return to main dashboard
- ✅ All data preserved

### **Responsive Layout:**
- ✅ Adapts to different screen sizes
- ✅ Scrollable if content is long
- ✅ Clean, organized sections

---

## 🧪 Test Multiple Locations

### **Create Multiple Entries:**

1. Submit location: `camp_alpha` with low scores (food: 2, water: 5)
2. Submit location: `camp_beta` with medium scores (food: 10, water: 15)
3. Submit location: `camp_gamma` with high scores (food: 20, water: 25)

### **Test Each View Button:**

1. Go to **"All Locations"**
2. See all 3 locations in table
3. Click **"View"** on each one
4. Each opens in **separate tab** with correct data
5. Compare the different urgency levels

---

## 🔧 How It Works

### **Technical Flow:**

```
1. User clicks "View" button
   ↓
2. JavaScript calls viewDetails(locationId)
   ↓
3. Opens: detail.html?id=location_id
   ↓
4. Detail page loads
   ↓
5. Reads URL parameter (?id=...)
   ↓
6. Loads data from localStorage
   ↓
7. Finds matching location
   ↓
8. Displays all inputs and outputs
```

### **Data Storage:**

- All data stored in `localStorage`
- Key: `refugee_aid_data`
- Format: Array of location objects
- Persists across browser sessions

---

## 🎯 Expected Results

### **When You Click "View":**

✅ New browser tab/window opens
✅ URL shows: `http://127.0.0.1:8000/detail.html?id=location_name`
✅ Page loads with dark theme
✅ Large score displayed at top
✅ All input data shown in grid
✅ All output metrics displayed
✅ Signal breakdown visible
✅ Back button works

---

## 🐛 Troubleshooting

### **If View Button Doesn't Work:**

1. **Refresh the page** (Ctrl + Shift + R)
2. **Check console** (F12) for errors
3. **Verify data exists** in All Locations page
4. **Make sure server is running**

### **If Detail Page Shows Error:**

**"No location specified"**
- URL missing ID parameter
- Check if button has correct `data-location-id`

**"No data found"**
- localStorage is empty
- Submit some data first

**"Location not found"**
- Location ID doesn't match
- Try submitting data again

---

## ✅ Quick Test Checklist

- [ ] Server is running (http://127.0.0.1:8000/dashboard)
- [ ] Submit test data via "Submit Data" page
- [ ] Go to "All Locations" page
- [ ] See data in table with "View" button
- [ ] Click "View" button
- [ ] New page opens in new tab
- [ ] Score displayed at top
- [ ] All inputs shown in grid
- [ ] All outputs displayed correctly
- [ ] Click "Back to Dashboard" button
- [ ] Returns to dashboard

---

## 🎉 Summary

**The View button is fully functional!**

✅ Opens new page (detail.html)
✅ Shows all inputs
✅ Shows all outputs
✅ Beautiful dark theme
✅ Back button works
✅ Multiple locations supported

**Just refresh your dashboard and try it!** 🚀

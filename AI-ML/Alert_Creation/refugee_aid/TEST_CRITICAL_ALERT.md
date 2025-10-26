# 🧪 Quick Test: Critical Alert Notification

## Follow These Steps:

### 1️⃣ Open Dashboard
Navigate to: **http://127.0.0.1:8000/dashboard**

### 2️⃣ Allow Notifications
When browser asks for permission:
- Click **"Allow"** ✅

### 3️⃣ Go to Submit Data Page
Click on **"➕ Submit Data"** in the sidebar

### 4️⃣ Enter Critical Data

Fill in these values:

| Field | Value |
|-------|-------|
| **Location ID** | critical_test |
| **Population** | 10000 |
| **Area (km²)** | 5 |
| **Food Supply (days)** | **2** ⚠️ |
| **Water (L/p/d)** | **6** ⚠️ |
| **Health Severity** | 0.7 |
| **Disease Incidence** | 45 |

### 5️⃣ Click Submit

**What Should Happen:**

1. ✅ **Desktop notification pops up** on your laptop:
   ```
   🚨 CRITICAL ALERT - Refugee Aid
   
   Location "critical_test" requires immediate 
   attention! Aid Score: 0.7XX
   ```

2. ✅ **Success message appears** in green/blue box:
   ```
   ✅ Data Saved Successfully!
   Location: critical_test
   Aid Score: 0.7XX 🔴 CRITICAL
   
   ⚠️ CRITICAL: Desktop notification sent!
   ```

3. ✅ **Bell icon updates**:
   - Red badge appears: 🔔①
   - Badge pulses/glows

### 6️⃣ Click the Bell Icon 🔔

**What Should Happen:**

1. ✅ Switches to **"🚨 Critical Alerts"** page
2. ✅ Shows the location you just submitted
3. ✅ Displays detailed issue card:
   ```
   📍 critical_test
   Score: 0.7XX 🔴 CRITICAL
   
   Issues:
   • Critically low food supply (2 days remaining)
   • Insufficient water (6 L/p/d)
   
   Recommended Actions:
   • Immediate food distribution required
   • Emergency water supply needed
   ```

---

## 🎯 Expected Results

✅ **Desktop notification** appears on your laptop
✅ **Bell badge** shows "1"
✅ **Critical Alerts page** shows the new location
✅ **All three work together** seamlessly

---

## ⚠️ If Notification Doesn't Appear

### Check These:

1. **Browser Permission**:
   - Look for 🔔 icon in address bar
   - Click it and allow notifications

2. **Windows Notifications**:
   - Press `Win + A` to open notification center
   - Check if notifications are enabled

3. **Browser Focus**:
   - Some browsers only show notifications when not focused
   - Try switching to another app after submitting

4. **Console Check**:
   - Press `F12` to open developer tools
   - Look for errors in console

---

## 🔄 Test Again with Different Data

Try another critical location:

```
Location ID: emergency_camp
Population: 15000
Food Supply: 1        ← Very critical!
Water: 4              ← Very critical!
Health Severity: 0.9  ← Very critical!
```

This should create an **even higher score** and trigger another notification!

---

## ✅ Success Indicators

You'll know it's working when:

1. 🔔 **Notification toast** appears on your laptop
2. 🔴 **Red badge** on bell icon
3. 📋 **Critical Alerts page** shows the data
4. ⚠️ **"Desktop notification sent!"** message

All four should work together! 🎉

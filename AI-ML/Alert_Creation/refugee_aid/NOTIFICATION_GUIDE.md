# 🔔 Notification System - Complete Guide

## ✅ Your Notification System is Already Working!

### 🎯 How It Works

#### 1. **Desktop Notifications for Critical Alerts**

When you submit data with a **critical score (≥ 0.7)**, the system:

1. ✅ Automatically sends a **desktop notification** to your laptop
2. ✅ Shows notification title: "🚨 CRITICAL ALERT - Refugee Aid"
3. ✅ Shows location name and aid score in the message
4. ✅ Notification **stays on screen** until you dismiss it (`requireInteraction: true`)
5. ✅ Updates the **notification bell badge** with the count

#### 2. **Notification Icon (Bell) Shows Critical Alerts**

When you click the **🔔 bell icon**:

1. ✅ Automatically switches to the **"Critical Alerts"** page
2. ✅ Shows all locations with score ≥ 0.7
3. ✅ Displays detailed issue cards for each critical location
4. ✅ Shows recommended actions

---

## 🧪 How to Test

### **Step 1: Enable Notifications**
When you first load the dashboard, the browser will ask:
- **"Allow notifications from this site?"**
- Click **"Allow"** to enable desktop notifications

### **Step 2: Submit Critical Data**

Go to **"Submit Data"** page and enter data that will trigger a critical alert:

**Example Critical Data:**
```
Location ID: test_critical_camp
Population: 5000
Food Supply (days): 2
Water (L/p/d): 5
Health Severity: 0.8
Disease Incidence: 50
```

### **Step 3: Watch What Happens**

After clicking Submit:

1. ✅ **Desktop notification appears** on your laptop
   - Shows critical alert message
   - Includes location name and score
   
2. ✅ **Bell icon updates**
   - Red badge appears with count (e.g., "1", "2", etc.)
   - Badge pulses with animation
   
3. ✅ **Success message shows**
   - "⚠️ CRITICAL: Desktop notification sent!"

### **Step 4: Click the Bell Icon**

Click the **🔔 bell** in the top-right corner:

1. ✅ Switches to **"Critical Alerts"** page
2. ✅ Shows all critical locations
3. ✅ Displays the same alert you were just notified about

---

## 💻 Desktop Notification Features

### **What the Notification Shows:**
```
🚨 CRITICAL ALERT - Refugee Aid

Location "test_critical_camp" requires immediate attention! 
Aid Score: 0.752
```

### **Notification Properties:**
- **Stays on screen** until dismissed
- **Grouped by tag** (won't spam multiple notifications)
- **Shows urgency** with emoji and formatting
- **Actionable** - clicking opens the dashboard

---

## 🎨 Notification Badge Features

### **Visual Indicators:**
- **Red circular badge** on bell icon
- **White number** showing critical count
- **Pulsing animation** to draw attention
- **Updates in real-time** when data changes

### **Badge Behavior:**
- Shows when critical alerts exist
- Hides when no critical alerts
- Updates automatically on:
  - Data submission
  - Data refresh
  - Data deletion

---

## 🔧 Current Implementation

### **Code Flow:**

```javascript
// 1. User submits data
submitData() {
    // ... submit to API ...
    
    // 2. Check if critical
    if (result.refugee_aid_score >= 0.7) {
        // 3. Send desktop notification
        sendDesktopNotification(
            '🚨 CRITICAL ALERT - Refugee Aid',
            `Location "${result.location_id}" requires immediate attention!`,
            '🚨'
        );
    }
    
    // 4. Update notification badge
    updateNotificationBadge();
}

// 5. When bell clicked
showCriticalAlerts() {
    switchPage('critical'); // Shows critical alerts page
}
```

---

## 🎯 What Triggers a Critical Alert?

A location is considered **CRITICAL** when:
- **Refugee Aid Score ≥ 0.7** (70% or higher urgency)

Common scenarios that create critical scores:
- Very low food supply (< 3 days)
- Insufficient water (< 10 L/person/day)
- High crowd density
- High disease incidence
- Severe weather conditions
- Large population influx

---

## ✅ Testing Checklist

- [ ] Allow notifications when prompted
- [ ] Submit data with critical parameters
- [ ] Desktop notification appears
- [ ] Bell badge shows count
- [ ] Click bell icon
- [ ] Critical Alerts page opens
- [ ] Same location shown in list

---

## 🚀 Quick Test Commands

### **Test with Sample Data:**

1. Go to **Submit Data** page
2. Enter:
   - Location: `urgent_test`
   - Population: `8000`
   - Food Supply: `2`
   - Water: `6`
3. Submit
4. Watch for notification!
5. Click bell icon to see details

---

## 📱 Notification Permissions

If notifications aren't working:

1. **Check browser permissions:**
   - Chrome: Settings → Privacy → Site Settings → Notifications
   - Firefox: Settings → Privacy & Security → Permissions → Notifications
   - Edge: Settings → Cookies and site permissions → Notifications

2. **Check Windows notification settings:**
   - Windows Settings → System → Notifications
   - Make sure browser notifications are enabled

3. **Reload the page** and allow when prompted

---

## 🎉 Everything is Ready!

Your notification system is **fully functional**:

✅ Desktop notifications for critical alerts
✅ Real-time badge updates
✅ Click bell to see all critical alerts
✅ Automatic synchronization

Just refresh your dashboard and test it out! 🚀

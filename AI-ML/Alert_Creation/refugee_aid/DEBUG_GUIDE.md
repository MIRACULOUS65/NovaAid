# 🔧 Debug & Testing Guide

## ✅ Fixes Applied

### 1. **View Button Error - FIXED**
- Changed all `dashboard.html` links to `/dashboard`
- Back button now works correctly
- Detail page loads properly

### 2. **Notifications - IMPROVED**
- Added automatic permission request
- Shows test notification when permissions granted
- Added console logging for debugging
- Better error handling

---

## 🧪 Step-by-Step Testing

### **Step 1: Refresh Your Browser**
Press `Ctrl + Shift + R` (hard refresh) to clear cache and load new code

### **Step 2: Open Developer Console**
Press `F12` to open Developer Tools and check the **Console** tab

### **Step 3: Allow Notifications**
When prompted:
- Click **"Allow"** when browser asks for notification permission
- You should see a **test notification** appear immediately!
- Check console for: `Notification permission: granted`

---

## 🔔 Test Desktop Notifications

### **Submit Critical Data:**

1. Go to **"Submit Data"** page
2. Enter:
   ```
   Location ID: critical_test_1
   Population: 10000
   Food Supply (days): 1
   Water (L/p/d): 5
   Health Severity: 0.9
   ```
3. Click **Submit**

### **Check Console Output:**
You should see:
```
Score: 0.7XX Critical threshold: 0.7
🚨 CRITICAL ALERT! Sending notification...
Attempting to send notification: 🚨 CRITICAL ALERT - Refugee Aid
Notification sent successfully
Updating notification badge. Critical count: 1
Badge displayed with count: 1
```

### **Check Desktop:**
- Desktop notification should pop up
- Shows: "Location 'critical_test_1' requires immediate attention!"

### **Check Bell Icon:**
- Should show red badge with "1"
- Badge should be visible in top-right corner

---

## 👁️ Test View Button

### **Test the View Button:**

1. Go to **"All Locations"** page
2. You should see the location you just submitted
3. Click **"View"** button
4. **New tab/window opens** with detail page
5. Shows all input/output data
6. Click **"← Back to Dashboard"** - returns to dashboard

---

## 🐛 Troubleshooting

### **If Notifications Don't Appear:**

#### Check Console:
Look for these messages in console (F12):

✅ **Good messages:**
```
Notification permission: granted
Notification sent successfully
```

❌ **Error messages and fixes:**

| Error Message | Fix |
|---------------|-----|
| `Notification permission: denied` | Enable notifications in browser settings |
| `Notifications not supported` | Use Chrome, Firefox, or Edge |
| `Notification badge element not found` | Hard refresh the page |

#### Check Browser Settings:

**Chrome:**
1. Click 🔒 icon in address bar
2. Click "Site Settings"
3. Find "Notifications"
4. Set to "Allow"

**Firefox:**
1. Click 🔒 icon in address bar
2. Click "Connection secure"
3. Click "More Information"
4. Go to "Permissions" tab
5. Find "Show Notifications"
6. Uncheck "Use Default" and check "Allow"

**Edge:**
Same as Chrome

#### Check Windows Settings:
1. Press `Win + I`
2. Go to "System" → "Notifications"
3. Make sure notifications are ON
4. Find your browser in the list
5. Make sure it's enabled

---

## 🔍 Console Commands for Testing

Open console (F12) and try these:

### **Check Notification Permission:**
```javascript
console.log('Permission:', Notification.permission);
```

Should show: `Permission: granted`

### **Manually Test Notification:**
```javascript
new Notification('Test', { body: 'This is a test notification' });
```

Should show notification on desktop

### **Check Critical Count:**
```javascript
const data = JSON.parse(localStorage.getItem('refugee_aid_data'));
const critical = data.filter(d => d.refugee_aid_score >= 0.7);
console.log('Critical alerts:', critical.length);
```

Shows number of critical alerts

---

## ✅ Expected Results

### **When Everything Works:**

1. ✅ Page loads with test notification
2. ✅ Submit critical data → Desktop notification appears
3. ✅ Bell icon shows red badge with count
4. ✅ Click bell → Shows Critical Alerts page
5. ✅ Click "View" → Opens detail page in new tab
6. ✅ Console shows success messages

---

## 📞 Quick Checklist

- [ ] Hard refresh page (Ctrl + Shift + R)
- [ ] See "Allow notifications?" prompt
- [ ] Click "Allow"
- [ ] See test notification
- [ ] Submit critical data (food: 1, water: 5)
- [ ] Desktop notification appears
- [ ] Bell badge shows "1"
- [ ] Click bell icon
- [ ] See Critical Alerts page
- [ ] Click "View" button
- [ ] Detail page opens in new tab
- [ ] All data displayed correctly

---

## 🎯 Quick Test Script

Copy this into console to test everything:

```javascript
// Test notification
if (Notification.permission === 'granted') {
    new Notification('🧪 Test Notification', {
        body: 'If you see this, notifications are working!',
        requireInteraction: true
    });
    console.log('✅ Notification sent');
} else {
    console.log('❌ Permission:', Notification.permission);
    console.log('Please allow notifications');
}

// Check critical count
const data = JSON.parse(localStorage.getItem('refugee_aid_data') || '[]');
const critical = data.filter(d => d.refugee_aid_score >= 0.7).length;
console.log('Critical alerts:', critical);
```

---

**After hard refresh, everything should work!** 🎉

# Refugee Aid Dashboard Guide

## 🎨 Dark Theme with Pink & Blue Colors
The dashboard now features a stunning dark theme with a modern pink (#ff006e) and blue (#3a86ff) color scheme.

## 🔔 Notification System
- **Bell Icon**: Located in the top-right corner of the dashboard
- **Badge Counter**: Shows the number of critical alerts (locations with score ≥ 0.7)
- **Pulsing Animation**: The badge pulses to draw attention when critical alerts exist
- **Click to View**: Clicking the bell takes you directly to the Critical Alerts page

## 📄 Beautiful Detail Modal
When you click "View" on any location in the All Locations page, a beautiful modal popup displays:

### Modal Features:
- **Large Score Display**: Prominent display with gradient background
- **Location Information**: Population, Area, Crowd Density
- **Resources Section**: Food supply and water availability
- **Health Status**: Health severity and disease incidence
- **Signal Breakdown**: Individual scores for each factor
- **Weighted Contributions**: Shows how much each factor contributed to the final score
- **Notes Section**: Important warnings and missing data notifications

### Modal Controls:
- Click the **×** button to close
- Click outside the modal to close
- Smooth animations when opening/closing

## 🎯 Dashboard Pages

### 1. Overview
- Statistics cards showing total, critical, moderate, and low urgency locations
- Average aid scores by category with animated gradient bars
- Recent submissions table

### 2. All Locations
- Complete data table with all scored locations
- Click "View" button to see detailed information in modal
- Color-coded urgency badges

### 3. Critical Alerts 🚨
- Filtered view showing only critical locations (score ≥ 0.7)
- Highlighted issue cards with specific problems
- Recommended actions for each location
- Automatically updated notification badge

### 4. Analytics
- Aid score distribution chart
- Signal strength analysis
- Top 5 highest urgency locations ranking

### 5. Submit Data
- Form to input new location data
- Auto-calculation of aid score
- Beautiful success/error messages
- Data is saved locally and updates all pages

## 🌈 Color Scheme
- **Background**: Black (#0a0a0a)
- **Cards**: Dark grey with subtle gradients (#1a1a1a to #2a2a2a)
- **Primary Gradient**: Pink to Blue (#ff006e to #3a86ff)
- **Critical Alerts**: Pink (#ff006e)
- **Moderate Alerts**: Yellow (#ffbe0b)
- **Low Priority**: Blue (#3a86ff)
- **Text**: Light grey (#e0e0e0)

## 🔄 Auto-Updates
- Notification badge updates automatically when:
  - New data is submitted
  - Data is cleared
  - Page is refreshed

## 💾 Data Storage
All data is stored locally in your browser using localStorage, so your data persists across sessions.

## 🚀 Access
Navigate to: **http://127.0.0.1:8000/dashboard**

---

**Tip**: The notification bell is your quick way to monitor critical situations. When you see a number badge, click it immediately to view urgent alerts!

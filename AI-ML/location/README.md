# 🗺️ Location Tracker with Hotspot Zone Monitoring

A comprehensive web-based location tracking system with automatic and manual location detection, hotspot zone monitoring, and real-time NGO alert system. Features a modern dark gradient UI design.

## ✨ Features

### User Dashboard (`index.html`)
- **Automatic Location Detection**: Uses browser's Geolocation API to detect current position automatically on page load
- **Manual Location Entry**: Enter latitude/longitude coordinates manually
- **Multi-Device Tracking**: See all devices/users in the zone on the same map
- **Unique User Icons**: Each device gets a unique color and icon (10 color schemes)
- **Hotspot Zone Creation**: Define safe zones with customizable radius
- **Real-time Tracking**: Continuous location monitoring every 10 seconds
- **Distance Monitoring**: Calculates distance from hotspot zone in real-time
- **Other Users Info**: View details of other active users with their locations and distances
- **Location History**: Keeps track of last 20 location updates
- **Interactive Map**: Visual representation using Leaflet.js with all users displayed
- **Browser Notifications**: Alerts when user leaves the safe zone
- **Local Storage**: Persists data across sessions
- **Auto-Sync**: Updates every 3 seconds to show real-time positions of all users

### NGO Dashboard (`ngo-dashboard.html`)
- **Real-time Alert Monitoring**: Displays all critical alerts when users leave safe zones
- **Multi-User Visualization**: See all active devices/users on a single map with unique colors
- **Alert Count Badge**: Shows number of active alerts
- **Interactive Map View**: Visualizes all user locations, hotspot zones, and distances simultaneously
- **Alert Details**: Timestamp, distance, and location coordinates
- **Monitored Users Panel**: Displays all active users with device IDs, colors, and status
- **Click to Focus**: Click on any user to zoom to their location on the map
- **Color-Coded Tracking**: Each user has a unique color matching their dashboard icon
- **Auto-refresh**: Updates every 5 seconds automatically
- **Browser Notifications**: Push notifications for critical alerts
- **Audio Alerts**: Sound notification for new alerts
- **Clear Alerts Function**: Remove all alerts with confirmation
- **User Activity Status**: Shows which users are actively tracking vs inactive

## 🎨 Design Features

- **Dark Gradient Theme**: Modern dark color scheme with smooth gradients
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Animated UI Elements**: Smooth transitions and hover effects
- **Color-coded Status**: Visual indicators for different states
- **Custom Markers**: Unique map markers for users and hotspots
- **10 Unique Color Schemes**: Purple, Pink, Blue, Green, Rose, Yellow, Cyan, Red, Violet, Teal

## 👥 Multi-Device Tracking System

The application automatically tracks all devices that open the user dashboard:

### How It Works
1. **Automatic Device ID**: Each device gets a unique ID on first visit
2. **Auto-Detection**: Location is automatically detected when the page loads
3. **Shared Storage**: All users are stored in a shared localStorage database
4. **Color Assignment**: Each device gets a unique color from 10 available schemes
5. **Real-Time Sync**: Updates every 3 seconds to show all active users
6. **5-Minute Timeout**: Users inactive for 5 minutes are automatically removed
7. **Cross-Dashboard Visibility**: Both user and NGO dashboards see all active users

### User Icons on Map
- **Current User**: Marked with "ME" in their assigned color
- **Other Users**: Marked with their user number (1, 2, 3, etc.) in their color
- **Hotspot Zones**: Each user's zone displayed in their unique color with dashed borders
- **Click for Details**: Click any marker to see user information and status

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection (for map tiles)
- Location permissions enabled

### Installation

1. Clone or download all files to a directory:
   ```
   location/
   ├── index.html
   ├── ngo-dashboard.html
   ├── styles.css
   ├── app.js
   ├── ngo-dashboard.js
   └── README.md
   ```

2. Open `index.html` in your web browser for the user interface
3. Open `ngo-dashboard.html` in another tab/window for the NGO monitoring dashboard

### Testing Multi-User Tracking

To test the multi-user feature:
1. Open `index.html` in multiple browser windows or tabs (use Incognito/Private mode for separate devices)
2. Each window will get a unique device ID and color
3. Allow location permissions in each window
4. Watch as all users appear on each other's maps with different colored icons
5. Open the NGO dashboard to see all users simultaneously
6. Move in different windows to see real-time updates across all instances

### Usage

#### User Dashboard

1. **Detect Location**
   - Click "Auto Detect Location" to use GPS
   - Or click "Enter Manual Location" to input coordinates

2. **Set Hotspot Zone**
   - Click "Set Hotspot Zone"
   - Enter the center coordinates and radius (in meters)
   - The zone will appear as a green circle on the map

3. **Start Tracking**
   - Click "Start Tracking" to begin continuous monitoring
   - Your location will update every 10 seconds
   - Alerts will be sent to NGO if you leave the zone

4. **Monitor Status**
   - Check current location coordinates
   - View distance from hotspot zone
   - See tracking status (Active/Inactive)
   - Review location history

#### NGO Dashboard

1. **View Alerts**
   - See all critical alerts when users leave safe zones
   - Click on alerts to focus on map
   - View detailed information for each alert

2. **Monitor Map**
   - Red markers show user locations outside zones
   - Green circles show hotspot safe zones
   - Dotted lines connect users to their zones
   - Numbers indicate alert priority

3. **Manage Alerts**
   - Click "Clear All Alerts" to reset the system
   - Auto-refresh keeps data current
   - Alert count shows active warnings

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Structure and geolocation API
- **CSS3**: Dark gradient styling with animations
- **JavaScript (ES6+)**: Application logic
- **Leaflet.js**: Interactive map visualization
- **OpenStreetMap**: Free map tiles
- **localStorage**: Client-side data persistence
- **Notifications API**: Browser alerts

### Key Functions

#### Location Detection
- `autoDetectLocation()`: Uses Geolocation API
- `setManualLocation()`: Manual coordinate entry
- `calculateDistance()`: Haversine formula for distance

#### Tracking System
- `startTracking()`: Begins 10-second interval monitoring
- `checkDistance()`: Monitors proximity to hotspot
- `sendAlertToNGO()`: Creates alert records

#### Data Management
- `saveData()`: Persists to localStorage
- `loadStoredData()`: Restores previous session
- `addToHistory()`: Maintains location log

### Distance Calculation
Uses the Haversine formula to calculate great-circle distance between coordinates:
```javascript
distance = 2 * R * arcsin(√(sin²(Δφ/2) + cos(φ1) * cos(φ2) * sin²(Δλ/2)))
```

## 🔐 Security & Privacy

- All data stored locally in browser (localStorage)
- No external server communication
- Location data remains on client device
- User controls when location is shared
- Notification permissions requested before use

## 🎯 Use Cases

- **Child Safety**: Monitor children within designated safe zones
- **Elderly Care**: Track seniors and alert caregivers
- **Employee Safety**: Ensure workers stay in safe areas
- **Patient Monitoring**: Track patients who need supervision
- **Event Management**: Monitor attendees within venue boundaries
- **Emergency Response**: Coordinate first responders

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ⚠️ Requires HTTPS for production (geolocation security requirement)

## 🐛 Troubleshooting

**Location not detected?**
- Enable location permissions in browser settings
- Ensure you're not blocking location access
- Try manual location entry as fallback

**Alerts not showing on NGO dashboard?**
- Ensure both pages are open in same browser
- Check localStorage is enabled
- Clear browser cache and reload

**Map not loading?**
- Check internet connection
- Verify CDN links are accessible
- Try refreshing the page

## 🔄 Future Enhancements

- Backend server for multi-device synchronization
- SMS/Email alerts in addition to browser notifications
- Multiple user tracking simultaneously
- Historical route visualization
- Geofencing with multiple zones
- Export alert history to CSV/PDF
- Mobile app version
- User authentication system

## 📄 License

This project is open source and available for educational and commercial use.

## 👥 Support

For issues, questions, or contributions, please refer to the project repository.

---

**Made with ❤️ using modern web technologies**

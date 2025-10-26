// Global variables
let ngoMap;
let alertMarkers = [];
let autoRefreshInterval;
let userMarkers = [];

// Color schemes for different users (same as user app)
const userColors = [
    { bg: '#667eea', name: 'Purple' },
    { bg: '#f093fb', name: 'Pink' },
    { bg: '#4facfe', name: 'Blue' },
    { bg: '#43e97b', name: 'Green' },
    { bg: '#fa709a', name: 'Rose' },
    { bg: '#feca57', name: 'Yellow' },
    { bg: '#48dbfb', name: 'Cyan' },
    { bg: '#ff6b6b', name: 'Red' },
    { bg: '#5f27cd', name: 'Violet' },
    { bg: '#00d2d3', name: 'Teal' }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initNGOMap();
    loadAlerts();
    setupEventListeners();
    startAutoRefresh();
    requestNotificationPermission();
});

// Initialize Leaflet map for NGO dashboard
function initNGOMap() {
    ngoMap = L.map('ngoMap').setView([28.6139, 77.2090], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(ngoMap);
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('clearAlertsBtn').addEventListener('click', clearAllAlerts);
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Load alerts from localStorage
function loadAlerts() {
    const alerts = JSON.parse(localStorage.getItem('ngoAlerts') || '[]');
    displayAlerts(alerts);
    displayMonitoredUsers(alerts);
    updateAlertCount(alerts.length);

    // Play sound for new critical alerts
    const lastCheck = localStorage.getItem('ngoLastCheck');
    const currentTime = new Date().getTime();

    if (lastCheck) {
        const newAlerts = alerts.filter(alert => 
            new Date(alert.timestamp).getTime() > parseInt(lastCheck)
        );

        if (newAlerts.length > 0) {
            playAlertSound();
            showBrowserNotification(newAlerts[0]);
        }
    }

    localStorage.setItem('ngoLastCheck', currentTime.toString());
}

// Display alerts
function displayAlerts(alerts) {
    const alertsList = document.getElementById('alertsList');

    if (alerts.length === 0) {
        alertsList.innerHTML = '<p class="no-alerts">No alerts at this time</p>';
        return;
    }

    alertsList.innerHTML = alerts.map((alert, index) => {
        const date = new Date(alert.timestamp);
        const timeString = date.toLocaleString();
        const criticalClass = alert.status === 'critical' ? 'critical' : '';

        return `
            <div class="alert-item ${criticalClass}" onclick="focusOnAlert(${index})">
                <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 5px;">
                    ⚠️ User Outside Hotspot Zone
                </div>
                <div style="margin: 5px 0;">
                    📍 User Location: ${alert.userLocation.lat.toFixed(6)}, ${alert.userLocation.lng.toFixed(6)}
                </div>
                <div style="margin: 5px 0;">
                    🎯 Hotspot: ${alert.hotspotZone.lat.toFixed(6)}, ${alert.hotspotZone.lng.toFixed(6)}
                </div>
                <div class="alert-distance">
                    📏 Distance: ${alert.distanceKm} km (${alert.distance.toFixed(0)}m outside zone)
                </div>
                <div class="alert-time">
                    🕒 ${timeString}
                </div>
            </div>
        `;
    }).join('');

    // Display alert locations on map
    displayAlertLocationsOnMap(alerts);
}

// Display alert locations on map
function displayAlertLocationsOnMap(alerts) {
    // Clear existing markers
    alertMarkers.forEach(marker => ngoMap.removeLayer(marker));
    alertMarkers = [];

    // Add markers for each alert
    alerts.slice(0, 10).forEach((alert, index) => {
        // User location marker (red)
        const userMarker = L.marker([alert.userLocation.lat, alert.userLocation.lng], {
            icon: L.divIcon({
                className: 'alert-marker',
                html: `<div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); width: 35px; height: 35px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; color: white;">${index + 1}</div>`,
                iconSize: [35, 35]
            })
        }).addTo(ngoMap);

        userMarker.bindPopup(`
            <div style="padding: 10px; min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: #1a1a2e;">⚠️ Alert #${index + 1}</h3>
                <p style="margin: 5px 0; color: #333;"><strong>Status:</strong> ${alert.status.toUpperCase()}</p>
                <p style="margin: 5px 0; color: #333;"><strong>Distance:</strong> ${alert.distanceKm} km</p>
                <p style="margin: 5px 0; color: #333;"><strong>Time:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
            </div>
        `);

        alertMarkers.push(userMarker);

        // Hotspot zone circle
        const hotspotCircle = L.circle([alert.hotspotZone.lat, alert.hotspotZone.lng], {
            color: '#43e97b',
            fillColor: '#43e97b',
            fillOpacity: 0.15,
            radius: alert.hotspotZone.radius,
            weight: 2,
            dashArray: '5, 5'
        }).addTo(ngoMap);

        alertMarkers.push(hotspotCircle);

        // Hotspot center marker
        const hotspotMarker = L.marker([alert.hotspotZone.lat, alert.hotspotZone.lng], {
            icon: L.divIcon({
                className: 'hotspot-marker',
                html: '<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 16px;">🎯</div>',
                iconSize: [30, 30]
            })
        }).addTo(ngoMap);

        alertMarkers.push(hotspotMarker);

        // Draw line between user and hotspot
        const line = L.polyline([
            [alert.userLocation.lat, alert.userLocation.lng],
            [alert.hotspotZone.lat, alert.hotspotZone.lng]
        ], {
            color: '#f5576c',
            weight: 2,
            dashArray: '10, 10',
            opacity: 0.7
        }).addTo(ngoMap);

        alertMarkers.push(line);
    });

    // Fit map to show all markers
    if (alertMarkers.length > 0) {
        const group = new L.featureGroup(alertMarkers);
        ngoMap.fitBounds(group.getBounds().pad(0.1));
    }
}

// Focus on specific alert
function focusOnAlert(index) {
    const alerts = JSON.parse(localStorage.getItem('ngoAlerts') || '[]');
    if (alerts[index]) {
        const alert = alerts[index];
        ngoMap.setView([alert.userLocation.lat, alert.userLocation.lng], 15);
        
        // Open popup for this marker
        if (alertMarkers[index * 4]) {
            alertMarkers[index * 4].openPopup();
        }
    }
}

// Display monitored users
function displayMonitoredUsers(alerts) {
    const usersDiv = document.getElementById('monitoredUsers');
    
    // Get all tracked users from shared storage
    const allUsers = getAllTrackedUsers();
    
    if (allUsers.length === 0) {
        usersDiv.innerHTML = '<p style="text-align: center; color: #a0a0b0;">No users being monitored</p>';
        // Also display all tracked users on map
        displayAllUsersOnMap(allUsers);
        return;
    }

    // Display all users with their info
    usersDiv.innerHTML = allUsers.map((user, index) => {
        const userColor = userColors[user.colorIndex];
        const lastUpdateTime = new Date(user.lastUpdate).toLocaleString();
        const trackingStatus = user.isTracking ? '🟢 Active' : '⚫ Inactive';
        
        // Count alerts for this user
        const userAlerts = alerts.filter(alert => {
            const threshold = 0.001;
            return Math.abs(alert.userLocation.lat - user.lat) < threshold &&
                   Math.abs(alert.userLocation.lng - user.lng) < threshold;
        });
        
        return `
            <div class="user-item" onclick="focusOnUser('${user.deviceId}')" style="cursor: pointer;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight: bold; font-size: 1.1em; display: flex; align-items: center; gap: 8px;">
                        <span style="width: 15px; height: 15px; border-radius: 50%; background: ${userColor.bg};"></span>
                        ${user.name}
                    </div>
                    ${userAlerts.length > 0 ? `
                        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 5px 12px; border-radius: 15px; font-size: 0.9em; font-weight: bold;">
                            ${userAlerts.length} Alert${userAlerts.length > 1 ? 's' : ''}
                        </div>
                    ` : ''}
                </div>
                <div style="margin: 8px 0; color: #a0a0b0;">
                    📍 ${user.lat.toFixed(6)}, ${user.lng.toFixed(6)}
                </div>
                <div style="margin: 5px 0;">
                    <strong>Color:</strong> <span style="color: ${userColor.bg};">${userColor.name}</span>
                </div>
                <div style="margin: 5px 0;">
                    <strong>Status:</strong> ${trackingStatus}
                </div>
                ${user.hotspotZone ? `
                    <div style="margin: 5px 0;">
                        🎯 Zone Radius: ${user.hotspotZone.radius}m
                    </div>
                ` : ''}
                <div class="alert-time">
                    🕒 Last Update: ${lastUpdateTime}
                </div>
            </div>
        `;
    }).join('');
    
    // Display all tracked users on map
    displayAllUsersOnMap(allUsers);
}

// Get all tracked users
function getAllTrackedUsers() {
    const usersData = localStorage.getItem('allTrackedUsers');
    if (!usersData) return [];
    try {
        const users = JSON.parse(usersData);
        // Filter out inactive users (older than 5 minutes)
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        return users.filter(u => u.lastUpdate > fiveMinutesAgo);
    } catch (e) {
        return [];
    }
}

// Display all tracked users on NGO map
function displayAllUsersOnMap(users) {
    // Clear existing user markers
    userMarkers.forEach(marker => ngoMap.removeLayer(marker));
    userMarkers = [];
    
    if (users.length === 0) return;
    
    users.forEach(user => {
        const userColor = userColors[user.colorIndex].bg;
        const colorName = userColors[user.colorIndex].name;
        
        // Create marker for user
        const marker = L.marker([user.lat, user.lng], {
            icon: L.divIcon({
                className: 'tracked-user-marker',
                html: `<div style="background: ${userColor}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 13px;">${user.name.split(' ')[1]}</div>`,
                iconSize: [32, 32]
            })
        }).addTo(ngoMap);
        
        // Create popup content
        const lastUpdateTime = new Date(user.lastUpdate).toLocaleTimeString();
        const trackingStatus = user.isTracking ? '🟢 Active' : '⚫ Inactive';
        
        let popupContent = `
            <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: ${userColor};">${user.name}</h3>
                <p style="margin: 5px 0; color: #333;"><strong>Device ID:</strong> ${user.deviceId.substr(0, 15)}...</p>
                <p style="margin: 5px 0; color: #333;"><strong>Color:</strong> ${colorName}</p>
                <p style="margin: 5px 0; color: #333;"><strong>Location:</strong> ${user.lat.toFixed(4)}, ${user.lng.toFixed(4)}</p>
                <p style="margin: 5px 0; color: #333;"><strong>Tracking:</strong> ${trackingStatus}</p>
                <p style="margin: 5px 0; color: #666; font-size: 0.9em;">Last update: ${lastUpdateTime}</p>
            </div>
        `;
        
        // Add hotspot zone if user has one
        if (user.hotspotZone) {
            const hotspotCircle = L.circle([user.hotspotZone.lat, user.hotspotZone.lng], {
                color: userColor,
                fillColor: userColor,
                fillOpacity: 0.15,
                radius: user.hotspotZone.radius,
                weight: 2,
                dashArray: '5, 5'
            }).addTo(ngoMap);
            
            userMarkers.push(hotspotCircle);
        }
        
        marker.bindPopup(popupContent);
        userMarkers.push(marker);
    });
    
    // Fit map to show all users
    if (userMarkers.length > 0) {
        const group = new L.featureGroup(userMarkers);
        ngoMap.fitBounds(group.getBounds().pad(0.1));
    }
}

// Focus on specific user
function focusOnUser(deviceId) {
    const users = getAllTrackedUsers();
    const user = users.find(u => u.deviceId === deviceId);
    if (user) {
        ngoMap.setView([user.lat, user.lng], 16);
        // Find and open the user's marker popup
        userMarkers.forEach(marker => {
            if (marker.getLatLng && marker.getLatLng().lat === user.lat && marker.getLatLng().lng === user.lng) {
                marker.openPopup();
            }
        });
    }
}

// Update alert count
function updateAlertCount(count) {
    document.getElementById('alertCount').textContent = count;
}

// Clear all alerts
function clearAllAlerts() {
    if (confirm('Are you sure you want to clear all alerts?')) {
        localStorage.setItem('ngoAlerts', '[]');
        localStorage.setItem('ngoLastCheck', new Date().getTime().toString());
        loadAlerts();
        
        // Clear map markers
        alertMarkers.forEach(marker => ngoMap.removeLayer(marker));
        alertMarkers = [];
    }
}

// Play alert sound
function playAlertSound() {
    const audio = document.getElementById('alertSound');
    if (audio) {
        audio.play().catch(err => console.log('Audio play failed:', err));
    }
}

// Show browser notification
function showBrowserNotification(alert) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('🚨 Critical Alert - User Outside Zone', {
            body: `A user has moved ${alert.distanceKm} km away from the designated hotspot zone. Immediate attention required.`,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23f5576c"/><text x="50" y="65" text-anchor="middle" font-size="50" fill="white">⚠</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23f5576c"/></svg>',
            tag: 'location-alert',
            requireInteraction: true,
            vibrate: [200, 100, 200]
        });

        notification.onclick = function() {
            window.focus();
            this.close();
        };
    }
}

// Start auto-refresh
function startAutoRefresh() {
    // Refresh alerts every 5 seconds
    autoRefreshInterval = setInterval(() => {
        loadAlerts();
    }, 5000);
}

// Stop auto-refresh when page is hidden
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        clearInterval(autoRefreshInterval);
    } else {
        startAutoRefresh();
        loadAlerts();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    clearInterval(autoRefreshInterval);
});

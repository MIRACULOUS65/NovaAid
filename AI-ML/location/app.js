// Global variables
let map;
let currentMarker;
let hotspotCircle;
let locationHistory = [];
let trackingInterval;
let isTracking = false;
let hotspotZone = null;
let currentPosition = null;
let deviceId = null;
let allUsersMarkers = [];
let syncInterval;

// Color schemes for different users
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

// Initialize map on page load
document.addEventListener('DOMContentLoaded', function() {
    initDeviceId();
    initMap();
    loadStoredData();
    setupEventListeners();
    updateUI();
    startSyncingUsers();
    displayDeviceInfo();
    
    // Automatically detect location on page load
    setTimeout(() => {
        autoDetectLocationSilent();
    }, 1000);
});

// Initialize or retrieve device ID
function initDeviceId() {
    deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', deviceId);
    }
}

// Initialize Leaflet map
function initMap() {
    map = L.map('map').setView([28.6139, 77.2090], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
}

// Display device information
function displayDeviceInfo() {
    const allUsers = getAllUsers();
    const currentUser = allUsers.find(u => u.deviceId === deviceId);
    if (currentUser) {
        const userColor = userColors[currentUser.colorIndex];
        document.getElementById('currentLocation').innerHTML = 
            `<span style="display: inline-flex; align-items: center; gap: 8px;">
                <span style="width: 12px; height: 12px; border-radius: 50%; background: ${userColor.bg};"></span>
                ${currentUser.name} (${currentPosition ? currentPosition.lat.toFixed(6) + ', ' + currentPosition.lng.toFixed(6) : 'Not detected'})
            </span>`;
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('autoDetectBtn').addEventListener('click', autoDetectLocation);
    document.getElementById('manualLocationBtn').addEventListener('click', openManualModal);
    document.getElementById('setHotspotBtn').addEventListener('click', openHotspotModal);
    document.getElementById('startTrackingBtn').addEventListener('click', toggleTracking);
    document.getElementById('manualLocationForm').addEventListener('submit', setManualLocation);
    document.getElementById('hotspotForm').addEventListener('submit', setHotspotZone);
}

// Auto detect location using Geolocation API
function autoDetectLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    const btn = document.getElementById('autoDetectBtn');
    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span> Detecting...';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLocation(lat, lng, 'Auto-detected');
            btn.disabled = false;
            btn.innerHTML = '<span>📍</span> Auto Detect Location';
        },
        (error) => {
            alert('Error detecting location: ' + error.message);
            btn.disabled = false;
            btn.innerHTML = '<span>📍</span> Auto Detect Location';
        },
        { enableHighAccuracy: true }
    );
}

// Auto detect location silently on page load
function autoDetectLocationSilent() {
    if (!navigator.geolocation) {
        console.log('Geolocation is not supported by your browser');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLocation(lat, lng, 'Auto-detected on load');
        },
        (error) => {
            console.log('Could not auto-detect location:', error.message);
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// Set location on map
function setLocation(lat, lng, method) {
    currentPosition = { lat, lng };

    // Update this user in shared storage
    updateUserLocation(lat, lng);

    // Remove old marker
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }

    // Get current user's color
    const allUsers = getAllUsers();
    const currentUser = allUsers.find(u => u.deviceId === deviceId);
    const userColor = currentUser ? userColors[currentUser.colorIndex].bg : '#667eea';

    // Add new marker with user's color
    currentMarker = L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: ${userColor}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">ME</div>`,
            iconSize: [30, 30]
        })
    }).addTo(map).bindPopup(`<b>${currentUser ? currentUser.name : 'Me'}</b><br>Current Location`);

    // Center map on location
    map.setView([lat, lng], 15);

    // Update UI
    displayDeviceInfo();

    // Add to history
    addToHistory(lat, lng, method);

    // Check distance if hotspot exists
    if (hotspotZone) {
        checkDistance();
    }

    // Enable tracking button
    document.getElementById('startTrackingBtn').disabled = false;

    // Display all users on map
    displayAllUsersOnMap();

    // Save to localStorage
    saveData();
}

// Add location to history
function addToHistory(lat, lng, method) {
    const timestamp = new Date().toLocaleString();
    const entry = { lat, lng, method, timestamp };
    locationHistory.unshift(entry);

    // Keep only last 20 entries
    if (locationHistory.length > 20) {
        locationHistory = locationHistory.slice(0, 20);
    }

    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    const historyDiv = document.getElementById('locationHistory');
    if (locationHistory.length === 0) {
        historyDiv.innerHTML = '<p style="text-align: center; color: #a0a0b0;">No location history yet</p>';
        return;
    }

    historyDiv.innerHTML = locationHistory.map(entry => `
        <div class="history-item">
            <div><strong>${entry.method}</strong></div>
            <div>📍 ${entry.lat.toFixed(6)}, ${entry.lng.toFixed(6)}</div>
            <div class="alert-time">🕒 ${entry.timestamp}</div>
        </div>
    `).join('');
}

// Open manual location modal
function openManualModal() {
    document.getElementById('manualModal').style.display = 'block';
}

// Close manual location modal
function closeManualModal() {
    document.getElementById('manualModal').style.display = 'none';
}

// Set manual location
function setManualLocation(e) {
    e.preventDefault();
    const lat = parseFloat(document.getElementById('latitude').value);
    const lng = parseFloat(document.getElementById('longitude').value);

    if (isNaN(lat) || isNaN(lng)) {
        alert('Please enter valid coordinates');
        return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        alert('Coordinates out of range');
        return;
    }

    setLocation(lat, lng, 'Manual Entry');
    closeManualModal();
    e.target.reset();
}

// Open hotspot modal
function openHotspotModal() {
    const modal = document.getElementById('hotspotModal');
    modal.style.display = 'block';

    // Pre-fill with current location if available
    if (currentPosition) {
        document.getElementById('hotspotLat').value = currentPosition.lat;
        document.getElementById('hotspotLng').value = currentPosition.lng;
    }
}

// Close hotspot modal
function closeHotspotModal() {
    document.getElementById('hotspotModal').style.display = 'none';
}

// Set hotspot zone
function setHotspotZone(e) {
    e.preventDefault();
    const lat = parseFloat(document.getElementById('hotspotLat').value);
    const lng = parseFloat(document.getElementById('hotspotLng').value);
    const radius = parseFloat(document.getElementById('hotspotRadius').value);

    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
        alert('Please enter valid values');
        return;
    }

    hotspotZone = { lat, lng, radius };

    // Remove old circle
    if (hotspotCircle) {
        map.removeLayer(hotspotCircle);
    }

    // Add hotspot circle
    hotspotCircle = L.circle([lat, lng], {
        color: '#43e97b',
        fillColor: '#43e97b',
        fillOpacity: 0.2,
        radius: radius,
        weight: 3
    }).addTo(map);

    // Add hotspot marker
    L.marker([lat, lng], {
        icon: L.divIcon({
            className: 'hotspot-marker',
            html: '<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); width: 35px; height: 35px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 20px;">🎯</div>',
            iconSize: [35, 35]
        })
    }).addTo(map);

    // Update UI
    document.getElementById('hotspotStatus').textContent = `Set at ${lat.toFixed(6)}, ${lng.toFixed(6)} (${radius}m radius)`;

    closeHotspotModal();
    e.target.reset();

    // Check distance if current location exists
    if (currentPosition) {
        checkDistance();
    }

    saveData();
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Check distance from hotspot
function checkDistance() {
    if (!currentPosition || !hotspotZone) return;

    const distance = calculateDistance(
        currentPosition.lat,
        currentPosition.lng,
        hotspotZone.lat,
        hotspotZone.lng
    );

    const distanceKm = (distance / 1000).toFixed(2);
    document.getElementById('distanceStatus').textContent = `${distanceKm} km`;

    // Alert if outside zone
    if (distance > hotspotZone.radius) {
        sendAlertToNGO(distance);
        document.getElementById('distanceStatus').innerHTML = 
            `<span style="color: #f5576c; font-weight: bold;">⚠️ ${distanceKm} km (OUTSIDE ZONE)</span>`;
    } else {
        document.getElementById('distanceStatus').innerHTML = 
            `<span style="color: #43e97b;">${distanceKm} km (Inside Zone)</span>`;
    }
}

// Send alert to NGO
function sendAlertToNGO(distance) {
    const alert = {
        timestamp: new Date().toISOString(),
        userLocation: currentPosition,
        hotspotZone: hotspotZone,
        distance: distance,
        distanceKm: (distance / 1000).toFixed(2),
        status: 'critical'
    };

    // Store alert in localStorage for NGO dashboard
    let alerts = JSON.parse(localStorage.getItem('ngoAlerts') || '[]');
    alerts.unshift(alert);

    // Keep only last 50 alerts
    if (alerts.length > 50) {
        alerts = alerts.slice(0, 50);
    }

    localStorage.setItem('ngoAlerts', JSON.stringify(alerts));

    // Show notification
    if (Notification.permission === 'granted') {
        new Notification('⚠️ Location Alert', {
            body: `User has moved ${(distance / 1000).toFixed(2)} km away from the hotspot zone!`,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23f5576c"/></svg>'
        });
    }
}

// Toggle tracking
function toggleTracking() {
    if (isTracking) {
        stopTracking();
    } else {
        startTracking();
    }
}

// Start tracking
function startTracking() {
    if (!currentPosition) {
        alert('Please detect your location first');
        return;
    }

    if (!hotspotZone) {
        alert('Please set a hotspot zone first');
        return;
    }

    // Request notification permission
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }

    isTracking = true;
    document.getElementById('trackingStatus').innerHTML = 
        '<span style="color: #43e97b;">🟢 Active</span>';
    document.getElementById('startTrackingBtn').innerHTML = 
        '<span>⏸️</span> Stop Tracking';
    document.getElementById('startTrackingBtn').style.background = 
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';

    // Track location every 10 seconds
    trackingInterval = setInterval(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setLocation(lat, lng, 'Auto-tracked');
                },
                (error) => {
                    console.error('Tracking error:', error);
                }
            );
        }
    }, 10000);
}

// Stop tracking
function stopTracking() {
    isTracking = false;
    clearInterval(trackingInterval);
    document.getElementById('trackingStatus').innerHTML = 
        '<span style="color: #a0a0b0;">⚫ Inactive</span>';
    document.getElementById('startTrackingBtn').innerHTML = 
        '<span>🔴</span> Start Tracking';
    document.getElementById('startTrackingBtn').style.background = 
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
}

// Save data to localStorage
function saveData() {
    const data = {
        currentPosition,
        hotspotZone,
        locationHistory
    };
    localStorage.setItem('locationTrackerData', JSON.stringify(data));
}

// Load stored data
function loadStoredData() {
    const stored = localStorage.getItem('locationTrackerData');
    if (!stored) return;

    try {
        const data = JSON.parse(stored);
        
        if (data.currentPosition) {
            setLocation(data.currentPosition.lat, data.currentPosition.lng, 'Restored');
        }

        if (data.hotspotZone) {
            hotspotZone = data.hotspotZone;
            
            hotspotCircle = L.circle([hotspotZone.lat, hotspotZone.lng], {
                color: '#43e97b',
                fillColor: '#43e97b',
                fillOpacity: 0.2,
                radius: hotspotZone.radius,
                weight: 3
            }).addTo(map);

            L.marker([hotspotZone.lat, hotspotZone.lng], {
                icon: L.divIcon({
                    className: 'hotspot-marker',
                    html: '<div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); width: 35px; height: 35px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 20px;">🎯</div>',
                    iconSize: [35, 35]
                })
            }).addTo(map);

            document.getElementById('hotspotStatus').textContent = 
                `Set at ${hotspotZone.lat.toFixed(6)}, ${hotspotZone.lng.toFixed(6)} (${hotspotZone.radius}m radius)`;
        }

        if (data.locationHistory) {
            locationHistory = data.locationHistory;
            updateHistoryDisplay();
        }
    } catch (e) {
        console.error('Error loading stored data:', e);
    }
}

// Update UI
function updateUI() {
    // Close modals when clicking outside
    window.onclick = function(event) {
        const manualModal = document.getElementById('manualModal');
        const hotspotModal = document.getElementById('hotspotModal');
        
        if (event.target === manualModal) {
            closeManualModal();
        }
        if (event.target === hotspotModal) {
            closeHotspotModal();
        }
    };
}

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeManualModal();
        closeHotspotModal();
    }
});

// ============== MULTI-USER TRACKING FUNCTIONS ==============

// Get all users from shared storage
function getAllUsers() {
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

// Update current user's location in shared storage
function updateUserLocation(lat, lng) {
    let allUsers = getAllUsers();
    
    // Find or create this device's user entry
    let userIndex = allUsers.findIndex(u => u.deviceId === deviceId);
    
    if (userIndex === -1) {
        // New user - assign a color index and name
        const colorIndex = allUsers.length % userColors.length;
        const userName = `User ${allUsers.length + 1}`;
        
        allUsers.push({
            deviceId: deviceId,
            name: userName,
            colorIndex: colorIndex,
            lat: lat,
            lng: lng,
            lastUpdate: Date.now(),
            isTracking: isTracking,
            hotspotZone: hotspotZone
        });
    } else {
        // Update existing user
        allUsers[userIndex] = {
            ...allUsers[userIndex],
            lat: lat,
            lng: lng,
            lastUpdate: Date.now(),
            isTracking: isTracking,
            hotspotZone: hotspotZone
        };
    }
    
    // Save back to localStorage
    localStorage.setItem('allTrackedUsers', JSON.stringify(allUsers));
}

// Display all users on the map
function displayAllUsersOnMap() {
    // Clear existing markers
    allUsersMarkers.forEach(marker => map.removeLayer(marker));
    allUsersMarkers = [];
    
    const allUsers = getAllUsers();
    
    allUsers.forEach(user => {
        // Skip current user (already displayed)
        if (user.deviceId === deviceId) return;
        
        const userColor = userColors[user.colorIndex].bg;
        const colorName = userColors[user.colorIndex].name;
        
        // Create marker for other user
        const marker = L.marker([user.lat, user.lng], {
            icon: L.divIcon({
                className: 'other-user-marker',
                html: `<div style="background: ${userColor}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${user.name.split(' ')[1]}</div>`,
                iconSize: [28, 28]
            })
        }).addTo(map);
        
        // Create popup content
        const lastUpdateTime = new Date(user.lastUpdate).toLocaleTimeString();
        const trackingStatus = user.isTracking ? '🟢 Active' : '⚫ Inactive';
        
        let popupContent = `
            <div style="padding: 5px; min-width: 180px;">
                <h3 style="margin: 0 0 8px 0; color: ${userColor};">${user.name}</h3>
                <p style="margin: 4px 0; color: #333;"><strong>Color:</strong> ${colorName}</p>
                <p style="margin: 4px 0; color: #333;"><strong>Location:</strong> ${user.lat.toFixed(4)}, ${user.lng.toFixed(4)}</p>
                <p style="margin: 4px 0; color: #333;"><strong>Status:</strong> ${trackingStatus}</p>
                <p style="margin: 4px 0; color: #666; font-size: 0.9em;">Last update: ${lastUpdateTime}</p>
            </div>
        `;
        
        // Add hotspot zone if user has one
        if (user.hotspotZone) {
            const hotspotCircle = L.circle([user.hotspotZone.lat, user.hotspotZone.lng], {
                color: userColor,
                fillColor: userColor,
                fillOpacity: 0.1,
                radius: user.hotspotZone.radius,
                weight: 2,
                dashArray: '5, 5'
            }).addTo(map);
            
            allUsersMarkers.push(hotspotCircle);
            
            popupContent = `
                <div style="padding: 5px; min-width: 180px;">
                    <h3 style="margin: 0 0 8px 0; color: ${userColor};">${user.name}</h3>
                    <p style="margin: 4px 0; color: #333;"><strong>Color:</strong> ${colorName}</p>
                    <p style="margin: 4px 0; color: #333;"><strong>Location:</strong> ${user.lat.toFixed(4)}, ${user.lng.toFixed(4)}</p>
                    <p style="margin: 4px 0; color: #333;"><strong>Status:</strong> ${trackingStatus}</p>
                    <p style="margin: 4px 0; color: #333;"><strong>Zone Radius:</strong> ${user.hotspotZone.radius}m</p>
                    <p style="margin: 4px 0; color: #666; font-size: 0.9em;">Last update: ${lastUpdateTime}</p>
                </div>
            `;
        }
        
        marker.bindPopup(popupContent);
        allUsersMarkers.push(marker);
    });
    
    // Update user count display
    updateUserCountDisplay(allUsers.length);
}

// Update user count display
function updateUserCountDisplay(count) {
    const statusPanel = document.querySelector('.status-panel');
    let userCountItem = document.getElementById('userCountStatus');
    
    if (!userCountItem) {
        // Create new status item for user count
        userCountItem = document.createElement('div');
        userCountItem.className = 'status-item';
        userCountItem.id = 'userCountStatus';
        statusPanel.appendChild(userCountItem);
    }
    
    userCountItem.innerHTML = `
        <span class="label">Active Users:</span>
        <span class="value" style="color: #43e97b;">${count} device${count !== 1 ? 's' : ''} online</span>
    `;
    
    // Also update the other users info panel
    updateOtherUsersInfo();
}

// Update other users info display
function updateOtherUsersInfo() {
    const otherUsersDiv = document.getElementById('otherUsersInfo');
    const allUsers = getAllUsers();
    const otherUsers = allUsers.filter(u => u.deviceId !== deviceId);
    
    if (otherUsers.length === 0) {
        otherUsersDiv.innerHTML = '<p style="text-align: center; color: #a0a0b0;">No other users detected</p>';
        return;
    }
    
    otherUsersDiv.innerHTML = otherUsers.map(user => {
        const userColor = userColors[user.colorIndex];
        const lastUpdateTime = new Date(user.lastUpdate).toLocaleTimeString();
        const trackingStatus = user.isTracking ? '🟢 Active' : '⚫ Inactive';
        
        // Calculate distance from current user if position is known
        let distanceInfo = '';
        if (currentPosition) {
            const distance = calculateDistance(
                currentPosition.lat,
                currentPosition.lng,
                user.lat,
                user.lng
            );
            const distanceKm = (distance / 1000).toFixed(2);
            distanceInfo = `<div style="margin: 5px 0; color: #4facfe;">📏 Distance: ${distanceKm} km away</div>`;
        }
        
        return `
            <div class="history-item">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <span style="width: 15px; height: 15px; border-radius: 50%; background: ${userColor.bg};"></span>
                    <strong style="font-size: 1.1em;">${user.name}</strong>
                    <span style="font-size: 0.9em;">${trackingStatus}</span>
                </div>
                <div style="color: #a0a0b0;">📍 ${user.lat.toFixed(4)}, ${user.lng.toFixed(4)}</div>
                ${distanceInfo}
                <div style="margin: 5px 0;">
                    <strong>Color:</strong> <span style="color: ${userColor.bg};">${userColor.name}</span>
                </div>
                ${user.hotspotZone ? `<div style="margin: 5px 0; color: #43e97b;">🎯 Has Zone Set (${user.hotspotZone.radius}m)</div>` : ''}
                <div class="alert-time">🕒 ${lastUpdateTime}</div>
            </div>
        `;
    }).join('');
}

// Start syncing users periodically
function startSyncingUsers() {
    // Initial sync
    displayAllUsersOnMap();
    
    // Sync every 3 seconds
    syncInterval = setInterval(() => {
        displayAllUsersOnMap();
        
        // Update current user's timestamp
        if (currentPosition) {
            updateUserLocation(currentPosition.lat, currentPosition.lng);
        }
    }, 3000);
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (trackingInterval) clearInterval(trackingInterval);
    if (syncInterval) clearInterval(syncInterval);
});

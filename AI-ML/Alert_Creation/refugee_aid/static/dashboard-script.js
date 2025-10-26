const API_BASE = window.location.origin;
const STORAGE_KEY = 'refugee_aid_data';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    loadSampleDataIfEmpty();
    renderCurrentPage();
    updateNotificationBadge();
    requestNotificationPermission();
});

// Request notification permission
async function requestNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                console.log('Notification permission:', permission);
                if (permission === 'granted') {
                    // Show test notification
                    new Notification('Refugee Aid Dashboard', {
                        body: 'Notifications are enabled! You will be alerted for critical situations.',
                        icon: '🔔'
                    });
                }
            } catch (error) {
                console.error('Error requesting notification permission:', error);
            }
        } else {
            console.log('Notification permission already:', Notification.permission);
        }
    } else {
        console.warn('Notifications not supported in this browser');
    }
}

// Send desktop notification
function sendDesktopNotification(title, body, icon = '🚨') {
    console.log('Attempting to send notification:', title);
    
    if (!('Notification' in window)) {
        console.error('Notifications not supported');
        alert('⚠️ Desktop notifications are not supported in this browser');
        return;
    }
    
    if (Notification.permission === 'granted') {
        try {
            const notification = new Notification(title, {
                body: body,
                icon: icon,
                badge: icon,
                tag: 'refugee-aid-alert-' + Date.now(),
                requireInteraction: true
            });
            console.log('Notification sent successfully');
            
            // Save notification to history
            saveNotificationToHistory(title, body);
            
            notification.onclick = function() {
                window.focus();
                this.close();
            };
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    } else if (Notification.permission === 'denied') {
        console.error('Notification permission denied');
        alert('⚠️ Notifications are blocked. Please enable them in browser settings.');
    } else {
        console.log('Requesting permission...');
        requestNotificationPermission().then(() => {
            if (Notification.permission === 'granted') {
                sendDesktopNotification(title, body, icon);
            }
        });
    }
}

// Save notification to history
function saveNotificationToHistory(title, body) {
    const notifications = getNotificationHistory();
    notifications.unshift({
        title: title,
        body: body,
        timestamp: new Date().toISOString(),
        read: false
    });
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
        notifications.splice(50);
    }
    
    localStorage.setItem('refugee_aid_notifications', JSON.stringify(notifications));
    updateNotificationBadge();
}

// Get notification history
function getNotificationHistory() {
    const data = localStorage.getItem('refugee_aid_notifications');
    return data ? JSON.parse(data) : [];
}

// Mark all notifications as read
function markNotificationsAsRead() {
    const notifications = getNotificationHistory();
    notifications.forEach(n => n.read = true);
    localStorage.setItem('refugee_aid_notifications', JSON.stringify(notifications));
    updateNotificationBadge();
}

// Clear notification history
function clearNotificationHistory() {
    if (confirm('Clear all notification history?')) {
        localStorage.removeItem('refugee_aid_notifications');
        closeNotificationPanel();
        updateNotificationBadge();
    }
}

// Update notification badge
function updateNotificationBadge() {
    const notifications = getNotificationHistory();
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notification-count');
    
    console.log('Updating notification badge. Unread count:', unreadCount);
    
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'flex';
            console.log('Badge displayed with count:', unreadCount);
        } else {
            badge.style.display = 'none';
            console.log('Badge hidden (no unread notifications)');
        }
    } else {
        console.error('Notification badge element not found!');
    }
}

// Show notification panel (from notification bell)
function showNotificationPanel() {
    const panel = document.getElementById('notificationPanel');
    const notifications = getNotificationHistory();
    
    if (!panel) {
        console.error('Notification panel not found!');
        return;
    }
    
    // Toggle panel visibility
    if (panel.classList.contains('show')) {
        closeNotificationPanel();
        return;
    }
    
    // Mark notifications as read
    markNotificationsAsRead();
    
    // Build notification list
    let html = `
        <div class="notification-panel-header">
            <h3>🔔 Notifications</h3>
            <button onclick="closeNotificationPanel()" class="notification-close">&times;</button>
        </div>
        <div class="notification-list">
    `;
    
    if (notifications.length === 0) {
        html += `
            <div class="notification-empty">
                <div style="font-size: 3rem; margin-bottom: 10px;">🔕</div>
                <div>No notifications yet</div>
            </div>
        `;
    } else {
        notifications.forEach((notif, index) => {
            const date = new Date(notif.timestamp);
            const timeAgo = getTimeAgo(date);
            const isNew = !notif.read;
            
            html += `
                <div class="notification-item ${isNew ? 'unread' : ''}">
                    <div class="notification-item-icon">🚨</div>
                    <div class="notification-item-content">
                        <div class="notification-item-title">${notif.title}</div>
                        <div class="notification-item-body">${notif.body}</div>
                        <div class="notification-item-time">${timeAgo}</div>
                    </div>
                </div>
            `;
        });
        
        html += `
            <div class="notification-actions">
                <button onclick="clearNotificationHistory()" class="btn-clear-notifications">Clear All</button>
            </div>
        `;
    }
    
    html += '</div>';
    
    panel.innerHTML = html;
    panel.classList.add('show');
}

// Close notification panel
function closeNotificationPanel() {
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.classList.remove('show');
    }
}

// Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
    
    return date.toLocaleDateString();
}

// Navigation
function setupNavigation() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            switchPage(page);
        });
    });
}

function switchPage(pageName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`${pageName}-page`).classList.add('active');
    
    // Update title
    const titles = {
        overview: 'Overview',
        locations: 'All Locations',
        critical: 'Critical Alerts',
        analytics: 'Analytics',
        submit: 'Submit Data'
    };
    document.getElementById('page-title').textContent = titles[pageName];
    
    // Render page content
    renderPage(pageName);
}

function renderPage(pageName) {
    switch(pageName) {
        case 'overview':
            renderOverview();
            break;
        case 'locations':
            renderLocations();
            break;
        case 'critical':
            renderCritical();
            break;
        case 'analytics':
            renderAnalytics();
            break;
        case 'submit':
            renderSubmitForm();
            break;
    }
}

function renderCurrentPage() {
    const activePage = document.querySelector('.nav-link.active');
    const pageName = activePage ? activePage.dataset.page : 'overview';
    renderPage(pageName);
}

// Data management
function getAllData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveData(newItem) {
    const data = getAllData();
    data.push(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    updateNotificationBadge();
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data?')) {
        localStorage.removeItem(STORAGE_KEY);
        renderCurrentPage();
        updateNotificationBadge();
    }
}

function refreshData() {
    renderCurrentPage();
    updateNotificationBadge();
}

function loadSampleDataIfEmpty() {
    if (getAllData().length === 0) {
        const samples = [
            {
                location_id: 'camp_alpha',
                population: 12000,
                area_km2: 2.0,
                food_supply_days: 3,
                water_lpd: 8.0,
                disease_incidence_per_1k: 35,
                weather_severity_0_1: 0.8,
                influx_percent_7d: 22
            },
            {
                location_id: 'camp_beta',
                population: 8500,
                area_km2: 3.5,
                food_supply_days: 10,
                water_lpd: 14.0,
                health_severity_0_1: 0.3,
                weather_severity_0_1: 0.2,
                influx_percent_7d: 5
            },
            {
                location_id: 'camp_gamma',
                population: 15000,
                area_km2: 1.8,
                food_supply_days: 2,
                water_lpd: 6.5,
                disease_incidence_per_1k: 48,
                disaster_flag: true,
                influx_percent_7d: 35
            }
        ];
        
        // Score each sample and save
        samples.forEach(async (sample) => {
            try {
                const response = await fetch(`${API_BASE}/score`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sample)
                });
                if (response.ok) {
                    const results = await response.json();
                    saveData(results[0]);
                }
            } catch (error) {
                console.error('Error loading sample:', error);
            }
        });
        
        setTimeout(() => renderCurrentPage(), 500);
    }
}

// Overview Page
function renderOverview() {
    const data = getAllData();
    const container = document.getElementById('overview-page');
    
    if (data.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">No data available</div>
                <p>Submit some location data to see analytics</p>
            </div>
        `;
        return;
    }
    
    const stats = calculateStats(data);
    
    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Locations</div>
                <div class="stat-value">${stats.total}</div>
            </div>
            <div class="stat-card critical">
                <div class="stat-label">Critical Locations</div>
                <div class="stat-value">${stats.critical}</div>
                <div class="stat-trend">${stats.criticalPercent}% of total</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-label">Moderate Urgency</div>
                <div class="stat-value">${stats.moderate}</div>
                <div class="stat-trend">${stats.moderatePercent}% of total</div>
            </div>
            <div class="stat-card good">
                <div class="stat-label">Low Urgency</div>
                <div class="stat-value">${stats.low}</div>
                <div class="stat-trend">${stats.lowPercent}% of total</div>
            </div>
        </div>
        
        <div class="chart-container">
            <div class="chart-title">Average Aid Score by Category</div>
            ${renderBarChart(stats.avgScores)}
        </div>
        
        <div class="chart-container">
            <div class="chart-title">Recent Submissions (Latest 5)</div>
            ${renderRecentTable(data.slice(-5).reverse())}
        </div>
    `;
}

function calculateStats(data) {
    const total = data.length;
    const critical = data.filter(d => d.refugee_aid_score >= 0.7).length;
    const moderate = data.filter(d => d.refugee_aid_score >= 0.4 && d.refugee_aid_score < 0.7).length;
    const low = data.filter(d => d.refugee_aid_score < 0.4).length;
    
    const avgScores = {
        density: 0,
        food: 0,
        water: 0,
        health: 0,
        weather: 0,
        movement: 0
    };
    
    let counts = {...avgScores};
    data.forEach(item => {
        if (item.details) {
            Object.keys(avgScores).forEach(key => {
                if (item.details[key] !== undefined) {
                    avgScores[key] += item.details[key];
                    counts[key]++;
                }
            });
        }
    });
    
    Object.keys(avgScores).forEach(key => {
        avgScores[key] = counts[key] > 0 ? avgScores[key] / counts[key] : 0;
    });
    
    return {
        total,
        critical,
        moderate,
        low,
        criticalPercent: ((critical / total) * 100).toFixed(1),
        moderatePercent: ((moderate / total) * 100).toFixed(1),
        lowPercent: ((low / total) * 100).toFixed(1),
        avgScores
    };
}

function renderBarChart(scores) {
    const labels = {
        density: 'Density',
        food: 'Food',
        water: 'Water',
        health: 'Health',
        weather: 'Weather',
        movement: 'Movement'
    };
    
    let html = '<div style="padding: 10px 0;">';
    Object.entries(scores).forEach(([key, value]) => {
        const percent = (value * 100).toFixed(1);
        html += `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight: 600; color: #e0e0e0;">${labels[key]}</span>
                    <span style="background: linear-gradient(90deg, #ff006e 0%, #3a86ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 700;">${percent}%</span>
                </div>
                <div style="background: rgba(10, 0, 20, 0.8); border-radius: 10px; height: 12px; overflow: hidden; border: 1px solid rgba(102, 0, 51, 0.3);">
                    <div style="background: linear-gradient(90deg, #ff006e 0%, #8a2be2 50%, #3a86ff 100%); height: 100%; width: ${percent}%; border-radius: 10px; box-shadow: 0 0 15px rgba(255, 0, 110, 0.6);"></div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function renderRecentTable(data) {
    if (data.length === 0) return '<p>No recent data</p>';
    
    let html = '<table class="data-table"><thead><tr>';
    html += '<th>Location</th><th>Score</th><th>Status</th><th>Population</th>';
    html += '</tr></thead><tbody>';
    
    data.forEach(item => {
        const badge = getUrgencyBadge(item.refugee_aid_score);
        html += `
            <tr>
                <td><strong>${item.location_id}</strong></td>
                <td>${item.refugee_aid_score.toFixed(3)}</td>
                <td>${badge}</td>
                <td>${item.population || 'N/A'}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    return html;
}

// Locations Page
function renderLocations() {
    const data = getAllData();
    const container = document.getElementById('locations-page');
    
    if (data.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">No locations recorded</div>
                <p>Add location data from the Submit Data page</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="data-table-container"><table class="data-table"><thead><tr>';
    html += '<th>Location ID</th><th>Aid Score</th><th>Status</th><th>Population</th>';
    html += '<th>Food (days)</th><th>Water (L/p/d)</th><th>Details</th>';
    html += '</tr></thead><tbody>';
    
    data.forEach((item, index) => {
        const badge = getUrgencyBadge(item.refugee_aid_score);
        html += `
            <tr>
                <td><strong>${item.location_id}</strong></td>
                <td><strong>${item.refugee_aid_score.toFixed(3)}</strong></td>
                <td>${badge}</td>
                <td>${item.population || 'N/A'}</td>
                <td>${item.food_supply_days || 'N/A'}</td>
                <td>${item.water_lpd || 'N/A'}</td>
                <td><button data-location-id="${item.location_id}" class="btn btn-primary view-details-btn" style="padding: 5px 10px; font-size: 0.85rem;">View</button></td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
    
    // Attach event listeners to all View buttons
    setTimeout(() => {
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const locationId = this.getAttribute('data-location-id');
                viewDetails(locationId);
            });
        });
    }, 0);
}

function viewDetails(locationId) {
    // Open detail page in new window
    window.open(`detail.html?id=${encodeURIComponent(locationId)}`, '_blank');
}

// Show detail modal
function showDetailModal(item) {
    const modal = document.getElementById('detailModal');
    const title = document.getElementById('modalLocationTitle');
    const content = document.getElementById('modalContent');
    
    title.textContent = `📍 ${item.location_id}`;
    
    const badge = getUrgencyBadge(item.refugee_aid_score);
    const urgencyText = item.refugee_aid_score >= 0.7 ? 'CRITICAL' : 
                       item.refugee_aid_score >= 0.4 ? 'MODERATE' : 'LOW';
    
    let html = `
        <div class="detail-score-display">
            <div class="detail-score-label">Refugee Aid Urgency Score</div>
            <div class="detail-score-value">${item.refugee_aid_score.toFixed(3)}</div>
            <div class="detail-score-label">${urgencyText} PRIORITY</div>
        </div>
        
        <h3 style="color: #ffffff; margin-bottom: 20px;">📊 Location Information</h3>
        <div class="detail-grid">
            <div class="detail-item">
                <div class="detail-item-label">Population</div>
                <div class="detail-item-value">${item.population || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-label">Area (km²)</div>
                <div class="detail-item-value">${item.area_km2 || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-label">Crowd Density</div>
                <div class="detail-item-value">${item.crowd_density ? item.crowd_density.toFixed(1) : 'N/A'}</div>
            </div>
        </div>
        
        <h3 style="color: #ffffff; margin: 30px 0 20px;">🍽️ Resources</h3>
        <div class="detail-grid">
            <div class="detail-item">
                <div class="detail-item-label">Food Supply (days)</div>
                <div class="detail-item-value">${item.food_supply_days || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-label">Water (L/person/day)</div>
                <div class="detail-item-value">${item.water_lpd || 'N/A'}</div>
            </div>
        </div>
        
        <h3 style="color: #ffffff; margin: 30px 0 20px;">💊 Health Status</h3>
        <div class="detail-grid">
            <div class="detail-item">
                <div class="detail-item-label">Health Severity</div>
                <div class="detail-item-value">${item.health_severity_0_1 ? item.health_severity_0_1.toFixed(2) : 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-label">Disease Incidence (per 1k)</div>
                <div class="detail-item-value">${item.disease_incidence_per_1k || 'N/A'}</div>
            </div>
        </div>
    `;
    
    if (item.details) {
        const labels = {
            density: 'Crowd Density',
            food: 'Food Supply',
            water: 'Water Supply',
            health: 'Health/Disease',
            weather: 'Weather/Disaster',
            movement: 'Movement/Influx'
        };
        
        html += `
            <h3 style="color: #ffffff; margin: 30px 0 20px;">📈 Signal Breakdown</h3>
            <div class="detail-grid">
        `;
        
        Object.entries(item.details).forEach(([key, value]) => {
            const percent = (value * 100).toFixed(1);
            html += `
                <div class="detail-item">
                    <div class="detail-item-label">${labels[key] || key}</div>
                    <div class="detail-item-value">${percent}%</div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    if (item.contributions) {
        html += `
            <h3 style="color: #ffffff; margin: 30px 0 20px;">⚖️ Weighted Contributions</h3>
            <div class="detail-grid">
        `;
        
        Object.entries(item.contributions).forEach(([key, value]) => {
            const contrib = (value * 100).toFixed(2);
            html += `
                <div class="detail-item">
                    <div class="detail-item-label">${key.toUpperCase()}</div>
                    <div class="detail-item-value">+${contrib}%</div>
                </div>
            `;
        });
        
        html += '</div>';
    }
    
    if (item.notes && item.notes.length > 0) {
        html += `
            <div style="background: rgba(255, 190, 11, 0.1); padding: 20px; border-radius: 12px; margin-top: 30px; border: 1px solid rgba(255, 190, 11, 0.3);">
                <strong style="color: #ffbe0b; display: block; margin-bottom: 10px;">⚠️ Notes:</strong>
                <ul style="list-style: none; padding: 0; color: #a0a0a0;">
        `;
        item.notes.forEach(note => {
            html += `<li style="padding: 5px 0;">• ${note}</li>`;
        });
        html += '</ul></div>';
    }
    
    content.innerHTML = html;
    modal.classList.add('show');
}

// Close detail modal
function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    modal.classList.remove('show');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('detailModal');
    if (e.target === modal) {
        closeDetailModal();
    }
});

// Critical Alerts Page
function renderCritical() {
    const data = getAllData();
    const critical = data.filter(d => d.refugee_aid_score >= 0.7);
    const container = document.getElementById('critical-page');
    
    if (critical.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <div class="empty-state-text">No critical alerts</div>
                <p>All locations are within acceptable parameters</p>
            </div>
        `;
        return;
    }
    
    // Sort by score descending
    critical.sort((a, b) => b.refugee_aid_score - a.refugee_aid_score);
    
    let html = `<div style="margin-bottom: 20px;">
        <p style="color: #dc3545; font-weight: 600; font-size: 1.1rem;">
            ⚠️ ${critical.length} location(s) require immediate attention
        </p>
    </div>`;
    
    critical.forEach(item => {
        const issues = [];
        if (item.details) {
            if (item.details.food && item.details.food > 0.7) issues.push('Critical food shortage');
            if (item.details.water && item.details.water > 0.7) issues.push('Severe water scarcity');
            if (item.details.health && item.details.health > 0.7) issues.push('Health crisis');
            if (item.details.density && item.details.density > 0.7) issues.push('Overcrowding');
        }
        
        html += `
            <div class="alert-card">
                <div class="alert-header">
                    <div class="alert-location">🚨 ${item.location_id}</div>
                    <div class="alert-score">${item.refugee_aid_score.toFixed(3)}</div>
                </div>
                <div class="alert-details">
                    <p><strong>Population:</strong> ${item.population || 'Unknown'}</p>
                    ${issues.length > 0 ? `<p><strong>Issues:</strong> ${issues.join(', ')}</p>` : ''}
                    <p><strong>Recommended Action:</strong> Immediate aid deployment required</p>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Analytics Page
function renderAnalytics() {
    const data = getAllData();
    const container = document.getElementById('analytics-page');
    
    if (data.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <div class="empty-state-text">No analytics available</div>
                <p>Need data to generate analytics</p>
            </div>
        `;
        return;
    }
    
    const stats = calculateDetailedStats(data);
    
    container.innerHTML = `
        <div class="chart-container">
            <div class="chart-title">Aid Score Distribution</div>
            ${renderDistributionChart(data)}
        </div>
        
        <div class="chart-container">
            <div class="chart-title">Signal Strength Analysis</div>
            ${renderBarChart(stats.avgSignals)}
        </div>
        
        <div class="chart-container">
            <div class="chart-title">Top 5 Highest Urgency Locations</div>
            ${renderTopLocations(data)}
        </div>
    `;
}

function calculateDetailedStats(data) {
    const avgSignals = {
        density: 0,
        food: 0,
        water: 0,
        health: 0,
        weather: 0,
        movement: 0
    };
    
    let counts = {...avgSignals};
    data.forEach(item => {
        if (item.details) {
            Object.keys(avgSignals).forEach(key => {
                if (item.details[key] !== undefined) {
                    avgSignals[key] += item.details[key];
                    counts[key]++;
                }
            });
        }
    });
    
    Object.keys(avgSignals).forEach(key => {
        avgSignals[key] = counts[key] > 0 ? avgSignals[key] / counts[key] : 0;
    });
    
    return { avgSignals };
}

function renderDistributionChart(data) {
    const ranges = {
        'Critical (0.7-1.0)': 0,
        'Moderate (0.4-0.7)': 0,
        'Low (0-0.4)': 0
    };
    
    data.forEach(item => {
        const score = item.refugee_aid_score;
        if (score >= 0.7) ranges['Critical (0.7-1.0)']++;
        else if (score >= 0.4) ranges['Moderate (0.4-0.7)']++;
        else ranges['Low (0-0.4)']++;
    });
    
    let html = '<div style="padding: 10px 0;">';
    const colors = {
        'Critical (0.7-1.0)': '#ff006e',
        'Moderate (0.4-0.7)': '#ffbe0b',
        'Low (0-0.4)': '#3a86ff'
    };
    
    Object.entries(ranges).forEach(([label, count]) => {
        const percent = ((count / data.length) * 100).toFixed(1);
        html += `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight: 600; color: #e0e0e0;">${label}</span>
                    <span style="color: ${colors[label]}; font-weight: 700;">${count} locations (${percent}%)</span>
                </div>
                <div style="background: rgba(10, 0, 20, 0.8); border-radius: 10px; height: 12px; overflow: hidden; border: 1px solid rgba(102, 0, 51, 0.3);">
                    <div style="background: ${colors[label]}; height: 100%; width: ${percent}%; border-radius: 10px; box-shadow: 0 0 15px ${colors[label]}80;"></div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    return html;
}

function renderTopLocations(data) {
    const sorted = [...data].sort((a, b) => b.refugee_aid_score - a.refugee_aid_score);
    const top5 = sorted.slice(0, 5);
    
    let html = '<table class="data-table"><thead><tr>';
    html += '<th>Rank</th><th>Location</th><th>Score</th><th>Status</th>';
    html += '</tr></thead><tbody>';
    
    top5.forEach((item, index) => {
        const badge = getUrgencyBadge(item.refugee_aid_score);
        html += `
            <tr>
                <td><strong>#${index + 1}</strong></td>
                <td><strong>${item.location_id}</strong></td>
                <td>${item.refugee_aid_score.toFixed(3)}</td>
                <td>${badge}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    return html;
}

// Submit Form Page
function renderSubmitForm() {
    const container = document.getElementById('submit-page');
    
    container.innerHTML = `
        <div class="form-container">
            <h2 style="margin-bottom: 20px; color: #ffffff; background: linear-gradient(90deg, #ff006e 0%, #3a86ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Submit New Location Data</h2>
            <form id="submitForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Location ID *</label>
                        <input type="text" id="location_id" required>
                    </div>
                    <div class="form-group">
                        <label>Population</label>
                        <input type="number" id="population">
                    </div>
                    <div class="form-group">
                        <label>Area (km²)</label>
                        <input type="number" step="0.1" id="area_km2">
                    </div>
                    <div class="form-group">
                        <label>Crowd Density (ppl/km²)</label>
                        <input type="number" step="0.1" id="crowd_density">
                    </div>
                </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label>Food Supply (days)</label>
                        <input type="number" step="0.1" id="food_supply_days">
                    </div>
                    <div class="form-group">
                        <label>Water (L/person/day)</label>
                        <input type="number" step="0.1" id="water_lpd">
                    </div>
                </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label>Health Severity (0-1)</label>
                        <input type="number" step="0.01" min="0" max="1" id="health_severity_0_1">
                    </div>
                    <div class="form-group">
                        <label>Disease Incidence (per 1000)</label>
                        <input type="number" step="0.1" id="disease_incidence_per_1k">
                    </div>
                </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label>Weather Severity (0-1)</label>
                        <input type="number" step="0.01" min="0" max="1" id="weather_severity_0_1">
                    </div>
                    <div class="form-group">
                        <label>Disaster Flag</label>
                        <select id="disaster_flag">
                            <option value="">Not specified</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Influx (% change, 7 days)</label>
                        <input type="number" step="0.1" id="influx_percent_7d">
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    <button type="submit" class="btn btn-primary">Calculate & Save</button>
                    <button type="button" class="btn" onclick="resetSubmitForm()" style="margin-left: 10px; background: #6c757d; color: white;">Reset</button>
                </div>
            </form>
            
            <div id="submitResult" style="margin-top: 30px;"></div>
        </div>
    `;
    
    // Attach form handler
    document.getElementById('submitForm').addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {};
    const fields = [
        'location_id', 'population', 'area_km2', 'crowd_density',
        'food_supply_days', 'water_lpd', 'health_severity_0_1',
        'disease_incidence_per_1k', 'weather_severity_0_1',
        'disaster_flag', 'influx_percent_7d'
    ];
    
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        if (value !== '') {
            formData[field] = value;
        }
    });
    
    try {
        const response = await fetch(`${API_BASE}/score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('API request failed');
        
        const results = await response.json();
        const result = results[0];
        
        // Save to local storage
        saveData(result);
        
        // Check if critical and send notification
        console.log('Score:', result.refugee_aid_score, 'Critical threshold: 0.7');
        if (result.refugee_aid_score >= 0.7) {
            console.log('🚨 CRITICAL ALERT! Sending notification...');
            sendDesktopNotification(
                '🚨 CRITICAL ALERT - Refugee Aid',
                `Location "${result.location_id}" requires immediate attention! Aid Score: ${result.refugee_aid_score.toFixed(3)}`,
                '🚨'
            );
        } else {
            console.log('Score not critical, no notification sent');
        }
        
        // Display result
        const badge = getUrgencyBadge(result.refugee_aid_score);
        const alertClass = result.refugee_aid_score >= 0.7 ? 
            'background: linear-gradient(135deg, rgba(255, 0, 110, 0.1) 0%, rgba(255, 77, 148, 0.1) 100%); border: 1px solid rgba(255, 0, 110, 0.3);' :
            'background: linear-gradient(135deg, rgba(58, 134, 255, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%); border: 1px solid rgba(58, 134, 255, 0.3);';
        const alertColor = result.refugee_aid_score >= 0.7 ? '#ff006e' : '#3a86ff';
        
        document.getElementById('submitResult').innerHTML = `
            <div style="${alertClass} padding: 20px; border-radius: 12px;">
                <h3 style="color: ${alertColor}; margin-bottom: 10px;">✅ Data Saved Successfully!</h3>
                <p style="color: #e0e0e0;"><strong>Location:</strong> ${result.location_id}</p>
                <p style="color: #e0e0e0;"><strong>Aid Score:</strong> ${result.refugee_aid_score.toFixed(3)} ${badge}</p>
                ${result.refugee_aid_score >= 0.7 ? '<p style="color: #ff006e; font-weight: 700; margin-top: 10px;">⚠️ CRITICAL: Desktop notification sent!</p>' : ''}
                <button onclick="switchPage('overview')" class="btn btn-primary" style="margin-top: 15px;">View Dashboard</button>
            </div>
        `;
        
        // Reset form
        setTimeout(() => {
            resetSubmitForm();
        }, 3000);
        
    } catch (error) {
        document.getElementById('submitResult').innerHTML = `
            <div style="background: rgba(255, 0, 110, 0.1); border: 1px solid rgba(255, 0, 110, 0.3); padding: 20px; border-radius: 12px; color: #ff006e;">
                <strong>❌ Error:</strong> ${error.message}
            </div>
        `;
    }
}

function resetSubmitForm() {
    document.getElementById('submitForm').reset();
    document.getElementById('submitResult').innerHTML = '';
}

// Utility functions
function getUrgencyBadge(score) {
    if (score >= 0.7) {
        return '<span class="badge badge-critical">CRITICAL</span>';
    } else if (score >= 0.4) {
        return '<span class="badge badge-moderate">MODERATE</span>';
    } else {
        return '<span class="badge badge-low">LOW</span>';
    }
}

// --- CONFIGURATION ---
const SESSION_KEY = 'knox_session';
const DEVICE_KEY = 'knox_device_id';
const LICENSE_DB = 'knox_licenses';

// Default demo keys if DB is empty
const DEFAULT_KEYS = ["KNOX-DEMO-1234", "KNOX-TEST-5678"];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
    checkSession();
    setupEventListeners();
});

function initDatabase() {
    if (!localStorage.getItem(LICENSE_DB)) {
        localStorage.setItem(LICENSE_DB, JSON.stringify(DEFAULT_KEYS));
    }
}

// --- AUTHENTICATION LOGIC ---
function checkSession() {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    
    if (session) {
        // Verify if session is expired
        if (Date.now() > session.expiresAt) {
            logout();
            showError("SESSION EXPIRED. PLEASE RE-VERIFY.");
            return;
        }
        
        // Restore Session
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('dashboard-screen').classList.remove('hidden');
        loadDashboardData(session);
        startTimer(session.expiresAt);
    } else {
        // Show Auth
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('dashboard-screen').classList.add('hidden');
        
        // Autofill remembered key
        const savedKey = localStorage.getItem('knox_remember');
        if (savedKey) {
            document.getElementById('license-input').value = savedKey;
            document.getElementById('remember-key').checked = true;
        }
    }
}

function verifyKey() {
    const input = document.getElementById('license-input').value.trim().toUpperCase();
    const remember = document.getElementById('remember-key').checked;
    const btn = document.getElementById('verify-btn');
    const errorDiv = document.getElementById('auth-error');

    errorDiv.classList.add('hidden');
    
    if (!input) {
        showError("PLEASE ENTER A LICENSE KEY.");
        return;
    }

    btn.innerText = "VERIFYING...";
    btn.disabled = true;

    // Simulate network request
    setTimeout(() => {
        const validKeys = JSON.parse(localStorage.getItem(LICENSE_DB));
        
        if (validKeys.includes(input)) {
            // Success
            if (remember) localStorage.setItem('knox_remember', input);
            else localStorage.removeItem('knox_remember');

            const expiresAt = Date.now() + (40 * 60 * 1000); // 40 minutes from now
            const sessionData = {
                key: input,
                deviceId: getOrCreateDeviceId(),
                activatedAt: Date.now(),
                expiresAt: expiresAt
            };

            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            
            // Show success animation
            btn.style.background = "var(--accent-green)";
            btn.innerText = "SUCCESS!";
            
            setTimeout(() => {
                btn.style.background = "";
                btn.innerText = "VERIFY KEY →";
                btn.disabled = false;
                checkSession();
            }, 1000);

        } else {
            // Error
            btn.innerText = "VERIFY KEY →";
            btn.disabled = false;
            showError("INVALID LICENSE KEY.");
        }
    }, 1500);
}

function showError(msg) {
    const errorDiv = document.getElementById('auth-error');
    errorDiv.innerText = msg;
    errorDiv.classList.remove('hidden');
}

// --- DASHBOARD LOGIC ---
function loadDashboardData(session) {
    const deviceId = session.deviceId || getOrCreateDeviceId();
    const deviceShort = deviceId.substring(0, 8).toUpperCase() + "...";
    
    // Home Tab
    document.getElementById('display-key').innerText = session.key;
    document.getElementById('device-info-text').innerText = `ANDROID 14 • ${deviceShort}`;
    
    const actDate = new Date(session.activatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const expDate = new Date(session.expiresAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    document.getElementById('stat-activated').innerText = actDate;
    document.getElementById('stat-expires').innerText = expDate;
    document.getElementById('stat-device').innerText = "Android 14";
    
    // Manage Tab
    document.getElementById('manage-device-name').innerText = `ANDROID 14 • ${deviceShort}`;
}

let timerInterval;

function startTimer(expiresAt) {
    if (timerInterval) clearInterval(timerInterval);

    const countdownEl = document.getElementById('countdown');

    timerInterval = setInterval(() => {
        const now = Date.now();
        const diff = expiresAt - now;

        if (diff <= 0) {
            clearInterval(timerInterval);
            countdownEl.innerText = "EXPIRED";
            countdownEl.classList.add('text-red');
            setTimeout(logout, 2000);
            return;
        }

        const minutes = Math.floor(diff / 1000 / 60);
        const seconds = Math.floor((diff / 1000) % 60);

        countdownEl.innerText = `${minutes.toString().padStart(2, '0')}M ${seconds.toString().padStart(2, '0')}S`;
    }, 1000);
}

// --- UI INTERACTIONS ---
function switchTab(tabId, element) {
    // Update Nav
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    // Update Content
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');

    // Update Header Title
    document.getElementById('page-title').innerText = tabId.toUpperCase();
}

function toggleFeature(checkbox) {
    const card = checkbox.closest('.feature-card');
    if (checkbox.checked) {
        card.classList.add('enabled');
    } else {
        card.classList.remove('enabled');
    }
}

// Style selector logic
document.querySelectorAll('.style-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.parentElement.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// --- UTILS ---
function getOrCreateDeviceId() {
    let deviceId = localStorage.getItem(DEVICE_KEY);
    if (!deviceId) {
        // Generate simple UUID
        deviceId = 'dev-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem(DEVICE_KEY, deviceId);
    }
    return deviceId;
}

function copyKey() {
    const key = document.getElementById('display-key').innerText;
    navigator.clipboard.writeText(key).then(() => {
        alert("Key copied to clipboard!");
    });
}

function pasteKey() {
    navigator.clipboard.readText().then(text => {
        document.getElementById('license-input').value = text;
    });
}

function logout() {
    localStorage.removeItem(SESSION_KEY);
    location.reload();
}

function openModal() {
    document.getElementById('updates-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('updates-modal').classList.add('hidden');
}

function setupEventListeners() {
    // Allow Enter key to submit
    document.getElementById('license-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') verifyKey();
    });
}

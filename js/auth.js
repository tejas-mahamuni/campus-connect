// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Auth state observer
firebase.auth().onAuthStateChanged((user) => {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userProfileBtn = document.getElementById('userProfileBtn');
    
    if (user) {
        // User is signed in
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (userProfileBtn) {
            userProfileBtn.style.display = 'block';
            userProfileBtn.innerHTML = `
                <img src="${user.photoURL || 'img/default-avatar.png'}" alt="${user.displayName}" 
                     class="rounded-circle" style="width: 32px; height: 32px;">
            `;
        }
        
        // Store user data
        localStorage.setItem('user', JSON.stringify({
            email: user.email,
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
        }));
    } else {
        // User is signed out
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userProfileBtn) userProfileBtn.style.display = 'none';
        
        // Clear user data
        localStorage.removeItem('user');
        
        // Redirect to login if on protected page
        const protectedPages = ['attendance.html', 'scanner.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }
    }
});

// Logout function
function logout() {
    firebase.auth().signOut()
        .then(() => {
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Logout Error:', error);
        });
}

// Check if user is authenticated
function isAuthenticated() {
    return !!firebase.auth().currentUser;
}

// Get current user
function getCurrentUser() {
    return firebase.auth().currentUser;
}

// Protected route function
function requireAuth(callback) {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = 'login.html';
        } else if (callback) {
            callback(user);
        }
    });
} 
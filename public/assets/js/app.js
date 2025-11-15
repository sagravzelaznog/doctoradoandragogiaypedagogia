// Configuración global de Firebase
const { auth, db, storage } = window;

// Estado global de la aplicación
const state = {
    user: null,
    loading: true,
    error: null
};

// Verificar estado de autenticación
auth.onAuthStateChanged((user) => {
    state.user = user;
    state.loading = false;
    updateUI();
});

// Actualizar la interfaz de usuario según el estado de autenticación
function updateUI() {
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userInfo = document.getElementById('user-info');
    
    if (state.user) {
        // Usuario autenticado
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (userInfo) {
            userInfo.style.display = 'flex';
            userInfo.querySelector('span').textContent = state.user.displayName || state.user.email;
        }
    } else {
        // Usuario no autenticado
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// Manejador de cierre de sesión
function handleLogout() {
    auth.signOut().then(() => {
        // Cierre de sesión exitoso
        state.user = null;
        updateUI();
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
        state.error = 'Error al cerrar sesión';
    });
}

// Agregar manejador de eventos al botón de cierre de sesión
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Elementos de la interfaz de usuario
const uiElements = {
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    logoutBtn: document.getElementById('logoutBtn'),
    userMenu: document.getElementById('userMenu'),
    userEmail: document.getElementById('userEmail'),
    loginBtn: document.getElementById('loginBtn'),
    authButtons: document.getElementById('authButtons')
};

// Inicializar la aplicación
function initApp() {
    // Verificar estado de autenticación al cargar la página
    checkAuthState();
    
    // Configurar manejadores de eventos
    setupEventListeners();
}

// Verificar estado de autenticación
function checkAuthState() {
    onAuthStateChanged((user) => {
        state.user = user;
        state.loading = false;
        updateUI();
    });
}

// Actualizar la interfaz de usuario según el estado de autenticación
function updateUI() {
    if (state.loading) {
        // Mostrar estado de carga si es necesario
        return;
    }

    if (state.user) {
        // Usuario autenticado
        if (uiElements.loginBtn) uiElements.loginBtn.style.display = 'none';
        if (uiElements.logoutBtn) uiElements.logoutBtn.style.display = 'block';
        if (uiElements.userMenu) uiElements.userMenu.style.display = 'block';
        if (uiElements.userEmail && state.user.email) {
            uiElements.userEmail.textContent = state.user.displayName || state.user.email;
        }
    } else {
        // Usuario no autenticado
        if (uiElements.loginBtn) uiElements.loginBtn.style.display = 'block';
        if (uiElements.logoutBtn) uiElements.logoutBtn.style.display = 'none';
        if (uiElements.userMenu) uiElements.userMenu.style.display = 'none';
    }
}

// Configurar manejadores de eventos
function setupEventListeners() {
    // Inicio de sesión
    if (uiElements.loginForm) {
        uiElements.loginForm.addEventListener('submit', handleLogin);
    }

    // Registro
    if (uiElements.registerForm) {
        uiElements.registerForm.addEventListener('submit', handleRegister);
    }

    // Cerrar sesión
    if (uiElements.logoutBtn) {
        uiElements.logoutBtn.addEventListener('click', handleLogout);
    }

    // Botón de Google
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }

    // Restablecer contraseña
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }
}

// Manejador de inicio de sesión
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');

    try {
        const { success, user, error } = await loginWithEmail(email, password);
        
        if (success) {
            // Redirigir al dashboard
            window.location.href = 'dashboard.html';
        } else {
            if (errorElement) {
                errorElement.textContent = error;
                errorElement.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        if (errorElement) {
            errorElement.textContent = 'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.';
            errorElement.style.display = 'block';
        }
    }
}

// Manejador de registro
async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const displayName = document.getElementById('displayName').value;
    const errorElement = document.getElementById('registerError');
    const successElement = document.getElementById('registerSuccess');

    try {
        const { success, user, error } = await registerWithEmail(email, password, displayName);
        
        if (success) {
            if (successElement) {
                successElement.textContent = '¡Registro exitoso! Por favor, verifica tu correo electrónico.';
                successElement.style.display = 'block';
                
                // Limpiar el formulario
                e.target.reset();
                
                // Redirigir después de 3 segundos
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
            }
        } else {
            if (errorElement) {
                errorElement.textContent = error;
                errorElement.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        if (errorElement) {
            errorElement.textContent = 'Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.';
            errorElement.style.display = 'block';
        }
    }
}

// Manejador de cierre de sesión
async function handleLogout() {
    try {
        const { success, error } = await logout();
        
        if (success) {
            // Redirigir a la página de inicio
            window.location.href = '../../index.html';
        } else {
            console.error('Error al cerrar sesión:', error);
            alert('Ocurrió un error al cerrar la sesión. Por favor, inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

// Manejador de inicio de sesión con Google
async function handleGoogleLogin() {
    try {
        const { success, user, error } = await loginWithGoogle();
        
        if (success) {
            // Redirigir al dashboard
            window.location.href = 'dashboard.html';
        } else {
            const errorElement = document.getElementById('loginError');
            if (errorElement) {
                errorElement.textContent = error;
                errorElement.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
    }
}

// Manejador de restablecimiento de contraseña
async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = prompt('Por favor, ingresa tu correo electrónico para restablecer tu contraseña:');
    
    if (email) {
        try {
            const { success, message } = await resetPassword(email);
            alert(message);
        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);
            alert('Ocurrió un error al intentar restablecer tu contraseña. Por favor, inténtalo de nuevo.');
        }
    }
}

// Inicializar la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initApp);

// Exportar funciones para su uso en otros archivos
export { 
    state, 
    updateUI,
    getCurrentUser,
    isAuthenticated
};
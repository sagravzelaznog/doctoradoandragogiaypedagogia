// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si Firebase está disponible
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.error('Firebase no está correctamente inicializado');
        return;
    }

    // Estado global de la aplicación
    const appState = {
        user: null,
        loading: true,
        error: null
    };

    // Referencias a elementos de la interfaz
    const uiElements = {
        loginForm: document.getElementById('loginForm'),
        registerForm: document.getElementById('registerForm'),
        logoutBtn: document.getElementById('logoutBtn') || document.getElementById('logout-btn'),
        userMenu: document.getElementById('userMenu'),
        userEmail: document.getElementById('userEmail'),
        loginBtn: document.getElementById('loginBtn') || document.getElementById('login-btn'),
        authButtons: document.getElementById('authButtons'),
        userInfo: document.getElementById('userInfo')
    };

    // Inicializar la aplicación
    function initApp() {
        setupEventListeners();
        checkAuthState();
    }

    // Verificar estado de autenticación
    function checkAuthState() {
        firebase.auth().onAuthStateChanged((user) => {
            appState.user = user;
            appState.loading = false;
            updateUI(user);
        });
    }

    // Actualizar la interfaz de usuario según el estado de autenticación
    function updateUI(user) {
        if (user) {
            // Usuario autenticado
            if (uiElements.userEmail) {
                uiElements.userEmail.textContent = user.email;
            }
            if (uiElements.userMenu) {
                uiElements.userMenu.style.display = 'block';
            }
            if (uiElements.authButtons) {
                uiElements.authButtons.style.display = 'none';
            }
            if (uiElements.logoutBtn) {
                uiElements.logoutBtn.style.display = 'block';
            }
            if (uiElements.loginBtn) {
                uiElements.loginBtn.style.display = 'none';
            }
            if (uiElements.userInfo) {
                uiElements.userInfo.style.display = 'flex';
                const userName = uiElements.userInfo.querySelector('span');
                if (userName) {
                    userName.textContent = user.displayName || user.email;
                }
            }
        } else {
            // Usuario no autenticado
            if (uiElements.userMenu) {
                uiElements.userMenu.style.display = 'none';
            }
            if (uiElements.authButtons) {
                uiElements.authButtons.style.display = 'block';
            }
            if (uiElements.logoutBtn) {
                uiElements.logoutBtn.style.display = 'none';
            }
            if (uiElements.loginBtn) {
                uiElements.loginBtn.style.display = 'block';
            }
            if (uiElements.userInfo) {
                uiElements.userInfo.style.display = 'none';
            }
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
        
        // Cierre de sesión
        if (uiElements.logoutBtn) {
            uiElements.logoutBtn.addEventListener('click', handleLogout);
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

// Hacer las funciones disponibles globalmente
window.appFunctions = {
    checkAuthState,
    updateUI,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGoogleLogin,
    handleForgotPassword
};
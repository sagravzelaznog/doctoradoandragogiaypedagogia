// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyATDwc4TWsJL9raHdgETKK8v4rn7qxySbo",
    authDomain: "doctoradopedayandragogia.firebaseapp.com",
    projectId: "doctoradopedayandragia",
    storageBucket: "doctoradopedayandragogia.appspot.com",
    messagingSenderId: "706516439782",
    appId: "1:706516439782:web:e3da95cd3c36481fbb2127",
    measurementId: "G-2ZBRR3TQ42"
};

// Inicializar Firebase solo si no existe una instancia previa
let app;
if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

// Inicializar servicios
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Configuración de Firestore
db.settings({ 
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED 
});

// Configuración de persistencia
db.enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('La persistencia de Firestore no está soportada en este navegador');
        } else if (err.code === 'unimplemented') {
            console.warn('El navegador actual no soporta todas las características de Firestore');
        }
    });

// Configuración de persistencia de autenticación
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch((error) => {
        console.error('Error al configurar la persistencia de autenticación:', error);
    });

// Hacer las variables disponibles globalmente
window.firebase = firebase;
window.auth = auth;
window.db = db;
window.storage = storage;
window.firebaseApp = app;
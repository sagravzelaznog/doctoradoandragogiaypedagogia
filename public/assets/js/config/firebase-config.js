// Configuración de Firebase
const firebaseConfig = {
	apiKey: "AIzaSyATDwc4TWsJL9raHdgETKK8v4rn7qxySbo",
	authDomain: "doctoradopedayandragogia.firebaseapp.com",
	projectId: "doctoradopedayandragogia",
	storageBucket: "doctoradopedayandragogia.firebasestorage.app",
	messagingSenderId: "706516439782",
	appId: "1:706516439782:web:e3da95cd3c36481fbb2127",
	measurementId: "G-2ZBRR3TQ42"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);

// Inicializar servicios
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Configuración de Firestore
const firestore = firebase.firestore();
firestore.settings({ 
	cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED 
});
firestore.enablePersistence()
	.catch((err) => {
					if (err.code === 'failed-precondition') {
									console.warn('La persistencia de Firestore no está soportada en este navegador');
					} else if (err.code === 'unimplemented') {
									console.warn('Tu navegador no soporta todas las características necesarias para la persistencia');
					}
	});

// Configuración de autenticación
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
	.catch((error) => {
					console.error('Error al configurar la persistencia de autenticación:', error);
	});

// Exportar servicios
export { 
	app, 
	auth, 
	db, 
	storage,
	firestore 
};
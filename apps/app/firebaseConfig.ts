import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator, initializeAuth, getReactNativePersistence, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
    apiKey: "AIzaSyDK45ccRF5Irc1x84wAgz41Q3kPpPXQRsA",
    authDomain: "foody-note.firebaseapp.com",
    projectId: "foody-note",
    storageBucket: "foody-note.firebasestorage.app",
    messagingSenderId: "54991860683",
    appId: "1:54991860683:web:7c4e9cf2ddc33ab6ad3c4e",
    measurementId: "G-5Z36SH260T"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig,);
} else {
    app = getApp();
}

// Initialize Services
// For React Native Auth Persistence
let auth: Auth;
if (Platform.OS !== 'web') {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
} else {
    auth = getAuth(app,);
}

const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);

// Connect to Emulators in Dev
if (__DEV__) {
    console.log('Connecting to Firebase Emulators...');
    // Use 10.0.2.2 for Android Emulator, localhost for iOS/Web
    // However, since we are usually running on physical device or simulator on same network,
    // we might need the machine's IP. For simplicity in Simulator/Web: localhost works.
    // For Android Emulator only: 10.0.2.2
    const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(db, host, 8080);
    connectFunctionsEmulator(functions, host, 5001);
    connectStorageEmulator(storage, host, 9199);
}

export { auth, db, functions, storage };

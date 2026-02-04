import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, signInWithPopup, UserCredential } from 'firebase/auth';
import { Platform } from 'react-native';
import { auth } from '../../firebaseConfig';

// Initialize GoogleSignin for Native
if (Platform.OS !== 'web') {
    GoogleSignin.configure({
        webClientId: '54991860683-ro492f5gcq57jgtoo55hmndt41mcpo53.apps.googleusercontent.com', // From Google Cloud Console (Web Client ID)
        iosClientId: '54991860683-4jr5hduqbpoof64h79kdqvhg52brbqcj.apps.googleusercontent.com', // From Google Cloud Console (Web Client ID)
    });
}

export const signInWithGoogle = async (): Promise<UserCredential | null> => {
    try {
        if (Platform.OS === 'web') {
            const provider = new GoogleAuthProvider();
            return await signInWithPopup(auth, provider);
        } else {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices();

            // Get the users ID token
            const signInResult = await GoogleSignin.signIn();
            const idToken = signInResult.data?.idToken;

            if (!idToken) {
                throw new Error('No ID token found');
            }

            // Create a Google credential with the token
            const googleCredential = GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            return await signInWithCredential(auth, googleCredential);
        }
    } catch (error: any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.warn('User cancelled the login flow');
            // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
            console.warn('Sign in is in progress already');
            // operation (e.g. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.warn('Play services not available or outdated');
            // play services not available or outdated
        } else {
            // some other error happened
            console.error('Google Sign-In Error:', error);
        }
        throw error;
    }
};

export const signOutGoogle = async () => {
    try {
        if (Platform.OS !== 'web') {
            await GoogleSignin.signOut();
        }
        await auth.signOut();
    } catch (error) {
        console.error('Sign Out Error:', error);
    }
};

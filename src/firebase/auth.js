import { auth } from './firebase';

// Sign Up
export const createUserWithEmailAndPassword = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
}

// Sign In
export const signInWithEmailAndPassword = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
}

// Sign out
export const signOut = () => {
    return auth.signOut();
}
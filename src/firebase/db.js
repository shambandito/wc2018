import { db } from './firebase';

export const createUser = (id, email) => {
    return db.ref(`users/${id}`).set({
        email: email,
        tips: {}
    });
}

export const onceGetUsers = () => {
    return db.ref('users').once('value');
}

export const updateUser = (id, email, tips) => {
    return db.ref(`users/${id}`).set({
        email: email,
        tips: tips
    });
}


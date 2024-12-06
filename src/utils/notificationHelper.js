import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const createNotification = async (type, message, userId, details = {}) => {
    try {
        await addDoc(collection(db, 'notifications'), {
            type,
            message,
            userId,
            details,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

// Usage examples:
export const notificationTypes = {
    USER_LOGIN: 'user_login',
    PASSWORD_RESET: 'password_reset',
    NEW_USER: 'new_user',
    HUB_REGISTRATION: 'hub_registration',
    CONTENT_UPDATE: 'content_update'
}; 
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';


const firebaseConfig = {
    apiKey: "AIzaSyClF_DVA7HI7TIfVU6Xbz7LosEWkrpIIEg",
    authDomain: "sitesync-d33a1.firebaseapp.com",
    projectId: "sitesync-d33a1",
    storageBucket: "sitesync-d33a1.firebasestorage.app",
    messagingSenderId: "98655238859",
    appId: "1:98655238859:web:e6b725048987b9c913b94e"
};


const VAPID_KEY = 'BNRgQ9twHoufDOy-1zloXdLimhCYSREIj7nFe5Ur3P5LM1SgMPZS1NRImlRQt0FBg8AeQ77fIwV6Ob9aNIsCHt8';

@Injectable({ providedIn: 'root' })
export class WebNotificationService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/tokens';

    async init() {
        try {
            const app = initializeApp(firebaseConfig);
            const messaging = getMessaging(app);

            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.warn('Permission de notification refusée');
                return;
            }

            const token = await getToken(messaging, { vapidKey: VAPID_KEY });
            if (token) {
                console.log('Token web FCM:', token);
                this.registerToken(token);
            }

            // notifications reçues quand le backoffice est au premier plan
            onMessage(messaging, (payload) => {
                const title = payload.notification?.title ?? 'Notification';
                const body = payload.notification?.body ?? '';
                new Notification(title, { body });
            });
        } catch (e) {
            console.error('Erreur init notifications web:', e);
        }
    }

    private registerToken(token: string) {
         this.http.post(this.apiUrl, { token }, { responseType: 'text' }).subscribe({
             next: () => console.log('Token web enregistré'),
             error: (err) => console.error('Erreur enregistrement token', err)
     });
}
}
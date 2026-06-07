importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyClF_DVA7HI7TIfVU6Xbz7LosEWkrpIIEg",
  authDomain: "sitesync-d33a1.firebaseapp.com",
  projectId: "sitesync-d33a1",
  storageBucket: "sitesync-d33a1.firebasestorage.app",
  messagingSenderId: "98655238859",
  appId: "1:98655238859:web:e6b725048987b9c913b94e"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body
  });
});
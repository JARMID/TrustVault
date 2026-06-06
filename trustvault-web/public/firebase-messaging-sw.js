// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  apiKey: "AIzaSyAL6wvmRLbcWNoFtKKmVNJdukuX-H_GoFg",
  authDomain: "sqdqs-2a286.firebaseapp.com",
  projectId: "sqdqs-2a286",
  storageBucket: "sqdqs-2a286.firebasestorage.app",
  messagingSenderId: "395307391424",
  appId: "1:395307391424:web:3523a58688e7a7a4aa5025"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title || 'TrustVault Notification';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png', // Assuming there's a logo
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
// // Initialize the Firebase app in the service worker by passing the generated config

// const firebaseConfig = {
//     apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//     authDomain: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//     projectId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//     storageBucket: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//     messagingSenderId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//     appId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//     measurementId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
// };

const firebaseConfig = {
    apiKey: "AIzaSyCnUgfBHLkK-tzAOrfsfVRonQgdTm1J9S4",
    authDomain: "libwana-classify.firebaseapp.com",
    projectId: "libwana-classify",
    storageBucket: "libwana-classify.firebasestorage.app",
    messagingSenderId: "956605756070",
    appId: "1:956605756070:web:1f284422e2cda5cb08ba67",
    measurementId: "G-C4S1F077EC"
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Retrieve firebase messaging
const messaging = firebase.messaging();

self.addEventListener('install', function (event) {
    console.log('Hello world from the Service Worker :call_me_hand:');
});



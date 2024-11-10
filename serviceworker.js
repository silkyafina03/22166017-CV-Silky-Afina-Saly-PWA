importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const cacheName = 'v1';
const cacheAssets = [
  '/',
  '/index.html',
  '/js/script.js',
  'css/style.css',
  'css/font-awesome.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/webfonts/fa-brands-400.woff2',
  '/manifest.json',
  '/img/about-img.png',
  '/img/profile-img.png', 
  '/img/icon/portofolio-icon.png',  
  '/img/portofolio/1.png', 
  '/img/portofolio/2.png',  
  '/img/portofolio/3.png', 
  '/img/portofolio/4.png',  
  '/img/portofolio/5.png',  
  '/img/portofolio/6.png'
];

// Install Event
// Install event - caching file statis
self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
      caches.open(cacheName).then(cache => {
        cache.addAll(cacheAssets)
      })
    )
  });

// Activate event - menghapus cache lama
self.addEventListener('activate', function(event) {
    var cacheWhitelist = [cacheName];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event: tangani permintaan jaringan dan memuat static assets
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});


firebase.initializeApp({
    apiKey: "AIzaSyBk7V-oTo4FCTfUiYgkAiACwZ8MYkz7zTY",
    authDomain: "portofolio-91e47.firebaseapp.com",
    projectId: "portofolio-91e47",
    storageBucket: "portofolio-91e47.firebasestorage.app",
    messagingSenderId: "334879704481",
    appId: "1:334879704481:web:55a13d3a07a0bba6d637e0",
    measurementId: "G-DKY89RY9YC"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = 'Sky Creative';
  const notificationOptions = {
    body: 'Hi! You are viewing Silky Portofolio',
    icon: '/img/icon/portofolio-icon.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

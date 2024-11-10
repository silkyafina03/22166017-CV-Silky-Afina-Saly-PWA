if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceworker.js')
    .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch((error) => {
        console.log('Service Worker registration failed:', error);
    });
  }
  
  /*Toggle navbar*/
  const navToggler = document.querySelector(".nav-toggler");
  if (navToggler) {
    navToggler.addEventListener("click", () => {
      hideSection();
      toggleNavbar();
      
    });
  }
  
  function hideSection() {
    const activeSection = document.querySelector("section.active");
    if (activeSection) {
      activeSection.classList.remove("active", "fade-out"); // Remove active from current section
      
    }
  }
  
  function toggleNavbar() {
    const header = document.querySelector(".header");
    if (header) {
      header.classList.toggle("active");
    }
  }
  
  /*--------- Active Section--------*/
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("link-item") && e.target.hash !== "") {
      // active the overlay
      const overlay = document.querySelector(".overlay");
      if (overlay) overlay.classList.add("active");
  
      navToggler.classList.add("active");
  
      if (e.target.classList.contains("nav-item")) {
        toggleNavbar();
      } else {
        hideSection();
        document.body.classList.add("hide-scrolling");
      }
  
      setTimeout(() => {
        const activeSection = document.querySelector("section.active");
        const targetSection = document.querySelector(e.target.hash);
  
        if (activeSection && targetSection) {
          activeSection.classList.remove("active", "fade-out");  // Remove active class from current section
          targetSection.classList.add("active"); // Add active class to target section
          window.scrollTo(0, 0); // Scroll to top
          document.body.classList.remove("hide-scrolling");
          navToggler.classList.remove("hide");
          if (overlay) overlay.classList.remove("active");
        }
      }, 500);
    }
  });
  
  
  
  
  /*----------- About Tabs-----------*/
   const tabsContainer = document.querySelector(".about-tabs"),
   aboutSection = document.querySelector(".about-section");
  
   tabsContainer.addEventListener("click", (e) =>{
     if(e.target.classList.contains("tab-item") && !e.target.classList.contains("active")){
           tabsContainer.querySelector(".active").classList.remove("active");
          e.target.classList.add("active");
      const target= e.target.getAttribute("data-target");
      aboutSection.querySelector(".tab-content.active").classList.remove("active");
      aboutSection.querySelector(target).classList.add("active");
     }
   });
  
  /*portofoilo item detail pop up*/
  document.addEventListener("click", (e) =>{
    if(e.target.classList.contains("view-project-btn")){
      togglePortofolioPopup();
      document.querySelector(".portofolio-popup").scrollTo(0,0);
      portofolioItemDetails(e.target.parentElement);
    }
  })
  function togglePortofolioPopup(){
    document.querySelector(".portofolio-popup").classList.toggle("open");
    document.body.classList.toggle("hide-scrolling");
    document.querySelector(".main").classList.toggle("fade-out");
  }
  document.querySelector(".pp-close").addEventListener("click", togglePortofolioPopup);
  
  //hide popup when clicking outside of it
  document.addEventListener("click", (e) =>{
    if(e.target.classList.contains("pp-inner")){
      togglePortofolioPopup();
    }
  })
  
  function portofolioItemDetails(portofolioItem){
    document.querySelector(".pp-thumbnail img").src =
    portofolioItem.querySelector(".portofolio-item-thumbnail img").src;
  
    document.querySelector(".pp-header h3").innerHTML = 
    portofolioItem.querySelector(".portofolio-item-tittle").innerHTML;
  
    document.querySelector(".pp-body").innerHTML =
    portofolioItem.querySelector(".portofolio-item-detail").innerHTML;
  }
  //Notfifikasi 
  
  
   // Membuka database IndexedDB
  const dbRequest = indexedDB.open("ContactMessagesDB", 1);
  
  dbRequest.onupgradeneeded = function(event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("contacts")) {
          const objectStore = db.createObjectStore("contacts", { keyPath: "id", autoIncrement: true });
          objectStore.createIndex("name", "name", { unique: false });
          objectStore.createIndex("email", "email", { unique: false });
          objectStore.createIndex("subject", "subject", { unique: false });
          objectStore.createIndex("message", "message", { unique: false });
      }
  };
  
  dbRequest.onsuccess = function(event) {
      const db = event.target.result;
  
      // Fungsi untuk menyimpan data kontak
      const saveContact = (name, email, subject, message) => {
          const transaction = db.transaction(['contacts'], 'readwrite');
          const objectStore = transaction.objectStore('contacts');
          const contact = { name, email, subject, message };
  
          console.log('Saving contact:', contact); // Log data yang disimpan
  
          const request = objectStore.add(contact);
  
          request.onsuccess = function() {
              console.log('Data berhasil disimpan');
              alert("Message has been sent successfully!"); // Notifikasi saat data berhasil disimpan
              displayContacts(); // Menampilkan data setelah disimpan
          };
  
          request.onerror = function(event) {
              console.error('Error saving data:', event.target.error);
              alert('Failed to save message. Please try again.'); // Notifikasi jika gagal disimpan
          };
  
          transaction.oncomplete = function() {
              console.log('Transaction completed');
          };
  
          transaction.onerror = function(event) {
              console.error('Transaction error:', event.target.error);
              alert('Transaction error occurred.'); // Notifikasi jika transaksi gagal
          };
      };
  
      // Fungsi untuk menampilkan semua kontak
      const displayContacts = () => {
          const transaction = db.transaction(['contacts'], 'readonly');
          const objectStore = transaction.objectStore('contacts');
          const request = objectStore.getAll();
  
          request.onsuccess = function(event) {
              const contacts = event.target.result;
              console.log('Contacts:', contacts);
              // Anda dapat menampilkan data di halaman di sini
          };
      };
  
      // Event listener untuk tombol "Send Message"
      document.getElementById('contact-form').addEventListener('submit', function(event) {
          event.preventDefault(); // Mencegah form submit secara default
  
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          const subject = document.getElementById('subject').value;
          const message = document.getElementById('message').value;
  
          // Pastikan semua field diisi
          if (name && email && subject && message) {
              console.log("Submitting form data:", { name, email, subject, message }); // Log untuk cek submit
              saveContact(name, email, subject, message);
              this.reset(); // Kosongkan form setelah pengiriman
          } else {
              alert('Please fill out all fields.');
          }
      });
  };
  
  dbRequest.onerror = function(event) {
      console.error('Database error:', event.target.error);
      alert('Database error. Please refresh the page and try again.'); // Notifikasi jika database error
  };
  
   dbRequest.onerror = function(event) {
       console.error('Database error:', event.target.error);
   };
  
        // Fungsi untuk meminta izin notifikasi
  function requestNotificationPermission() {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
          showNotification('Notifikasi', 'Hello! You are viewing Silky Portfolio');
        } else {
          console.log('Notifikasi tidak diizinkan');
        }
      });
    } else if (Notification.permission === 'granted') {
      // Jika izin sudah diberikan sebelumnya, langsung tampilkan notifikasi
      showNotification('Notifikasi', 'Hello! You are viewing Silky Portfolio');
    }
  }
  
  
  
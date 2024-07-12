    // Sidebar
    function toggleSidebar() {
      var sidebar = document.getElementById('sidebar');
      var menuIcon = document.getElementById('menu-icon');
      var closeIcon = document.getElementById('close-icon');
    
      sidebar.classList.toggle('show');
      menuIcon.classList.toggle('hidden');
      closeIcon.classList.toggle('hidden');
    }
   
    // Chatbox
    // Variabel untuk menyimpan status dropdown chat
var isChatDropdownOpen = false;

// Chat Dropdown
function toggleChatDropdown() {
  var chatDropdown = document.getElementById('chat-dropdown');

  if (isChatDropdownOpen) {
    chatDropdown.classList.remove('show');
  } else {
    chatDropdown.classList.add('show');
  }

  // Mengubah status dropdown chat
  isChatDropdownOpen = !isChatDropdownOpen;
}

// Menutup dropdown chat saat klik dilakukan di luar dropdown
document.addEventListener('click', function(event) {
  var chatDropdown = document.getElementById('chat-dropdown');

  if (isChatDropdownOpen && !chatDropdown.contains(event.target)) {
    chatDropdown.classList.remove('show');
    isChatDropdownOpen = false;
  }
});

    // Dark Mode
    function toggleDarkMode() {
      var body = document.body;
      var navbar = document.querySelector('.navbar');
      var infoBoxes = document.querySelectorAll('.info-box');
      var sidebar = document.querySelector('.sidebar');

      body.classList.toggle('dark-mode');
      navbar.classList.toggle('dark-mode');
      infoBoxes.forEach(function (box) {
        box.classList.toggle('dark-mode');
      });
      sidebar.classList.toggle('dark-mode');
    }

    // Notification Dropdown
  // Variabel untuk menyimpan status dropdown
var isNotificationDropdownOpen = false;

// Notification Dropdown
// Variabel untuk menyimpan status dropdown
var isNotificationDropdownOpen = false;

// Notification Dropdown
function toggleNotificationDropdown(event) {
  var notificationDropdown = document.getElementById('notification-dropdown');

  if (isNotificationDropdownOpen) {
    notificationDropdown.classList.remove('show');
  } else {
    notificationDropdown.classList.add('show');
  }

  // Mengubah status dropdown
  isNotificationDropdownOpen = !isNotificationDropdownOpen;

  // Menghentikan propagasi event agar tidak menutup dropdown saat di dalam dropdown diklik
  event.stopPropagation();
}

// Menutup dropdown saat klik dilakukan di luar dropdown
document.addEventListener('click', function(event) {
  var notificationDropdown = document.getElementById('notification-dropdown');

  if (isNotificationDropdownOpen && !notificationDropdown.contains(event.target)) {
    notificationDropdown.classList.remove('show');
    isNotificationDropdownOpen = false;
  }
});

   // total request cuy
        // Pada sisi klien (JavaScript pada halaman HTML)
fetch('/akses')
  .then(response => response.json())
  .then(data => {
    // Memanipulasi elemen dengan ID 'requestCount'
    const requestCountElement = document.getElementById('requestCount');
    const requestTotal = data.request_total;
    const requestPerHari = data.request_perhari;
    
    // Menampilkan informasi total dan perhari
    requestCountElement.textContent = `Total: ${requestTotal}, Per Hari: ${requestPerHari}`;
  })
  .catch(error => {
    console.error('Terjadi kesalahan:', error);
  });
    
    
    // Get IP address using a public API (replace 'your-api-url' with the actual API endpoint)
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        document.getElementById('ip-address').textContent = data.ip;
      })
      .catch(error => console.error('Error fetching IP:', error));

    // Mendapatkan status baterai
    navigator.getBattery().then(function(battery) {
      // Memperbarui tampilan status baterai
      updateBatteryStatus(battery);
    
      // Memperbarui tampilan saat ada perubahan status baterai
      battery.addEventListener('levelchange', function() {
        updateBatteryStatus(battery);
      });
    
      battery.addEventListener('chargingchange', function() {
        updateBatteryStatus(battery);
      });
    });
    
    function updateBatteryStatus(battery) {
      // Mendapatkan level baterai dalam persentase
      const batteryLevel= Math.floor(battery.level * 100);

            // Mendapatkan status pengisian baterai
            const chargingStatus = battery.charging ? 'Charging' : 'Not Charging';

            // Memperbarui tampilan informasi baterai
            document.getElementById('battery-level').textContent = batteryLevel;
            document.getElementById('charging-status').textContent = chargingStatus;
    }

    // Current Time
    function updateTime() {
      const currentTime = new Date();
      const hours = currentTime.getHours().toString().padStart(2, '0');
      const minutes = currentTime.getMinutes().toString().padStart(2, '0');
      const seconds = currentTime.getSeconds().toString().padStart(2, '0');
      const timeString = hours + ':' + minutes + ':' + seconds;
      document.getElementById('current-time').textContent = timeString;
    }

    updateTime();
    setInterval(updateTime, 1000);
    
    // Mendapatkan waktu saat ini
        const date = new Date();
        const hours = date.getHours();

        // Menentukan sapaan berdasarkan waktu
        let greeting;
        if (hours >= 0 && hours < 6) {
            greeting = "Selamat dini hari!";
        } else if (hours >= 6 && hours < 12) {
            greeting = "Selamat pagi!";
        } else if (hours >= 12 && hours < 15) {
            greeting = "Selamat siang!";
        } else if (hours >= 15 && hours < 18) {
            greeting = "Selamat sore!";
        } else {
            greeting = "Selamat malam!";
        }

        // Menampilkan sapaan pada halaman web
        document.getElementById('greeting').textContent = greeting;
 
       fetch('/visitor')
  .then(response => response.json())
  .then(data => {
    const visitorCount = data.azzapi;
    document.getElementById('visitor-count').innerText = visitorCount;
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
 async function fetchRuntimeData() {
      try {
        const response = await fetch('/runtime');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Terjadi kesalahan saat mengambil data runtime:', error);
        return null;
      }
    }

    async function updateUptimeElement() {
      const runtimeData = await fetchRuntimeData();
      if (runtimeData) {
        const uptimeElement = document.getElementById('uptime');
        uptimeElement.innerHTML = `
          <p>${runtimeData.years} tahun, ${runtimeData.months} bulan, ${runtimeData.days} hari, ${runtimeData.hours} jam, ${runtimeData.minutes} menit, ${runtimeData.seconds} detik</p>
        `;
      }
    }

    updateUptimeElement(); //
    
 

        // Fungsi untuk mengambil penggunaan memori saat ini
        function getMemoryUsage() {
            // Mengambil informasi penggunaan memori dari server
            const memoryUsage = process.memoryUsage();

            // Mengonversi ukuran memori dari byte menjadi megabyte
            const memoryUsageMB = Math.round(memoryUsage.rss / 1024 / 1024);

            // Memperbarui tampilan penggunaan memori di halaman web
            document.getElementById('memory-usage').textContent = memoryUsageMB;
        }

        // Memanggil fungsi getMemoryUsage saat halaman selesai dimuat
        window.addEventListener('load', getMemoryUsage);
        
        const userAgent = navigator.userAgent;
        const vendor = navigator.vendor;
        const platform = navigator.platform;
        const language = navigator.language;
        const cookiesEnabled = navigator.cookieEnabled;

        // Memperbarui tampilan informasi di halaman web
        document.getElementById('user-agent').textContent = userAgent;
        document.getElementById('vendor').textContent = vendor;
        document.getElementById('platform').textContent = platform;
        document.getElementById('language').textContent = language;
        document.getElementById('cookies').textContent = cookiesEnabled ? 'Enabled' : 'Disabled';
        
        // Deteksi Platform dan Sistem Operasi
        const platformSpan = document.getElementById("platform");
        

        platformSpan.textContent = navigator.platform;
        

        // Spesifikasi Server (Contoh data palsu)
        const hostnameSpan = document.getElementById("hostname");
        const ramSpan = document.getElementById("ram");
        const cpuCoresSpan = document.getElementById("cpuCores");
        const screenResolutionSpan = document.getElementById("screenResolution");

        // Simulasi data spesifikasi server
        const serverSpecs = {
            hostname: "replit.com",
            ram: 3,
            cpuCores: 4,
            screenResolution: "1920x1080"
        };

        hostnameSpan.textContent = serverSpecs.hostname;
        ramSpan.textContent = serverSpecs.ram;
        cpuCoresSpan.textContent = serverSpecs.cpuCores;
        screenResolutionSpan.textContent = serverSpecs.screenResolution;
        
        // Pengukuran Kecepatan Server
        const serverSpeedSpan = document.getElementById("serverSpeed");
        const serverURL = "/"; // Ganti dengan URL server yang sesuai

        function measureServerSpeed() {
            const startTime = new Date().getTime(); // Waktu mulai mengirim request ke server

            fetch(serverURL)
                .then(response => {
                    const endTime = new Date().getTime(); // Waktu selesai menerima respons dari server
                    const serverSpeed = endTime - startTime; // Selisih waktu

                    serverSpeedSpan.textContent = `${serverSpeed} ms`;
                })
                .catch(error => {
                    serverSpeedSpan.textContent = "Gagal mengukur kecepatan server.";
                    console.error(error);
                });
        }

        // Memuat Server Load
        const serverLoadSpan = document.getElementById("serverLoad");
        const serverLoadURL = "/"; // Ganti dengan URL server load yang sesuai

        function loadServerLoad() {
            serverLoadSpan.textContent = "Memuat server load...";

            fetch(serverLoadURL)
                .then(response => response.json())
                .then(data => {
                    serverLoadSpan.textContent = `Server load: ${data.data.length} users`;
                })
                .catch(error => {
                    serverLoadSpan.textContent = "Gagal memuat server load.";
                    console.error(error);
                });
        }

        // Memperbarui pengukuran setiap 5 detik
        
        // Fungsi untuk mengambil kutipan acak dari API
    async function getRandomQuote() {
      try {
        const response = await fetch('https://api.akuari.my.id/randomtext/katabijak'); 
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    }

    // Fungsi untuk menampilkan kutipan ke dalam halaman
    async function displayRandomQuote() {
      const quoteContainer = document.getElementById('quote-container');
      const quoteText = document.getElementById('quote-text');
      const quoteAuthor = document.getElementById('quote-author');

      // Ambil kutipan acak dari API
      const quote = await getRandomQuote();

      // Periksa apakah ada kutipan dan penulisnya
      if (quote.hasil && quote.hasil.author) {
        quoteText.textContent = `"${quote.hasil.quotes}"`;
        quoteAuthor.textContent = `- ${quote.hasil.author}`;
        quoteContainer.style.display = 'block'; // Tampilkan kontainer kutipan
      } else {
        quoteContainer.style.display = 'none'; // Sembunyikan kontainer kutipan jika tidak ada data
      }

      // Setel waktu untuk mengganti kutipan setiap 60 detik (opsional)
      setTimeout(displayRandomQuote, 60000);
    }

    // Tampilkan kutipan pertama kali saat halaman dimuat
    displayRandomQuote();
        
        // Fungsi untuk menampilkan data request fitur di dashboard
    function tampilkanDashboard() {
  const dashboard = document.getElementById("dashboard");

  // Mengambil data request fitur dari server Express
  fetch('/getRequests')
    .then(response => response.json())
    .then(existingRequests => {
      // Jika tidak ada data, tampilkan pesan
      if (existingRequests.length === 0) {
        dashboard.innerHTML = "<p>Tidak ada request fitur yang dikirimkan.</p>";
        return;
      }

      // Menampilkan data request fitur di dashboard
      existingRequests.forEach((req, index) => {
        const card = document.createElement("div");
        card.innerHTML = `
          <h4>Request Ke #${index + 1}</h4>
          <p><strong>Nama:</strong> ${req.nama}</p>
          <p><strong>Pesan:</strong> ${req.pesan}</p>
          <p style="font-size: 12px;">${req.tanggal}/${req.bulan}/${req.tahun}</p>
          <hr />
        `;
        dashboard.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Terjadi kesalahan saat mengambil data request fitur:", error);
      dashboard.innerHTML = "<p>Terjadi kesalahan saat mengambil data request fitur.</p>";
    });
}

// Panggil fungsi tampilkanDashboard saat halaman dimuat
tampilkanDashboard();

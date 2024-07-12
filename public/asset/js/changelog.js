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

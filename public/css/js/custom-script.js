document.addEventListener('DOMContentLoaded', function () {

    // Hamburger Icon and Sidebar Toggle
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const sidebar = document.getElementById('sidebar');
    
    hamburgerIcon.addEventListener('click', function () {
        // Toggle the sidebar visibility when the hamburger icon is clicked
        sidebar.classList.toggle('active');
    });

    // Optionally, add a click event to close the sidebar when a link is clicked (for mobile view)
    const sidebarLinks = document.querySelectorAll('#sidebar .nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function () {
            sidebar.classList.remove('active');  // Close sidebar when a link is clicked
        });
    });

    // Optional: Add smooth scroll for better UX (for anchor links)
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // 載入 navbar
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            const navbar = document.getElementById('navbar');
            if (navbar) navbar.innerHTML = data;
        });
    // 載入 footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            const footer = document.getElementById('footer');
            if (footer) footer.innerHTML = data;
        });
}); 
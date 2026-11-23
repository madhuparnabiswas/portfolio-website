(function () {
    try {
        const savedTheme = localStorage.getItem('mb-portfolio-theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    } catch (e) {
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();
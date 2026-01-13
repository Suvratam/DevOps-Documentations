/**
 * Theme Management
 * Handles dark/light theme toggle with localStorage persistence
 */

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Icons for theme toggle
    const sunIcon = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 15a5 5 0 100-10 5 5 0 000 10zm0-2a3 3 0 110-6 3 3 0 010 6zm0-9a1 1 0 011 1v1a1 1 0 11-2 0V5a1 1 0 011-1zm0 12a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4 10a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm10 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-8.707 5.293a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zm10-10a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zm-10 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 011.414-1.414zm10 10l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 011.414-1.414z"/>
        </svg>
    `;
    
    const moonIcon = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
        </svg>
    `;

    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', currentTheme);
    updateIcon(currentTheme);

    // Theme toggle handler
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
        
        // Add transition effect
        html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            html.style.transition = '';
        }, 300);
    });

    // Update icon based on theme
    function updateIcon(theme) {
        if (theme === 'dark') {
            themeToggle.innerHTML = sunIcon;
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
        } else {
            themeToggle.innerHTML = moonIcon;
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        }
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            updateIcon(newTheme);
        }
    });

    // Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            themeToggle.click();
        }
    });

    // Add visual feedback on theme change
    function showThemeNotification(theme) {
        const notification = document.createElement('div');
        notification.textContent = `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme activated`;
        notification.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--card-bg);
            color: var(--text-primary);
            padding: 12px 24px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        
        document.body.appendChild(notification);
        
        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Fade out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // Enhanced theme toggle with notification
    const originalToggleHandler = themeToggle.onclick;
    themeToggle.onclick = function(e) {
        if (originalToggleHandler) originalToggleHandler.call(this, e);
        const theme = html.getAttribute('data-theme');
        showThemeNotification(theme);
    };
});
/**
 * Sidebar Navigation Management
 * Handles collapsible navigation groups and mobile sidebar toggle
 */

// Toggle navigation group expand/collapse
function toggleGroup(button) {
    const content = button.nextElementSibling;
    const isActive = button.classList.contains('active');
    
    if (isActive) {
        button.classList.remove('active');
        content.classList.remove('show');
    } else {
        button.classList.add('active');
        content.classList.add('show');
    }
}

// Mobile sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create mobile toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'sidebar-toggle';
    toggleButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
    `;
    toggleButton.setAttribute('aria-label', 'Toggle navigation menu');
    document.body.appendChild(toggleButton);

    const sidebar = document.getElementById('sidebar');

    // Toggle sidebar on button click
    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('show');
        
        // Update button icon based on state
        if (sidebar.classList.contains('show')) {
            this.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            `;
        } else {
            this.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
            `;
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) return;

        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = toggleButton.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
            toggleButton.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
            `;
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('show');
                toggleButton.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                    </svg>
                `;
            }
        }, 250);
    });

    // Active link highlighting
    const currentPath = window.location.pathname;
    const navItems = sidebar.querySelectorAll('.nav-item, .nav-subitem');
    
    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPath) {
            item.classList.add('active');
            
            // If it's a subitem, expand its parent group
            if (item.classList.contains('nav-subitem')) {
                const parentGroup = item.closest('.nav-group');
                if (parentGroup) {
                    const header = parentGroup.querySelector('.nav-group-header');
                    const content = parentGroup.querySelector('.nav-group-content');
                    if (header && content) {
                        header.classList.add('active');
                        content.classList.add('show');
                    }
                }
            }
        }
    });

    // Smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Keyboard navigation support
    sidebar.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && window.innerWidth <= 768 && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
            toggleButton.focus();
        }
    });
});
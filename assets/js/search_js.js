/**
 * Search Functionality
 * Implements client-side search with debouncing and results display
 */

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const sidebar = document.getElementById('sidebar');
    let searchTimeout;

    // Sample search data - replace with actual content
    const searchData = [
        { title: 'Get Docker', url: '#', category: 'Get Started' },
        { title: 'What is Docker?', url: '#', category: 'Get Started' },
        { title: 'Docker Desktop', url: '#', category: 'Introduction' },
        { title: 'Develop with containers', url: '#', category: 'Introduction' },
        { title: 'Build and push your first image', url: '#', category: 'Introduction' },
        { title: 'Docker concepts', url: '#', category: 'Concepts' },
        { title: 'Docker workshop', url: '#', category: 'Workshop' },
        { title: 'Running containers', url: '#', category: 'Concepts' },
        { title: 'Building images', url: '#', category: 'Concepts' },
        { title: 'Educational resources', url: '#', category: 'Resources' }
    ];

    // Create search results container
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.style.cssText = `
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        background-color: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        box-shadow: var(--shadow);
        max-height: 400px;
        overflow-y: auto;
        display: none;
        z-index: 1001;
    `;

    const searchContainer = document.querySelector('.search-container');
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(searchResults);

    // Search input handler with debouncing
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim().toLowerCase();

        if (query.length === 0) {
            hideResults();
            return;
        }

        // Debounce search
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    // Perform search and display results
    function performSearch(query) {
        const results = searchData.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.category.toLowerCase().includes(query)
        );

        displayResults(results, query);
    }

    // Display search results
    function displayResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div style="padding: 16px; color: var(--text-secondary); text-align: center;">
                    No results found for "${query}"
                </div>
            `;
            searchResults.style.display = 'block';
            return;
        }

        const resultsHTML = results.map(item => `
            <a href="${item.url}" class="search-result-item" style="
                display: flex;
                flex-direction: column;
                padding: 12px 16px;
                border-bottom: 1px solid var(--border-color);
                text-decoration: none;
                transition: background-color 0.2s;
            ">
                <span style="color: var(--text-primary); font-weight: 500; font-size: 14px;">
                    ${highlightQuery(item.title, query)}
                </span>
                <span style="color: var(--text-secondary); font-size: 12px; margin-top: 4px;">
                    ${item.category}
                </span>
            </a>
        `).join('');

        searchResults.innerHTML = resultsHTML;
        searchResults.style.display = 'block';

        // Add hover effects
        const resultItems = searchResults.querySelectorAll('.search-result-item');
        resultItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'var(--hover-bg)';
            });
            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
        });
    }

    // Highlight search query in results
    function highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background-color: var(--primary-blue); color: white; padding: 2px 4px; border-radius: 3px;">$1</mark>');
    }

    // Hide search results
    function hideResults() {
        searchResults.style.display = 'none';
    }

    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            hideResults();
        }
    });

    // Keyboard navigation for search results
    searchInput.addEventListener('keydown', function(e) {
        const items = searchResults.querySelectorAll('.search-result-item');
        let currentIndex = -1;

        items.forEach((item, index) => {
            if (item.classList.contains('keyboard-focus')) {
                currentIndex = index;
            }
        });

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentIndex < items.length - 1) {
                items.forEach(item => item.classList.remove('keyboard-focus'));
                items[currentIndex + 1].classList.add('keyboard-focus');
                items[currentIndex + 1].focus();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                items.forEach(item => item.classList.remove('keyboard-focus'));
                items[currentIndex - 1].classList.add('keyboard-focus');
                items[currentIndex - 1].focus();
            }
        } else if (e.key === 'Enter' && currentIndex >= 0) {
            items[currentIndex].click();
        } else if (e.key === 'Escape') {
            hideResults();
            searchInput.blur();
        }
    });

    // Add keyboard focus styles
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-focus {
            outline: 2px solid var(--primary-blue);
            outline-offset: -2px;
        }
    `;
    document.head.appendChild(style);
});
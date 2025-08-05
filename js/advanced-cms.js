/**
 * Advanced CMS Features
 * Enhanced content management with search, filtering, and dynamic loading
 */

class AdvancedCMS {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentPage = 1;
        this.articlesPerPage = 6;
        this.searchQuery = '';
        this.activeFilters = {
            category: 'all',
            dateRange: 'all',
            author: 'all'
        };
        this.sortBy = 'date-desc';
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        await this.loadArticles();
        this.setupEventListeners();
        this.renderArticles();
        this.setupInfiniteScroll();
    }

    async loadArticles() {
        try {
            this.showLoading(true);
            
            // Load manifest first
            const manifestResponse = await fetch('/content/research/manifest.json');
            const manifest = await manifestResponse.json();
            
            // Load all articles
            const articlePromises = manifest.files.map(async (filename) => {
                const response = await fetch(`/content/research/${filename}`);
                const content = await response.text();
                return this.parseMarkdown(content, filename);
            });
            
            this.articles = await Promise.all(articlePromises);
            this.filteredArticles = [...this.articles];
            
            console.log(`✅ Loaded ${this.articles.length} articles`);
            
        } catch (error) {
            console.error('❌ Error loading articles:', error);
            this.showError('Failed to load articles. Please try again later.');
        } finally {
            this.showLoading(false);
        }
    }

    parseMarkdown(content, filename) {
        const lines = content.split('\n');
        const frontMatter = {};
        let contentStart = 0;
        
        // Parse front matter
        if (lines[0] === '---') {
            for (let i = 1; i < lines.length; i++) {
                if (lines[i] === '---') {
                    contentStart = i + 1;
                    break;
                }
                const [key, ...valueParts] = lines[i].split(':');
                if (key && valueParts.length > 0) {
                    frontMatter[key.trim()] = valueParts.join(':').trim().replace(/['"]/g, '');
                }
            }
        }
        
        // Extract content
        const bodyContent = lines.slice(contentStart).join('\n').trim();
        const excerpt = this.generateExcerpt(bodyContent);
        
        return {
            id: filename.replace('.md', ''),
            filename,
            title: frontMatter.title || 'Untitled',
            date: frontMatter.date || new Date().toISOString().split('T')[0],
            category: frontMatter.category || 'Research',
            author: frontMatter.author || 'Financial Brunch Team',
            excerpt: frontMatter.excerpt || excerpt,
            tags: frontMatter.tags ? frontMatter.tags.split(',').map(tag => tag.trim()) : [],
            readTime: this.calculateReadTime(bodyContent),
            content: bodyContent,
            featured: frontMatter.featured === 'true',
            published: frontMatter.published !== 'false'
        };
    }

    generateExcerpt(content, maxLength = 200) {
        const plainText = content.replace(/[#*`]/g, '').replace(/\n+/g, ' ').trim();
        return plainText.length > maxLength 
            ? plainText.substring(0, maxLength) + '...'
            : plainText;
    }

    calculateReadTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return readTime;
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('article-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.applyFilters();
            }, 300));
        }

        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.activeFilters.category = e.target.value;
                this.applyFilters();
            });
        }

        // Date range filter
        const dateFilter = document.getElementById('date-filter');
        if (dateFilter) {
            dateFilter.addEventListener('change', (e) => {
                this.activeFilters.dateRange = e.target.value;
                this.applyFilters();
            });
        }

        // Sort options
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.applyFilters();
            });
        }

        // Clear filters
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // View toggle (grid/list)
        const viewToggle = document.querySelectorAll('.view-toggle');
        viewToggle.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.toggleView(view);
            });
        });
    }

    applyFilters() {
        let filtered = [...this.articles];

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(article => 
                article.title.toLowerCase().includes(this.searchQuery) ||
                article.excerpt.toLowerCase().includes(this.searchQuery) ||
                article.tags.some(tag => tag.toLowerCase().includes(this.searchQuery))
            );
        }

        // Apply category filter
        if (this.activeFilters.category !== 'all') {
            filtered = filtered.filter(article => 
                article.category.toLowerCase() === this.activeFilters.category.toLowerCase()
            );
        }

        // Apply date range filter
        if (this.activeFilters.dateRange !== 'all') {
            const now = new Date();
            const filterDate = new Date();
            
            switch (this.activeFilters.dateRange) {
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
                case 'quarter':
                    filterDate.setMonth(now.getMonth() - 3);
                    break;
                case 'year':
                    filterDate.setFullYear(now.getFullYear() - 1);
                    break;
            }
            
            if (this.activeFilters.dateRange !== 'all') {
                filtered = filtered.filter(article => 
                    new Date(article.date) >= filterDate
                );
            }
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.sortBy) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });

        this.filteredArticles = filtered;
        this.currentPage = 1;
        this.renderArticles();
        this.updateFilterStats();
    }

    renderArticles() {
        const container = document.getElementById('articles-container');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const articlesToShow = this.filteredArticles.slice(0, endIndex);

        if (articlesToShow.length === 0) {
            container.innerHTML = this.renderEmptyState();
            return;
        }

        const articlesHTML = articlesToShow.map(article => this.renderArticleCard(article)).join('');
        container.innerHTML = articlesHTML;

        // Setup article interactions
        this.setupArticleInteractions();
        
        // Update pagination
        this.updatePagination();
    }

    renderArticleCard(article) {
        const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <article class="research-card" data-article-id="${article.id}">
                <div class="research-card-header">
                    <div class="research-meta">
                        <span class="research-category">${article.category}</span>
                        <span class="research-date">${formattedDate}</span>
                        <span class="research-read-time">${article.readTime} min read</span>
                    </div>
                    ${article.featured ? '<span class="featured-badge">Featured</span>' : ''}
                </div>
                
                <div class="research-card-content">
                    <h3 class="research-title">${article.title}</h3>
                    <p class="research-excerpt">${article.excerpt}</p>
                    
                    <div class="research-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                
                <div class="research-card-footer">
                    <div class="research-author">
                        <span class="author-name">${article.author}</span>
                    </div>
                    <div class="research-actions">
                        <button class="btn-preview" data-article-id="${article.id}">
                            Quick Preview
                        </button>
                        <button class="btn-read" data-article-id="${article.id}">
                            Read Full Article
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    renderEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📄</div>
                <h3>No articles found</h3>
                <p>Try adjusting your search terms or filters to find what you're looking for.</p>
                <button class="btn btn-primary" id="clear-filters">Clear All Filters</button>
            </div>
        `;
    }

    setupArticleInteractions() {
        // Preview buttons
        document.querySelectorAll('.btn-preview').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const articleId = e.target.dataset.articleId;
                this.showArticlePreview(articleId);
            });
        });

        // Read buttons
        document.querySelectorAll('.btn-read').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const articleId = e.target.dataset.articleId;
                this.openFullArticle(articleId);
            });
        });

        // Card click for preview
        document.querySelectorAll('.research-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.research-actions')) {
                    const articleId = card.dataset.articleId;
                    this.showArticlePreview(articleId);
                }
            });
        });
    }

    showArticlePreview(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (!article) return;

        const modal = this.createPreviewModal(article);
        document.body.appendChild(modal);
        
        // Animate in
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Setup close handlers
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal(modal);
        });
        
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            this.closeModal(modal);
        });
        
        // Escape key handler
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    createPreviewModal(article) {
        const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const modal = document.createElement('div');
        modal.className = 'article-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                
                <div class="modal-header">
                    <div class="modal-meta">
                        <span class="modal-category">${article.category}</span>
                        <span class="modal-date">${formattedDate}</span>
                        <span class="modal-read-time">${article.readTime} min read</span>
                    </div>
                    <h2 class="modal-title">${article.title}</h2>
                    <p class="modal-author">By ${article.author}</p>
                </div>
                
                <div class="modal-body">
                    <div class="modal-excerpt">
                        ${article.excerpt}
                    </div>
                    
                    <div class="modal-preview">
                        ${this.renderMarkdownPreview(article.content)}
                    </div>
                    
                    <div class="modal-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="window.open('/research/${article.id}', '_blank')">
                        Read Full Article
                    </button>
                    <button class="btn btn-secondary modal-close">
                        Close Preview
                    </button>
                </div>
            </div>
        `;

        return modal;
    }

    renderMarkdownPreview(content) {
        // Simple markdown to HTML conversion for preview
        return content
            .split('\n')
            .slice(0, 10) // Show first 10 lines
            .map(line => {
                if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
                if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
                if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
                if (line.trim() === '') return '<br>';
                return `<p>${line}</p>`;
            })
            .join('') + '<p class="preview-truncated">... <em>Preview truncated. Read full article for complete content.</em></p>';
    }

    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    openFullArticle(articleId) {
        // This would typically navigate to a full article page
        // For now, we'll open in a new window or show in modal
        window.open(`/research/${articleId}`, '_blank');
    }

    setupInfiniteScroll() {
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }

        // Auto-load on scroll
        window.addEventListener('scroll', this.debounce(() => {
            if (this.shouldLoadMore()) {
                this.loadMoreArticles();
            }
        }, 200));
    }

    shouldLoadMore() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.offsetHeight;
        const threshold = 200; // Load when 200px from bottom
        
        return scrollPosition >= documentHeight - threshold && 
               !this.isLoading && 
               this.hasMoreArticles();
    }

    hasMoreArticles() {
        const currentlyShown = this.currentPage * this.articlesPerPage;
        return currentlyShown < this.filteredArticles.length;
    }

    loadMoreArticles() {
        if (this.isLoading || !this.hasMoreArticles()) return;
        
        this.isLoading = true;
        this.currentPage++;
        
        // Simulate loading delay
        setTimeout(() => {
            this.renderArticles();
            this.isLoading = false;
        }, 500);
    }

    updatePagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        const currentlyShown = Math.min(this.currentPage * this.articlesPerPage, this.filteredArticles.length);
        
        paginationContainer.innerHTML = `
            <div class="pagination-info">
                Showing ${currentlyShown} of ${this.filteredArticles.length} articles
            </div>
            ${this.hasMoreArticles() ? `
                <button class="btn btn-secondary" id="load-more">
                    Load More Articles
                </button>
            ` : ''}
        `;
    }

    updateFilterStats() {
        const statsContainer = document.getElementById('filter-stats');
        if (statsContainer) {
            const total = this.articles.length;
            const filtered = this.filteredArticles.length;
            
            statsContainer.innerHTML = `
                <span class="filter-count">${filtered} of ${total} articles</span>
                ${filtered !== total ? `
                    <button class="btn-link" id="clear-filters">Clear filters</button>
                ` : ''}
            `;
        }
    }

    clearAllFilters() {
        this.searchQuery = '';
        this.activeFilters = {
            category: 'all',
            dateRange: 'all',
            author: 'all'
        };
        this.sortBy = 'date-desc';
        
        // Reset form elements
        const searchInput = document.getElementById('article-search');
        if (searchInput) searchInput.value = '';
        
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) categoryFilter.value = 'all';
        
        const dateFilter = document.getElementById('date-filter');
        if (dateFilter) dateFilter.value = 'all';
        
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) sortSelect.value = 'date-desc';
        
        this.applyFilters();
    }

    toggleView(view) {
        const container = document.getElementById('articles-container');
        if (container) {
            container.className = `articles-${view}`;
        }
        
        // Update active button
        document.querySelectorAll('.view-toggle').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
    }

    showLoading(show) {
        const loader = document.getElementById('articles-loader');
        if (loader) {
            loader.style.display = show ? 'block' : 'none';
        }
    }

    showError(message) {
        const errorContainer = document.getElementById('articles-error');
        if (errorContainer) {
            errorContainer.innerHTML = `
                <div class="error-message">
                    <span class="error-icon">⚠️</span>
                    <span class="error-text">${message}</span>
                    <button class="btn btn-secondary" onclick="location.reload()">
                        Retry
                    </button>
                </div>
            `;
            errorContainer.style.display = 'block';
        }
    }

    // Utility function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Public API
    getArticles() {
        return this.articles;
    }

    getFilteredArticles() {
        return this.filteredArticles;
    }

    searchArticles(query) {
        this.searchQuery = query.toLowerCase();
        this.applyFilters();
    }

    filterByCategory(category) {
        this.activeFilters.category = category;
        this.applyFilters();
    }

    refresh() {
        this.loadArticles();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('articles-container')) {
        window.advancedCMS = new AdvancedCMS();
    }
});

// Export for external use
window.AdvancedCMS = AdvancedCMS;
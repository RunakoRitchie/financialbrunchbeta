# Financial Brunch Website

A modern, responsive financial research website with a comprehensive Content Management System (CMS).

## 🚀 Features

- **Responsive Design**: Modern, mobile-first design with smooth animations
- **Multi-language Support**: English and Indonesian language support
- **Dynamic Content Management**: CMS system for easy content updates
- **Interactive Carousel**: Featured research articles with smooth transitions
- **Newsletter Integration**: Email subscription functionality
- **Accessibility**: WCAG compliant with keyboard navigation support

## 📁 Project Structure

```
financialbrunchbeta/
├── index.html              # Main website file
├── css/
│   └── styles.css          # All styling and responsive design
├── js/
│   └── main.js            # JavaScript functionality
├── content/
│   └── cms-content.json   # CMS content file
├── images/                 # Image assets (empty)
├── package.json           # Dependencies
└── README.md             # This file
```

## 🎯 CMS System

The website includes a comprehensive Content Management System that allows for easy content updates without touching the code.

### How the CMS Works

1. **Data Attributes**: HTML elements use `data-cms` attributes to identify content
2. **JSON Content**: Content is stored in `content/cms-content.json`
3. **Dynamic Rendering**: JavaScript loads and renders content dynamically
4. **Language Support**: Full bilingual support (EN/ID)

### CMS Content Structure

```json
{
  "en": {
    "hero": {
      "title": "Independent Financial Research",
      "subtitle": "Comprehensive analysis...",
      "subscribeBtn": "Subscribe to Research",
      "browseBtn": "Browse Reports"
    },
    "featured": {
      "title": "Featured Research",
      "subtitle": "Latest insights...",
      "articles": [
        {
          "title": "Article Title",
          "excerpt": "Article excerpt...",
          "category": "Category",
          "date": "2024-07-28",
          "slug": "article-slug"
        }
      ]
    }
  },
  "id": {
    // Indonesian translations
  }
}
```

### Adding Content

1. **Update JSON File**: Edit `content/cms-content.json`
2. **Add New Articles**: Add to the `articles` array in the featured section
3. **Update Text**: Modify any text content in the JSON structure
4. **Language Support**: Add translations for both English and Indonesian

### CMS Features

- ✅ **Dynamic Content Loading**: Content loads from JSON file
- ✅ **Fallback System**: Built-in content if external file fails
- ✅ **Language Switching**: Real-time language switching
- ✅ **Carousel Management**: Dynamic article carousel
- ✅ **Feature Cards**: Dynamic feature section
- ✅ **Footer Links**: Dynamic footer navigation
- ✅ **Error Handling**: Graceful fallbacks and error handling

## 🛠️ Development

### Prerequisites

- Node.js (for dependencies)
- Modern web browser

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd financialbrunchbeta
   npm install
   ```

### Running Locally

```bash
# Using Python (recommended)
python3 -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Visit `http://localhost:8000` to view the website.

## 📝 Content Management

### Updating Articles

1. Open `content/cms-content.json`
2. Find the `featured.articles` section
3. Add or modify articles:

```json
{
  "title": "New Article Title",
  "excerpt": "Article description...",
  "category": "Category Name",
  "date": "2024-08-15",
  "slug": "new-article-slug"
}
```

### Adding New Languages

1. Add a new language key to the JSON structure
2. Provide translations for all content sections
3. Update the language toggle buttons in `index.html`

### Customizing Features

1. Modify the `features.items` array in the JSON
2. Add new feature cards with:
   - `title`: Feature title
   - `description`: Feature description
   - `icon`: Icon name (star, cube, zap)

## 🎨 Customization

### Styling

- **CSS Variables**: All colors and spacing in `:root`
- **Responsive Breakpoints**: Mobile-first design
- **Modern Animations**: Smooth transitions and hover effects

### JavaScript Features

- **Navigation**: Mobile menu and smooth scrolling
- **Carousel**: Auto-playing with touch/swipe support
- **Language Toggle**: Real-time content switching
- **Form Handling**: Newsletter subscription with validation
- **Accessibility**: Keyboard navigation and ARIA labels

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- **WCAG 2.1 AA** compliant
- **Keyboard navigation** support
- **Screen reader** friendly
- **High contrast** mode support
- **Reduced motion** preferences respected

## 🚀 Deployment

### GitHub Pages

1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main`)

### Netlify

1. Connect GitHub repository to Netlify
2. Build command: `npm install` (if needed)
3. Publish directory: `financialbrunchbeta`

### Vercel

1. Import GitHub repository to Vercel
2. Framework preset: Other
3. Deploy automatically

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please contact the development team.

---

**Financial Brunch** - Independent financial research for informed investment decisions. 
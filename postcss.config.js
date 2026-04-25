/**
 * PostCSS Configuration - Community Bridge Network
 * This file handles the transformation of Tailwind CSS 
 * and ensures cross-browser compatibility using Autoprefixer.
 */

export default {
  plugins: {
    // Processes the @tailwind directives in your index.css
    tailwindcss: {},
    
    // Automatically adds -webkit and -moz prefixes to your CSS
    // ensuring your "glass-panel" effects work on iPhones and older Androids.
    autoprefixer: {},
    
    // CSE Tip: In a production environment, we could add 'cssnano' 
    // here to minify the final file for faster field performance.
  },
};
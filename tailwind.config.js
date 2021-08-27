module.exports = {
  purge: {
    enabled: false,
    content: ['src/**/*.js', 'src/**/*.jsx', 'public/**/*.html'],
    options: {
      safelist: [
        '*',
        // /.*^(border|bg|text|ring).*/,
        // /.*^(focus:border|hover:bg|focus:bg|hover:text|focus:ring).*/,
      ],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

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
    extend: {
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(50%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fade: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        'slide-up': 'slide-up .5s cubic-bezier(0, 1, 0, 1)',
        'slide-down': 'slide-down .5s cubic-bezier(0, 1, 0, 1)',
        fade: 'fade .5s cubic-bezier(0, 1, 0, 1)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

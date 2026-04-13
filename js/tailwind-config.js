tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E6DA4',
          light: '#3d82c2',
          dark: '#1e4b75',
        },
        secondary: {
          DEFAULT: '#E07B2A',
          light: '#eb9046',
          dark: '#c76214',
        },
        background: '#F4F6F9',
        surface: '#FFFFFF',
        text: '#333333',
        gray: {
          100: '#F4F6F9',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      borderRadius: {
        'card': '8px',
        'btn': '24px',
      },
      fontSize: {
        'body': '16px',
        'secondary': '14px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    }
  }
}

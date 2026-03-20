/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  corePlugins: {
    preflight: true, // keep this
  },
  theme: {
    extend: {
      colors: {
        // Force-enable the palettes you use
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        indigo: {
          600: '#4f46e5',
          700: '#4338ca',
        },
        purple: {
          600: '#7c3aed',
          700: '#6d28d9',
        },
        blue: {
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        red: {
          50: '#fef2f2',
          500: '#ef4444',
          700: '#b91c1c',
        },
      },
    },
  },
  plugins: [],
}

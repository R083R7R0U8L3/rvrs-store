const config = {

content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        // Aquí defines tus colores corporativos
        brand: {
          black: "#1a1a1a",
          white: "#ffffff",
          accent: "#ff4d00", // Un naranja vibrante, por ejemplo
          gray: "#f5f5f5",
        },
      },
    },
  },
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

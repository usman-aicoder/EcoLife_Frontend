# Ecolife Frontend

Frontend application for Ecolife built with React, TypeScript, and Vite.

## Design Reference

This project is based on the Eco Life Landing Page Design available at:
https://www.figma.com/design/hm7CgjYKnNnEZbRrkEbC5y/Eco-Life-Landing-Page-Design

## Prerequisites

- Node.js (v20.x or higher)
- npm (v10.x or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Ecolife_Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)
- Other service configurations as needed

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Development

1. Start the development server:
```bash
npm run dev
```

2. Open your browser at `http://localhost:5173`

3. Make changes and see them reflected in real-time

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
src/
├── components/     # React components
├── assets/         # Static assets (images, fonts, etc.)
├── styles/         # CSS/styling files
└── App.tsx         # Main App component
```

## Technologies

- React 18
- TypeScript
- Vite
- (Add other libraries as you use them)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting
4. Create a pull request

## License

ISC
# KML Viewer

A modern web application for viewing and analyzing KML (Keyhole Markup Language) files. This application provides an interactive map interface with real-time updates and detailed information about KML elements.

## Features

- 🗺️ Interactive map display using Leaflet
- 📊 Real-time KML file updates
- 📝 Detailed summary of KML elements
- 🎨 Beautiful and responsive UI
- 🔄 Automatic content updates
- 📱 Mobile-friendly design

## Tech Stack

- React.js
- Leaflet.js for map visualization
- TailwindCSS for styling
- @tmcw/togeojson for KML parsing
- React Icons for UI elements

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/SwapnilVG/KML-Viewer.git
cd kml-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
kml-viewer/
├── src/
│   ├── components/
│   │   ├── KMLMap.jsx        # Map visualization component
│   │   ├── KMLUploader.jsx   # File upload component
│   │   └── KMLSummary.jsx    # KML data summary component
│   ├── utils/
│   │   └── kmlParser.js      # KML parsing utilities
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── package.json
└── README.md
```

## Usage

1. Launch the application
2. Drag and drop a KML file or click to select one
3. The map will display the KML content
4. View detailed information about the KML elements
5. The map will automatically update if the KML file changes

## Features in Detail

### Map Display
- Interactive map with zoom and pan controls
- Different styles for points, lines, and polygons
- Popup information for each element
- Automatic bounds fitting

### KML Analysis
- Element count summary
- Length calculations for paths
- Perimeter calculations for polygons
- Real-time updates when file changes

### File Handling
- Drag and drop support
- File type validation
- Error handling
- Automatic content updates

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Adding New Features

1. Create new components in the `src/components` directory
2. Add new utilities in the `src/utils` directory
3. Update the main App component to include new features


## Acknowledgments

- [Leaflet.js](https://leafletjs.com/) for the map library
- [@tmcw/togeojson](https://github.com/tmcw/togeojson) for KML parsing
- [React Icons](https://react-icons.github.io/react-icons/) for the UI icons



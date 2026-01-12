# Garage Layout Editor

A comprehensive web-based application for designing parking garage layouts with device placement, configuration, and export capabilities.

## Features

### 🏗️ Three-Column Layout
- **Left Panel**: Level management and selection
- **Center Panel**: Interactive map canvas with device placement
- **Right Panel**: Contextual inspector for level and device settings

### 📍 Level Management
- Create and manage multiple parking levels
- Upload background images (floor plans)
- Rotate and adjust map orientation
- View level statistics

### 🎯 Device Types

#### Cameras
- **FLI Camera**: Flow Logic Imaging Camera
- **LPR Camera**: License Plate Recognition Camera
- Features:
  - Adjustable rotation with visual direction indicator
  - Flow rules with "back of car is IN/OUT" model
  - Multiple flow rules per camera
  - Level-specific delta calculations

#### Signs
- **Designable Sign**: HTML-rendered content with live preview
  - Preview URL field with embedded iframe preview
  - Override controls (OPEN / FULL / CLSD / AUTO)
- **Static Sign**: Fixed state display
  - Prominent current override state display
  - Override controls without preview

#### Sensors
- **Space Sensor**: Parking space occupancy detection
  - Serial address configuration
  - Parking type selection (Standard, Compact, Handicap, EV Charging, etc.)
  - Grouped by Garage Name and Level Name in exports

### 🎨 Interactive Canvas
- Drag-and-drop device placement
- Click-to-place mode for new devices
- Visual device icons (cameras with rotation, signs, sensors)
- Real-time device repositioning
- Device selection and highlighting

### 📤 Export Capabilities

#### PDF Export
- Multi-page PDF with one page per level
- Includes background images
- Lists all devices with names and positions
- Timestamp and documentation metadata

#### XML Export
Three configuration files:
1. **DevicesConfig.xml**: Camera and sign configurations with flow rules
2. **Configuration.xml**: Garage and level structure
3. **SpaceSensorsConfig.xml**: Sensor groupings by garage and level

#### Validation
- Pre-export validation of all configurations
- Checks for:
  - Unique device names
  - Required garage and level names
  - Complete flow rules
  - Serial addresses for sensors
  - Consistent join keys

### 🌓 Dark Mode
- Global dark mode toggle
- Preserves map and icon readability
- Affects all UI panels and modals
- Does not impact exported files

### 💾 Data Persistence
- Automatic localStorage saving
- Data persists between sessions
- Export/import capabilities

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation Steps

1. **Clone or download the repository**
   ```bash
   cd GarageLayoutEditor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   The application will automatically open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized production build will be created in the `build/` directory.

## Usage Guide

### Getting Started

1. **Create a Level**
   - Click "+ Add Level" in the left panel
   - Level is automatically selected and appears in the center

2. **Configure Level**
   - With no device selected, the right panel shows Level Settings
   - Set the level name
   - Upload a background image (floor plan)
   - Adjust rotation if needed

3. **Add Devices**
   - Click "+ Add Device" in the center panel
   - Select device category (Camera, Sign, or Sensor)
   - Choose specific device type
   - Click on the map to place the device

4. **Configure Devices**
   - Click on a placed device to select it
   - The right panel shows device-specific configuration
   - Set device name, garage name, and level name
   - Configure device-specific settings:
     - **Cameras**: Set rotation and flow rules
     - **Designable Signs**: Set preview URL and override state
     - **Static Signs**: Set override state
     - **Sensors**: Set serial address and parking type

5. **Adjust Device Position**
   - Drag devices on the map to reposition
   - Use rotation controls for cameras

6. **Export**
   - Click "Export" in the top-right corner
   - Choose PDF for layout documentation
   - Choose XML for configuration files
   - Validate before XML export to check for errors

### Tips

- **Multiple Levels**: Create separate levels for each floor of the garage
- **Flow Rules**: Define how vehicle movement affects parking counts across levels
- **Preview**: For Designable Signs, enter a preview URL to see real-time content
- **Validation**: Always validate before XML export to ensure data consistency
- **Dark Mode**: Use the toggle in the top-right for comfortable viewing

## Project Structure

```
GarageLayoutEditor/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AddDeviceModal.js
│   │   ├── CameraConfig.js
│   │   ├── DesignableSignConfig.js
│   │   ├── ExportModal.js
│   │   ├── InspectorPanel.js
│   │   ├── LevelPanel.js
│   │   ├── LevelSettings.js
│   │   ├── MapCanvas.js
│   │   ├── SpaceSensorConfig.js
│   │   └── StaticSignConfig.js
│   ├── utils/
│   │   ├── exportPDF.js
│   │   └── exportXML.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## Technologies Used

- **React 18**: UI framework
- **Konva.js**: Interactive canvas for device placement
- **React-Konva**: React bindings for Konva
- **jsPDF**: PDF generation
- **CSS Variables**: Theme system with dark mode support
- **localStorage**: Client-side data persistence

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

Modern browsers with ES6+ support required.

## Known Limitations

- Background images must be loaded from file (no external URLs for CORS reasons)
- PDF export quality depends on background image resolution
- Large numbers of devices (>100 per level) may impact canvas performance

## Future Enhancements

Potential features for future versions:
- Undo/redo functionality
- Device grouping and layers
- Snap-to-grid placement
- Multi-device selection
- Export templates
- Cloud storage integration
- Collaborative editing

## Troubleshooting

**Application won't start**
- Ensure Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again

**Devices not appearing**
- Check that you've clicked on the map after selecting device type
- Verify the device is not placed outside the visible canvas area

**Export not working**
- Check browser console for errors
- Ensure popup blockers are disabled for downloads
- Validate configuration before XML export

**Background image not showing**
- Ensure image format is supported (PNG, JPG, JPEG)
- Check image file size (very large images may take time to load)

## License

This project is provided as-is for use in parking garage management systems.

## Support

For issues, questions, or contributions, please refer to the project repository.

---

**Version**: 1.0.0
**Last Updated**: January 2026
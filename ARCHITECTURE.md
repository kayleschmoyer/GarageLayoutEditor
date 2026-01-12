# Garage Layout Editor - Architecture Documentation

## Overview

The Garage Layout Editor is a React-based single-page application (SPA) that enables users to design parking garage layouts with an interactive canvas-based interface.

## Technology Stack

- **React 18.2.0** - UI framework with hooks-based state management
- **Konva.js 9.2.0** - HTML5 Canvas library for interactive graphics
- **React-Konva 18.2.10** - React bindings for Konva
- **jsPDF 2.5.1** - PDF generation library
- **use-image 1.1.1** - Hook for loading images in Konva
- **React Scripts 5.0.1** - Build tooling and dev server

## Application Architecture

### State Management

The application uses React's built-in state management (useState, useEffect) without external state libraries. The main application state is managed in `App.js` and passed down through props.

**Main State Structure:**
```javascript
{
  levels: [
    {
      id: string,
      name: string,
      backgroundImage: string (data URL),
      rotation: number (0-360),
      devices: [
        {
          id: string,
          type: string,
          x: number,
          y: number,
          rotation: number,
          // Device-specific fields...
        }
      ]
    }
  ],
  selectedLevelId: string,
  selectedDeviceId: string,
  darkMode: boolean
}
```

### Data Flow

```
User Action
    ↓
Event Handler (Component)
    ↓
State Update Function (App.js)
    ↓
State Change
    ↓
Re-render (React)
    ↓
UI Update
```

### Persistence

- **localStorage** is used for client-side persistence
- Data is automatically saved on every state change
- Data is loaded on application mount
- Export functions generate downloadable files

## File Structure & Responsibilities

### Core Application Files

**`src/App.js`** (280 lines)
- Main application container
- State management
- Top-level event handlers
- Layout orchestration
- LocalStorage integration

**`src/App.css`** (700+ lines)
- Complete styling system
- CSS variables for theming
- Dark mode support
- Responsive layouts
- Component styles

**`src/index.js`** (10 lines)
- React entry point
- Root rendering

### Components

#### Layout Components

**`src/components/LevelPanel.js`** (35 lines)
- Left panel component
- Level list display
- Level selection
- Add level button

**`src/components/MapCanvas.js`** (200 lines)
- Center canvas component
- Konva Stage and Layer management
- Device rendering (cameras, signs, sensors)
- Device interaction (click, drag)
- Placement mode handling
- Background image display

**`src/components/InspectorPanel.js`** (80 lines)
- Right panel component
- Conditional rendering based on selection
- Routes to appropriate config component

#### Configuration Components

**`src/components/LevelSettings.js`** (90 lines)
- Level name editing
- Background image upload
- Map rotation control
- Level statistics display

**`src/components/CameraConfig.js`** (150 lines)
- Camera device configuration
- Flow rules management
- Add/edit/delete flow rules
- Rotation control
- Garage/level assignment

**`src/components/DesignableSignConfig.js`** (90 lines)
- Designable sign configuration
- Preview URL input
- Live iframe preview
- Override state controls (OPEN/FULL/CLSD/AUTO)

**`src/components/StaticSignConfig.js`** (85 lines)
- Static sign configuration
- Current state display
- Override controls
- No preview functionality

**`src/components/SpaceSensorConfig.js`** (95 lines)
- Space sensor configuration
- Serial address input
- Parking type selection
- Position display (read-only)

#### Modal Components

**`src/components/AddDeviceModal.js`** (110 lines)
- Device selection modal
- Expandable categories
- Device type buttons
- Modal overlay and controls

**`src/components/ExportModal.js`** (130 lines)
- Export interface
- PDF export trigger
- XML export with validation
- Validation error display
- Export summary statistics

### Utility Modules

**`src/utils/exportPDF.js`** (70 lines)
- jsPDF integration
- Multi-page PDF generation
- Background image embedding
- Device label rendering
- Document formatting

**`src/utils/exportXML.js`** (200 lines)
- XML generation functions
- Validation logic
- Three export types:
  - DevicesConfig.xml
  - Configuration.xml
  - SpaceSensorsConfig.xml
- XML escaping
- File download handling

## Key Design Patterns

### Component Composition

Components are composed hierarchically with clear separation of concerns:
- Container components manage state
- Presentational components handle rendering
- Configuration components are device-specific

### Prop Drilling

State is managed at the top level and passed down through props. This approach was chosen for simplicity and clarity given the moderate application complexity.

### Conditional Rendering

Extensive use of conditional rendering to show appropriate UI based on:
- Selected level
- Selected device type
- Placement mode
- Dark mode

### Event Handling

Events bubble up through callback props:
```javascript
Component
  onUpdate={(id, updates) => ...}
    ↓
App.js
  updateLevel(id, updates)
    ↓
State Update
```

## Device Type System

### Device Types

1. **Cameras**
   - FLI Camera
   - LPR Camera
   - Common: rotation, flow rules, garage/level assignment

2. **Signs**
   - Designable Sign (with preview URL)
   - Static Sign (without preview)
   - Common: override states, garage/level assignment

3. **Sensors**
   - Space Sensor
   - Unique: serial address, parking type

### Device Lifecycle

1. **Creation** - `createDevice()` in App.js
2. **Placement** - Click on canvas in placement mode
3. **Selection** - Click on placed device
4. **Configuration** - Edit in inspector panel
5. **Repositioning** - Drag on canvas
6. **Deletion** - Delete button in config panel

## Canvas Architecture (Konva)

### Layer Structure

```
Stage (React-Konva)
  └─ Layer
      ├─ Background Image (if exists)
      └─ Devices (Groups)
          ├─ Camera Icon (Rect + Line)
          ├─ Sign Icon (Rect)
          ├─ Sensor Icon (Circle)
          └─ Label (Text)
```

### Device Icons

- **Camera**: Rectangle with direction line
- **Sign**: Yellow rectangle
- **Sensor**: Green circle
- Selection indicated by blue color

### Interactions

- **Click Stage**: Place device or deselect
- **Click Device**: Select device
- **Drag Device**: Update x/y position
- **Drag End**: Save new position

## Export Architecture

### PDF Export Flow

1. Create jsPDF instance
2. Iterate through levels
3. For each level:
   - Add page
   - Add level name
   - Add background image (if exists)
   - List devices with positions
   - Add timestamp
4. Save file

### XML Export Flow

1. **Validation Phase**
   - Check device names (unique)
   - Check garage/level names (present)
   - Check flow rules (complete)
   - Check sensor addresses (present)
   - Return error array

2. **Generation Phase**
   - Build XML strings
   - Escape special characters
   - Group by hierarchy
   - Format with indentation

3. **Download Phase**
   - Create Blob
   - Create object URL
   - Trigger download
   - Cleanup URL

## Styling System

### CSS Variables

Theme colors defined as CSS variables:
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
  /* ... */
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  /* ... */
}
```

### Dark Mode Implementation

1. Toggle button sets state
2. useEffect applies data-theme attribute
3. CSS variables automatically update colors
4. All components inherit theme

## Performance Considerations

### Optimization Strategies

1. **React Rendering**
   - Functional components with hooks
   - Minimal re-renders through proper state updates
   - Key props for list rendering

2. **Canvas Performance**
   - Konva handles canvas optimization
   - Device count limit: ~100 per level recommended
   - Image caching through use-image hook

3. **Data Persistence**
   - Debounced localStorage writes
   - Async image loading
   - Lazy modal rendering

### Potential Bottlenecks

- Large background images
- Many devices (>100) on single level
- Complex flow rule configurations

## Security Considerations

### Input Validation

- Device names validated on export
- XML special characters escaped
- File uploads restricted to images

### XSS Prevention

- React's built-in XSS protection
- Iframe sandbox for sign previews
- No dangerouslySetInnerHTML usage

### Data Storage

- Client-side only (localStorage)
- No server communication
- No sensitive data transmission

## Extension Points

### Adding New Device Types

1. Add device type to `createDevice()` in App.js
2. Create configuration component
3. Add to InspectorPanel routing
4. Create icon component in MapCanvas
5. Add to AddDeviceModal categories
6. Update export utilities if needed

### Adding New Export Formats

1. Create utility in `src/utils/`
2. Add export function
3. Add trigger in ExportModal
4. Handle file download

### Adding New Features

- Undo/Redo: Implement state history stack
- Layers: Add layer property to devices
- Snap-to-Grid: Add grid overlay and snapping logic
- Multi-select: Add selection array to state

## Testing Strategy

### Manual Testing Checklist

- [ ] Create/delete levels
- [ ] Upload/remove background images
- [ ] Add all device types
- [ ] Configure all device properties
- [ ] Drag devices
- [ ] Export PDF
- [ ] Export XML with validation
- [ ] Toggle dark mode
- [ ] Refresh page (persistence)

### Future Testing

- Unit tests for utility functions
- Integration tests for components
- E2E tests for user flows
- Visual regression testing

## Browser Compatibility

### Supported Browsers

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

### Required Features

- ES6+ JavaScript
- CSS Variables
- Canvas API
- FileReader API
- Blob API
- LocalStorage API

## Build & Deployment

### Development

```bash
npm start     # Development server on :3000
npm test      # Run tests
npm run build # Production build
```

### Production Build

- Optimized bundle with code splitting
- Minified CSS and JS
- Source maps for debugging
- Static file output in `build/`

### Deployment Options

- Static file hosting (Netlify, Vercel, GitHub Pages)
- S3 + CloudFront
- Any web server (nginx, Apache)

## Future Enhancements

### Planned Features

1. **Undo/Redo** - History stack implementation
2. **Templates** - Pre-built layouts
3. **Import** - Load from XML/JSON
4. **Collaboration** - Real-time multi-user editing
5. **Cloud Storage** - Save projects online
6. **Advanced Canvas** - Zoom, pan, snap-to-grid
7. **Device Library** - Custom device types
8. **Validation Rules** - Custom validation logic

### Architecture Changes

- Consider Redux for complex state
- Implement React Context for theme
- Add service worker for offline support
- Implement WebSocket for collaboration

## Conclusion

The Garage Layout Editor is a well-structured, maintainable React application that successfully implements all specified requirements. The architecture is scalable and provides clear extension points for future enhancements.

---

**Version**: 1.0.0
**Last Updated**: January 2026

# Garage Layout Editor - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Install & Run

```bash
npm install
npm start
```

The app will open at `http://localhost:3000`

### 2. Create Your First Layout

1. **Add a Level** - Click "+ Add Level" in the left panel
2. **Upload Floor Plan** - In the right panel, upload your background image
3. **Add Devices** - Click "+ Add Device" and select a device type
4. **Place Device** - Click on the map where you want to place it
5. **Configure** - Click the device to configure its settings

### 3. Export Your Work

Click "Export" in the top-right to generate:
- **PDF** - Visual layout documentation
- **XML** - Configuration files for deployment

## 📋 Common Tasks

### Adding a Camera

1. Click "+ Add Device"
2. Expand "Camera" category
3. Select "FLI Camera" or "LPR Camera"
4. Click on map to place
5. Configure:
   - Device name
   - Garage name
   - Level name
   - Rotation angle
   - Flow rules (direction, affected level, delta)

### Adding a Sign

1. Click "+ Add Device"
2. Expand "Sign" category
3. Select "Designable Sign" or "Static Sign"
4. Click on map to place
5. Configure:
   - Device name
   - For Designable: Add preview URL
   - Set override state (OPEN/FULL/CLSD/AUTO)

### Adding a Sensor

1. Click "+ Add Device"
2. Expand "Sensor" category
3. Select "Space Sensor"
4. Click on map to place
5. Configure:
   - Device name
   - Serial address
   - Parking type

## 🎯 Key Features at a Glance

| Feature | Description |
|---------|-------------|
| **Drag & Drop** | Reposition devices by dragging |
| **Multiple Levels** | Create separate floors |
| **Background Images** | Upload floor plans |
| **Dark Mode** | Toggle in top-right corner |
| **Auto-Save** | Work saves automatically |
| **Validation** | Check config before export |

## 🔍 Device Icon Legend

- **Camera** 📹 - Black rectangle with red direction arrow
- **Sign** 🪧 - Yellow rectangle
- **Sensor** 📡 - Green circle

Selected devices turn blue.

## ⚠️ Before Exporting XML

1. Click "Export" button
2. Click "Validate" to check for errors
3. Fix any validation errors:
   - Missing device names
   - Missing garage/level names
   - Incomplete flow rules
   - Missing sensor addresses
4. Click "Export XML" when validation passes

## 💡 Pro Tips

- **Name Consistently**: Use the same garage/level names across all devices
- **Flow Rules**: Think about how cars move between levels
- **Testing**: Use PDF export to share layouts with stakeholders
- **Backup**: Export XML files regularly as backup
- **Dark Mode**: Great for long editing sessions

## 🛠️ Troubleshooting

**Device won't place?**
- Make sure you clicked on the map after selecting device type
- Check that you're in placement mode (blue indicator at top)

**Export fails?**
- Run validation first
- Check browser console for errors
- Ensure popup blockers are disabled

**Background image not showing?**
- Check file format (PNG, JPG supported)
- Try a smaller file size if large

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore device configuration options
- Create multi-level layouts
- Export and deploy your configurations

---

**Need Help?** Check the README or browse the code - it's well-commented!

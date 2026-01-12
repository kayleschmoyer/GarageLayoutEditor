import React, { useState, useEffect } from 'react';
import LevelPanel from './components/LevelPanel';
import MapCanvas from './components/MapCanvas';
import InspectorPanel from './components/InspectorPanel';
import AddDeviceModal from './components/AddDeviceModal';
import ExportModal from './components/ExportModal';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [levels, setLevels] = useState([]);
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [placementMode, setPlacementMode] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('garageLayoutEditor');
    if (savedData) {
      try {
        const { levels: savedLevels, darkMode: savedDarkMode } = JSON.parse(savedData);
        if (savedLevels && savedLevels.length > 0) {
          setLevels(savedLevels);
          setSelectedLevelId(savedLevels[0].id);
        }
        if (savedDarkMode !== undefined) {
          setDarkMode(savedDarkMode);
        }
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    } else {
      // Initialize with one default level
      const defaultLevel = {
        id: generateId(),
        name: 'Level 1',
        backgroundImage: null,
        rotation: 0,
        devices: []
      };
      setLevels([defaultLevel]);
      setSelectedLevelId(defaultLevel.id);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (levels.length > 0) {
      localStorage.setItem('garageLayoutEditor', JSON.stringify({ levels, darkMode }));
    }
  }, [levels, darkMode]);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [darkMode]);

  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addLevel = () => {
    const newLevel = {
      id: generateId(),
      name: `Level ${levels.length + 1}`,
      backgroundImage: null,
      rotation: 0,
      devices: []
    };
    setLevels([...levels, newLevel]);
    setSelectedLevelId(newLevel.id);
    setSelectedDeviceId(null);
  };

  const deleteLevel = (levelId) => {
    const updatedLevels = levels.filter(l => l.id !== levelId);
    setLevels(updatedLevels);

    if (selectedLevelId === levelId) {
      setSelectedLevelId(updatedLevels.length > 0 ? updatedLevels[0].id : null);
      setSelectedDeviceId(null);
    }
  };

  const updateLevel = (levelId, updates) => {
    setLevels(levels.map(level =>
      level.id === levelId ? { ...level, ...updates } : level
    ));
  };

  const addDevice = (deviceType) => {
    const newDevice = createDevice(deviceType);
    setPlacementMode({ deviceType, device: newDevice });
    setShowAddDeviceModal(false);
  };

  const createDevice = (deviceType) => {
    const baseDevice = {
      id: generateId(),
      type: deviceType,
      x: 100,
      y: 100,
      rotation: 0
    };

    switch (deviceType) {
      case 'FLI Camera':
      case 'LPR Camera':
        return {
          ...baseDevice,
          name: `${deviceType} ${Date.now()}`,
          garageName: '',
          levelName: '',
          flowRules: [
            {
              id: generateId(),
              direction: 'IN',
              affectedLevel: '',
              delta: 1
            }
          ]
        };
      case 'Designable Sign':
        return {
          ...baseDevice,
          name: `Designable Sign ${Date.now()}`,
          garageName: '',
          levelName: '',
          previewUrl: '',
          override: 'AUTO'
        };
      case 'Static Sign':
        return {
          ...baseDevice,
          name: `Static Sign ${Date.now()}`,
          garageName: '',
          levelName: '',
          override: 'AUTO'
        };
      case 'Space Sensor':
        return {
          ...baseDevice,
          name: `Space Sensor ${Date.now()}`,
          garageName: '',
          levelName: '',
          serialAddress: '',
          parkingType: 'Standard'
        };
      default:
        return baseDevice;
    }
  };

  const placeDevice = (x, y) => {
    if (!placementMode || !selectedLevelId) return;

    const level = levels.find(l => l.id === selectedLevelId);
    if (!level) return;

    const deviceToPlace = {
      ...placementMode.device,
      x,
      y,
      levelName: level.name
    };

    const updatedDevices = [...level.devices, deviceToPlace];
    updateLevel(selectedLevelId, { devices: updatedDevices });
    setSelectedDeviceId(deviceToPlace.id);
    setPlacementMode(null);
  };

  const updateDevice = (deviceId, updates) => {
    const level = levels.find(l => l.id === selectedLevelId);
    if (!level) return;

    const updatedDevices = level.devices.map(device =>
      device.id === deviceId ? { ...device, ...updates } : device
    );
    updateLevel(selectedLevelId, { devices: updatedDevices });
  };

  const deleteDevice = (deviceId) => {
    const level = levels.find(l => l.id === selectedLevelId);
    if (!level) return;

    const updatedDevices = level.devices.filter(d => d.id !== deviceId);
    updateLevel(selectedLevelId, { devices: updatedDevices });

    if (selectedDeviceId === deviceId) {
      setSelectedDeviceId(null);
    }
  };

  const selectedLevel = levels.find(l => l.id === selectedLevelId);
  const selectedDevice = selectedLevel?.devices.find(d => d.id === selectedDeviceId);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Garage Layout Editor</h1>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowExportModal(true)}
          >
            Export
          </button>
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️' : '🌙'} {darkMode ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </header>

      <div className="main-layout">
        <LevelPanel
          levels={levels}
          selectedLevelId={selectedLevelId}
          onSelectLevel={setSelectedLevelId}
          onAddLevel={addLevel}
          onDeleteLevel={deleteLevel}
        />

        <MapCanvas
          level={selectedLevel}
          selectedDeviceId={selectedDeviceId}
          placementMode={placementMode}
          onSelectDevice={setSelectedDeviceId}
          onUpdateDevice={updateDevice}
          onPlaceDevice={placeDevice}
          onCancelPlacement={() => setPlacementMode(null)}
          onShowAddDevice={() => setShowAddDeviceModal(true)}
        />

        <InspectorPanel
          level={selectedLevel}
          device={selectedDevice}
          allLevels={levels}
          onUpdateLevel={updateLevel}
          onUpdateDevice={updateDevice}
          onDeleteDevice={deleteDevice}
        />
      </div>

      {showAddDeviceModal && (
        <AddDeviceModal
          onClose={() => setShowAddDeviceModal(false)}
          onSelectDevice={addDevice}
        />
      )}

      {showExportModal && (
        <ExportModal
          levels={levels}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}

export default App;

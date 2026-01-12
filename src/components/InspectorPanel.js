import React from 'react';
import LevelSettings from './LevelSettings';
import CameraConfig from './CameraConfig';
import DesignableSignConfig from './DesignableSignConfig';
import StaticSignConfig from './StaticSignConfig';
import SpaceSensorConfig from './SpaceSensorConfig';

function InspectorPanel({ level, device, allLevels, onUpdateLevel, onUpdateDevice, onDeleteDevice }) {
  if (!level) {
    return (
      <div className="panel inspector-panel">
        <div className="inspector-empty">
          Select a level to view settings
        </div>
      </div>
    );
  }

  // If a device is selected, show device config
  if (device) {
    return (
      <div className="panel inspector-panel">
        <div className="panel-header">
          <h2 className="panel-title">{device.type} Settings</h2>
        </div>
        <div className="inspector-content">
          {(device.type === 'FLI Camera' || device.type === 'LPR Camera') && (
            <CameraConfig
              device={device}
              allLevels={allLevels}
              onUpdate={onUpdateDevice}
              onDelete={onDeleteDevice}
            />
          )}

          {device.type === 'Designable Sign' && (
            <DesignableSignConfig
              device={device}
              allLevels={allLevels}
              onUpdate={onUpdateDevice}
              onDelete={onDeleteDevice}
            />
          )}

          {device.type === 'Static Sign' && (
            <StaticSignConfig
              device={device}
              allLevels={allLevels}
              onUpdate={onUpdateDevice}
              onDelete={onDeleteDevice}
            />
          )}

          {device.type === 'Space Sensor' && (
            <SpaceSensorConfig
              device={device}
              allLevels={allLevels}
              onUpdate={onUpdateDevice}
              onDelete={onDeleteDevice}
            />
          )}
        </div>
      </div>
    );
  }

  // Otherwise, show level settings
  return (
    <div className="panel inspector-panel">
      <div className="panel-header">
        <h2 className="panel-title">Level Settings</h2>
      </div>
      <div className="inspector-content">
        <LevelSettings
          level={level}
          onUpdate={onUpdateLevel}
        />
      </div>
    </div>
  );
}

export default InspectorPanel;

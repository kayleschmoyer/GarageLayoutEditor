import React from 'react';

function SpaceSensorConfig({ device, allLevels, onUpdate, onDelete }) {
  const handleFieldChange = (field, value) => {
    onUpdate(device.id, { [field]: value });
  };

  const parkingTypes = [
    'Standard',
    'Compact',
    'Handicap',
    'EV Charging',
    'Motorcycle',
    'Oversized'
  ];

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Device Name</label>
        <input
          type="text"
          className="form-input"
          value={device.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          placeholder="Enter device name"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Garage Name</label>
        <input
          type="text"
          className="form-input"
          value={device.garageName}
          onChange={(e) => handleFieldChange('garageName', e.target.value)}
          placeholder="Enter garage name"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Level Name</label>
        <select
          className="form-select"
          value={device.levelName}
          onChange={(e) => handleFieldChange('levelName', e.target.value)}
        >
          <option value="">Select level</option>
          {allLevels.map(level => (
            <option key={level.id} value={level.name}>
              {level.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Serial Address</label>
        <input
          type="text"
          className="form-input"
          value={device.serialAddress}
          onChange={(e) => handleFieldChange('serialAddress', e.target.value)}
          placeholder="e.g., 001A2B3C"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Parking Type</label>
        <select
          className="form-select"
          value={device.parkingType}
          onChange={(e) => handleFieldChange('parkingType', e.target.value)}
        >
          {parkingTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Position</label>
        <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px' }}>
          <div style={{ marginBottom: '4px' }}>
            <strong>X:</strong> {Math.round(device.x)}px
          </div>
          <div>
            <strong>Y:</strong> {Math.round(device.y)}px
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Note: Position is for layout only and not included in XML export
          </div>
        </div>
      </div>

      <div className="form-group">
        <button className="btn btn-danger btn-block" onClick={() => onDelete(device.id)}>
          Delete Device
        </button>
      </div>
    </div>
  );
}

export default SpaceSensorConfig;

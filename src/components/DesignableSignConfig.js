import React from 'react';

function DesignableSignConfig({ device, allLevels, onUpdate, onDelete }) {
  const handleFieldChange = (field, value) => {
    onUpdate(device.id, { [field]: value });
  };

  const setOverride = (override) => {
    onUpdate(device.id, { override });
  };

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
        <label className="form-label">Preview URL</label>
        <input
          type="url"
          className="form-input"
          value={device.previewUrl}
          onChange={(e) => handleFieldChange('previewUrl', e.target.value)}
          placeholder="https://example.com/sign-preview"
        />
      </div>

      {device.previewUrl && (
        <div className="form-group">
          <label className="form-label">Live Preview</label>
          <div className="preview-container">
            <iframe
              src={device.previewUrl}
              className="preview-iframe"
              title="Sign Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Override Controls</label>
        <div className="override-controls">
          <button
            className={`override-btn ${device.override === 'OPEN' ? 'active' : ''}`}
            onClick={() => setOverride('OPEN')}
          >
            OPEN
          </button>
          <button
            className={`override-btn ${device.override === 'FULL' ? 'active' : ''}`}
            onClick={() => setOverride('FULL')}
          >
            FULL
          </button>
          <button
            className={`override-btn ${device.override === 'CLSD' ? 'active' : ''}`}
            onClick={() => setOverride('CLSD')}
          >
            CLSD
          </button>
          <button
            className={`override-btn ${device.override === 'AUTO' ? 'active' : ''}`}
            onClick={() => setOverride('AUTO')}
          >
            AUTO
          </button>
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

export default DesignableSignConfig;

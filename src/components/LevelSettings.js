import React from 'react';

function LevelSettings({ level, onUpdate }) {
  const handleNameChange = (e) => {
    onUpdate(level.id, { name: e.target.value });
  };

  const handleRotationChange = (e) => {
    onUpdate(level.id, { rotation: parseInt(e.target.value) || 0 });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdate(level.id, { backgroundImage: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onUpdate(level.id, { backgroundImage: null });
  };

  return (
    <div>
      <div className="form-group">
        <label className="form-label">Level Name</label>
        <input
          type="text"
          className="form-input"
          value={level.name}
          onChange={handleNameChange}
          placeholder="Enter level name"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Background Image</label>
        <div className="file-input-wrapper">
          <input
            type="file"
            id="bg-image-upload"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <label htmlFor="bg-image-upload" className="file-input-label">
            {level.backgroundImage ? 'Replace Image' : 'Upload Image'}
          </label>
        </div>
        {level.backgroundImage && (
          <div className="current-image">
            Current: Floor plan image loaded
            <button
              className="btn btn-danger btn-small"
              onClick={handleRemoveImage}
              style={{ marginLeft: '8px' }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Map Rotation (degrees)</label>
        <div className="rotation-control">
          <input
            type="range"
            min="0"
            max="360"
            step="15"
            value={level.rotation || 0}
            onChange={handleRotationChange}
            style={{ flex: 1 }}
          />
          <span className="rotation-value">{level.rotation || 0}°</span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Statistics</label>
        <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px' }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>Total Devices:</strong> {level.devices.length}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Cameras:</strong> {level.devices.filter(d => d.type.includes('Camera')).length}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Signs:</strong> {level.devices.filter(d => d.type.includes('Sign')).length}
          </div>
          <div>
            <strong>Sensors:</strong> {level.devices.filter(d => d.type === 'Space Sensor').length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LevelSettings;

import React, { useState } from 'react';

function AddDeviceModal({ onClose, onSelectDevice }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categories = [
    {
      id: 'camera',
      name: 'Camera',
      icon: '📹',
      devices: [
        { type: 'FLI Camera', description: 'Flow Logic Imaging Camera' },
        { type: 'LPR Camera', description: 'License Plate Recognition Camera' }
      ]
    },
    {
      id: 'sign',
      name: 'Sign',
      icon: '🪧',
      devices: [
        { type: 'Designable Sign', description: 'HTML-rendered sign with preview' },
        { type: 'Static Sign', description: 'Fixed state display sign' }
      ]
    },
    {
      id: 'sensor',
      name: 'Sensor',
      icon: '📡',
      devices: [
        { type: 'Space Sensor', description: 'Parking space occupancy sensor' }
      ]
    }
  ];

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleSelectDevice = (deviceType) => {
    onSelectDevice(deviceType);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Device</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
            Select a device type to place on the map:
          </p>

          <div className="device-categories">
            {categories.map(category => (
              <div key={category.id} className="device-category">
                <div
                  className="category-header"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="category-title">
                    <span style={{ marginRight: '8px' }}>{category.icon}</span>
                    {category.name}
                  </div>
                  <span className={`category-icon ${expandedCategory === category.id ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>

                {expandedCategory === category.id && (
                  <div className="category-devices">
                    {category.devices.map(device => (
                      <button
                        key={device.type}
                        className="device-type-btn"
                        onClick={() => handleSelectDevice(device.type)}
                      >
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                          {device.type}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          {device.description}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddDeviceModal;

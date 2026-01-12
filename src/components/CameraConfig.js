import React from 'react';

function CameraConfig({ device, allLevels, onUpdate, onDelete }) {
  const handleFieldChange = (field, value) => {
    onUpdate(device.id, { [field]: value });
  };

  const addFlowRule = () => {
    const newRule = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      direction: 'IN',
      affectedLevel: '',
      delta: 1
    };
    onUpdate(device.id, {
      flowRules: [...(device.flowRules || []), newRule]
    });
  };

  const updateFlowRule = (ruleId, updates) => {
    const updatedRules = device.flowRules.map(rule =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );
    onUpdate(device.id, { flowRules: updatedRules });
  };

  const deleteFlowRule = (ruleId) => {
    const updatedRules = device.flowRules.filter(rule => rule.id !== ruleId);
    onUpdate(device.id, { flowRules: updatedRules });
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
        <label className="form-label">Rotation (degrees)</label>
        <div className="rotation-control">
          <input
            type="range"
            min="0"
            max="360"
            step="15"
            value={device.rotation || 0}
            onChange={(e) => handleFieldChange('rotation', parseInt(e.target.value))}
            style={{ flex: 1 }}
          />
          <span className="rotation-value">{device.rotation || 0}°</span>
        </div>
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>Flow Rules</label>
          <button className="btn btn-primary btn-small" onClick={addFlowRule}>
            + Add Rule
          </button>
        </div>

        <div className="flow-rules">
          {device.flowRules && device.flowRules.map(rule => (
            <div key={rule.id} className="flow-rule">
              <div className="flow-rule-header">
                <span className="flow-rule-title">
                  Back of car is {rule.direction}
                </span>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => deleteFlowRule(rule.id)}
                >
                  Delete
                </button>
              </div>

              <div className="flow-rule-fields">
                <div>
                  <label className="form-label">Direction</label>
                  <select
                    className="form-select"
                    value={rule.direction}
                    onChange={(e) => updateFlowRule(rule.id, { direction: e.target.value })}
                  >
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Affected Level</label>
                  <select
                    className="form-select"
                    value={rule.affectedLevel}
                    onChange={(e) => updateFlowRule(rule.id, { affectedLevel: e.target.value })}
                  >
                    <option value="">Select level</option>
                    {allLevels.map(level => (
                      <option key={level.id} value={level.name}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Delta (+/-)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={rule.delta}
                    onChange={(e) => updateFlowRule(rule.id, { delta: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          ))}

          {(!device.flowRules || device.flowRules.length === 0) && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No flow rules defined. Click "Add Rule" to create one.
            </div>
          )}
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

export default CameraConfig;

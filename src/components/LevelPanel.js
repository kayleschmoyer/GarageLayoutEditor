import React from 'react';

function LevelPanel({ levels, selectedLevelId, onSelectLevel, onAddLevel, onDeleteLevel }) {
  return (
    <div className="panel level-panel">
      <div className="panel-header">
        <h2 className="panel-title">Levels</h2>
        <button className="btn btn-primary btn-block" onClick={onAddLevel}>
          + Add Level
        </button>
      </div>
      <div className="level-list">
        {levels.map(level => (
          <div
            key={level.id}
            className={`level-item ${selectedLevelId === level.id ? 'active' : ''}`}
            onClick={() => onSelectLevel(level.id)}
          >
            <div className="level-item-name">{level.name}</div>
            <div className="level-item-info">
              {level.devices.length} device{level.devices.length !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
        {levels.length === 0 && (
          <div className="inspector-empty">
            No levels yet. Click "Add Level" to start.
          </div>
        )}
      </div>
    </div>
  );
}

export default LevelPanel;

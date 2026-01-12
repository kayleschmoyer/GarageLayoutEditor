import React, { useState } from 'react';
import { exportLayoutToPDF } from '../utils/exportPDF';
import {
  validateConfiguration,
  exportDevicesConfigXML,
  exportConfigurationXML,
  exportSpaceSensorsConfigXML,
  downloadXML
} from '../utils/exportXML';

function ExportModal({ levels, onClose }) {
  const [validationErrors, setValidationErrors] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportLayoutToPDF(levels);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please check the console for details.');
    }
    setIsExporting(false);
  };

  const handleExportXML = () => {
    // Validate first
    const errors = validateConfiguration(levels);
    setValidationErrors(errors);

    if (errors.length > 0) {
      return;
    }

    setIsExporting(true);

    try {
      // Export all three XML files
      const devicesXML = exportDevicesConfigXML(levels);
      downloadXML('DevicesConfig.xml', devicesXML);

      const configXML = exportConfigurationXML(levels);
      downloadXML('Configuration.xml', configXML);

      const sensorsXML = exportSpaceSensorsConfigXML(levels);
      downloadXML('SpaceSensorsConfig.xml', sensorsXML);

      alert('XML files exported successfully!');
    } catch (error) {
      console.error('Error exporting XML:', error);
      alert('Error exporting XML. Please check the console for details.');
    }

    setIsExporting(false);
  };

  const handleValidate = () => {
    const errors = validateConfiguration(levels);
    setValidationErrors(errors);

    if (errors.length === 0) {
      alert('✓ Configuration is valid! All join keys and required fields are present.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Export Layout & Configuration</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {validationErrors.length > 0 && (
            <div className="validation-errors">
              <div className="validation-errors-title">
                ⚠️ Validation Errors ({validationErrors.length})
              </div>
              <ul className="validation-errors-list">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              <p style={{ marginTop: '12px', fontSize: '14px' }}>
                Please fix these errors before exporting XML configuration files.
              </p>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Export Final Layout (PDF)</label>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Generate a multi-page PDF with one page per level. Each page includes the background
              image and all placed devices with labels.
            </p>
            <button
              className="btn btn-primary btn-block"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : '📄 Export PDF Layout'}
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Export Configuration (XML)</label>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Export three XML files: DevicesConfig.xml, Configuration.xml, and SpaceSensorsConfig.xml.
              Validation ensures all join keys (GarageName, LevelName, DeviceName) are consistent.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary"
                onClick={handleValidate}
                style={{ flex: 1 }}
              >
                🔍 Validate
              </button>
              <button
                className="btn btn-success"
                onClick={handleExportXML}
                disabled={isExporting}
                style={{ flex: 1 }}
              >
                {isExporting ? 'Exporting...' : '📦 Export XML'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Export Summary</label>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Total Levels:</strong> {levels.length}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Total Devices:</strong> {levels.reduce((sum, level) => sum + level.devices.length, 0)}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Cameras:</strong> {levels.reduce((sum, level) =>
                  sum + level.devices.filter(d => d.type.includes('Camera')).length, 0)}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Signs:</strong> {levels.reduce((sum, level) =>
                  sum + level.devices.filter(d => d.type.includes('Sign')).length, 0)}
              </div>
              <div>
                <strong>Sensors:</strong> {levels.reduce((sum, level) =>
                  sum + level.devices.filter(d => d.type === 'Space Sensor').length, 0)}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;

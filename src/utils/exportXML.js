export function validateConfiguration(levels) {
  const errors = [];
  const deviceNames = new Set();
  const garageNames = new Set();
  const levelNames = new Set();

  levels.forEach(level => {
    if (!level.name || level.name.trim() === '') {
      errors.push(`Level has no name`);
    }
    levelNames.add(level.name);

    level.devices.forEach(device => {
      // Check for unique device names
      if (!device.name || device.name.trim() === '') {
        errors.push(`Device of type "${device.type}" has no name`);
      } else if (deviceNames.has(device.name)) {
        errors.push(`Duplicate device name: "${device.name}"`);
      } else {
        deviceNames.add(device.name);
      }

      // Check for garage name
      if (!device.garageName || device.garageName.trim() === '') {
        errors.push(`Device "${device.name}" is missing garage name`);
      } else {
        garageNames.add(device.garageName);
      }

      // Check for level name
      if (!device.levelName || device.levelName.trim() === '') {
        errors.push(`Device "${device.name}" is missing level name`);
      }

      // Device-specific validations
      if (device.type.includes('Camera')) {
        if (!device.flowRules || device.flowRules.length === 0) {
          errors.push(`Camera "${device.name}" has no flow rules defined`);
        } else {
          device.flowRules.forEach((rule, index) => {
            if (!rule.affectedLevel || rule.affectedLevel.trim() === '') {
              errors.push(`Camera "${device.name}" flow rule ${index + 1} is missing affected level`);
            }
          });
        }
      }

      if (device.type === 'Space Sensor') {
        if (!device.serialAddress || device.serialAddress.trim() === '') {
          errors.push(`Space Sensor "${device.name}" is missing serial address`);
        }
      }
    });
  });

  return errors;
}

export function exportDevicesConfigXML(levels) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<DevicesConfig>\n';

  levels.forEach(level => {
    const cameras = level.devices.filter(d => d.type.includes('Camera'));
    const signs = level.devices.filter(d => d.type.includes('Sign'));

    [...cameras, ...signs].forEach(device => {
      xml += '  <Device>\n';
      xml += `    <Name>${escapeXml(device.name)}</Name>\n`;
      xml += `    <Type>${escapeXml(device.type)}</Type>\n`;
      xml += `    <GarageName>${escapeXml(device.garageName)}</GarageName>\n`;
      xml += `    <LevelName>${escapeXml(device.levelName)}</LevelName>\n`;

      if (device.type.includes('Camera')) {
        xml += `    <Rotation>${device.rotation || 0}</Rotation>\n`;
        xml += '    <FlowRules>\n';
        device.flowRules?.forEach(rule => {
          xml += '      <FlowRule>\n';
          xml += `        <Direction>${escapeXml(rule.direction)}</Direction>\n`;
          xml += `        <AffectedLevel>${escapeXml(rule.affectedLevel)}</AffectedLevel>\n`;
          xml += `        <Delta>${rule.delta}</Delta>\n`;
          xml += '      </FlowRule>\n';
        });
        xml += '    </FlowRules>\n';
      }

      if (device.type === 'Designable Sign') {
        xml += `    <PreviewURL>${escapeXml(device.previewUrl || '')}</PreviewURL>\n`;
        xml += `    <Override>${escapeXml(device.override || 'AUTO')}</Override>\n`;
      }

      if (device.type === 'Static Sign') {
        xml += `    <Override>${escapeXml(device.override || 'AUTO')}</Override>\n`;
      }

      xml += '  </Device>\n';
    });
  });

  xml += '</DevicesConfig>';
  return xml;
}

export function exportConfigurationXML(levels) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<Configuration>\n';

  const garageNames = new Set();
  levels.forEach(level => {
    level.devices.forEach(device => {
      if (device.garageName) {
        garageNames.add(device.garageName);
      }
    });
  });

  garageNames.forEach(garageName => {
    xml += '  <Garage>\n';
    xml += `    <Name>${escapeXml(garageName)}</Name>\n`;
    xml += '    <Levels>\n';

    const relevantLevels = levels.filter(level =>
      level.devices.some(d => d.garageName === garageName)
    );

    relevantLevels.forEach(level => {
      xml += '      <Level>\n';
      xml += `        <Name>${escapeXml(level.name)}</Name>\n`;
      xml += `        <DeviceCount>${level.devices.filter(d => d.garageName === garageName).length}</DeviceCount>\n`;
      xml += '      </Level>\n';
    });

    xml += '    </Levels>\n';
    xml += '  </Garage>\n';
  });

  xml += '</Configuration>';
  return xml;
}

export function exportSpaceSensorsConfigXML(levels) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<SpaceSensorsConfig>\n';

  levels.forEach(level => {
    const sensors = level.devices.filter(d => d.type === 'Space Sensor');

    if (sensors.length > 0) {
      const groupedByGarage = {};
      sensors.forEach(sensor => {
        const key = sensor.garageName || 'Unassigned';
        if (!groupedByGarage[key]) {
          groupedByGarage[key] = [];
        }
        groupedByGarage[key].push(sensor);
      });

      Object.keys(groupedByGarage).forEach(garageName => {
        xml += '  <SensorGroup>\n';
        xml += `    <GarageName>${escapeXml(garageName)}</GarageName>\n`;
        xml += `    <LevelName>${escapeXml(level.name)}</LevelName>\n`;
        xml += '    <Sensors>\n';

        groupedByGarage[garageName].forEach(sensor => {
          xml += '      <Sensor>\n';
          xml += `        <Name>${escapeXml(sensor.name)}</Name>\n`;
          xml += `        <SerialAddress>${escapeXml(sensor.serialAddress)}</SerialAddress>\n`;
          xml += `        <ParkingType>${escapeXml(sensor.parkingType)}</ParkingType>\n`;
          xml += '      </Sensor>\n';
        });

        xml += '    </Sensors>\n';
        xml += '  </SensorGroup>\n';
      });
    }
  });

  xml += '</SpaceSensorsConfig>';
  return xml;
}

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function downloadXML(filename, content) {
  const blob = new Blob([content], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image, Group, Circle, Rect, Line, Text } from 'react-konva';
import useImage from 'use-image';

// Device Icon Components
function CameraIcon({ device, isSelected, onClick, onDragEnd, dragBoundFunc }) {
  const x = device.x;
  const y = device.y;
  const rotation = device.rotation || 0;

  return (
    <Group
      x={x}
      y={y}
      rotation={rotation}
      draggable
      onClick={onClick}
      onDragEnd={(e) => onDragEnd(e, device.id)}
      dragBoundFunc={dragBoundFunc}
    >
      {/* Camera body (bullet style) */}
      <Rect
        width={30}
        height={15}
        offsetX={15}
        offsetY={7.5}
        fill={isSelected ? '#007bff' : '#333333'}
        stroke={isSelected ? '#0056b3' : '#000000'}
        strokeWidth={2}
      />
      {/* Direction indicator */}
      <Line
        points={[15, 0, 25, 0]}
        stroke={isSelected ? '#007bff' : '#ff0000'}
        strokeWidth={3}
      />
      {/* Label */}
      <Text
        text={device.name || device.type}
        fontSize={10}
        fill={isSelected ? '#007bff' : '#000000'}
        offsetY={-15}
        offsetX={50}
      />
    </Group>
  );
}

function SignIcon({ device, isSelected, onClick, onDragEnd, dragBoundFunc }) {
  return (
    <Group
      x={device.x}
      y={device.y}
      draggable
      onClick={onClick}
      onDragEnd={(e) => onDragEnd(e, device.id)}
      dragBoundFunc={dragBoundFunc}
    >
      {/* Sign rectangle */}
      <Rect
        width={40}
        height={30}
        offsetX={20}
        offsetY={15}
        fill={isSelected ? '#007bff' : '#ffcc00'}
        stroke={isSelected ? '#0056b3' : '#000000'}
        strokeWidth={2}
      />
      {/* Label */}
      <Text
        text={device.name || device.type}
        fontSize={10}
        fill={isSelected ? '#007bff' : '#000000'}
        offsetY={-20}
        offsetX={60}
      />
    </Group>
  );
}

function SensorIcon({ device, isSelected, onClick, onDragEnd, dragBoundFunc }) {
  return (
    <Group
      x={device.x}
      y={device.y}
      draggable
      onClick={onClick}
      onDragEnd={(e) => onDragEnd(e, device.id)}
      dragBoundFunc={dragBoundFunc}
    >
      {/* Sensor circle */}
      <Circle
        radius={10}
        fill={isSelected ? '#007bff' : '#28a745'}
        stroke={isSelected ? '#0056b3' : '#000000'}
        strokeWidth={2}
      />
      {/* Label */}
      <Text
        text={device.name || device.type}
        fontSize={10}
        fill={isSelected ? '#007bff' : '#000000'}
        offsetY={-20}
        offsetX={15}
      />
    </Group>
  );
}

function BackgroundImage({ src, rotation }) {
  const [image] = useImage(src);

  if (!image) return null;

  return (
    <Image
      image={image}
      rotation={rotation || 0}
      opacity={0.7}
      listening={true}
      name="backgroundImage"
    />
  );
}

function MapCanvas({
  level,
  selectedDeviceId,
  placementMode,
  onSelectDevice,
  onUpdateDevice,
  onPlaceDevice,
  onCancelPlacement,
  onShowAddDevice
}) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleStageClick = (e) => {
    // If clicking on stage or background image (not a device), deselect or place device
    const clickedOnBackground = e.target === e.target.getStage() ||
                                 e.target.getClassName() === 'Image';

    if (clickedOnBackground) {
      if (placementMode) {
        const pos = e.target.getStage().getPointerPosition();
        onPlaceDevice(pos.x, pos.y);
      } else {
        onSelectDevice(null);
      }
    }
  };

  const handleDeviceClick = (deviceId) => {
    if (!placementMode) {
      onSelectDevice(deviceId);
    }
  };

  const dragBoundFunc = (pos) => {
    const padding = 50; // Keep some padding from edges
    return {
      x: Math.max(padding, Math.min(dimensions.width - padding, pos.x)),
      y: Math.max(padding, Math.min(dimensions.height - padding, pos.y))
    };
  };

  const handleDragEnd = (e, deviceId) => {
    onUpdateDevice(deviceId, {
      x: e.target.x(),
      y: e.target.y()
    });
  };

  if (!level) {
    return (
      <div className="map-container">
        <div className="inspector-empty">
          No level selected. Create or select a level to begin.
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div className="map-header">
        <h2 className="level-name-display">{level.name}</h2>
        <div className="map-actions">
          <button className="btn btn-primary" onClick={onShowAddDevice}>
            + Add Device
          </button>
        </div>
      </div>

      <div className="map-canvas-wrapper" ref={containerRef}>
        {!level.backgroundImage && !placementMode && (
          <div className="map-empty-state">
            <div className="empty-state-icon">🖼️</div>
            <h3 className="empty-state-title">No Background Image</h3>
            <p className="empty-state-text">
              Upload a floor plan or garage layout image in the right panel to get started.
              Then you can place cameras, signs, and sensors on your layout.
            </p>
          </div>
        )}

        {placementMode && (
          <div className="placement-mode-indicator">
            Click on the map to place {placementMode.deviceType}
            <button
              className="btn btn-secondary btn-small"
              onClick={onCancelPlacement}
            >
              Cancel
            </button>
          </div>
        )}

        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          onClick={handleStageClick}
        >
          <Layer>
            {/* Background Image */}
            {level.backgroundImage && (
              <BackgroundImage
                src={level.backgroundImage}
                rotation={level.rotation}
              />
            )}

            {/* Devices */}
            {level.devices.map(device => {
              const isSelected = device.id === selectedDeviceId;

              if (device.type.includes('Camera')) {
                return (
                  <CameraIcon
                    key={device.id}
                    device={device}
                    isSelected={isSelected}
                    onClick={() => handleDeviceClick(device.id)}
                    onDragEnd={handleDragEnd}
                    dragBoundFunc={dragBoundFunc}
                  />
                );
              } else if (device.type.includes('Sign')) {
                return (
                  <SignIcon
                    key={device.id}
                    device={device}
                    isSelected={isSelected}
                    onClick={() => handleDeviceClick(device.id)}
                    onDragEnd={handleDragEnd}
                    dragBoundFunc={dragBoundFunc}
                  />
                );
              } else if (device.type === 'Space Sensor') {
                return (
                  <SensorIcon
                    key={device.id}
                    device={device}
                    isSelected={isSelected}
                    onClick={() => handleDeviceClick(device.id)}
                    onDragEnd={handleDragEnd}
                    dragBoundFunc={dragBoundFunc}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

export default MapCanvas;

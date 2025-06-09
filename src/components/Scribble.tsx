import { useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Button } from 'primereact/button';

const themeColors = ['#000000', '#3D0000', '#950101', '#FF0000'];

export default function Scribble() {
  const canvasRef = useRef<any>(null);
  const [brushColor, setBrushColor] = useState(themeColors[0]);
  const [brushRadius, setBrushRadius] = useState(2);
  
  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  return (
    <div className="scribble-container">
      <div className="scribble-controls">
        <div className="color-picker">
          {themeColors.map((color) => (
            <div
              key={color}
              className={`color-option ${brushColor === color ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setBrushColor(color)}
            />
          ))}
        </div>
        <div className="brush-size">
          <Button
            icon="pi pi-minus"
            className="p-button-rounded p-button-text"
            onClick={() => setBrushRadius(Math.max(1, brushRadius - 1))}
            disabled={brushRadius <= 1}
          />
          <span className="brush-size-value">{brushRadius}px</span>
          <Button
            icon="pi pi-plus"
            className="p-button-rounded p-button-text"
            onClick={() => setBrushRadius(Math.min(10, brushRadius + 1))}
            disabled={brushRadius >= 10}
          />
        </div>
        <div className="scribble-buttons">
          <Button
            icon="pi pi-undo"
            className="p-button-rounded p-button-text"
            onClick={handleUndo}
            tooltip="Undo"
          />
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-text"
            onClick={handleClear}
            tooltip="Clear"
          />
        </div>
      </div>
      <div className="canvas-container">
        <CanvasDraw
          ref={canvasRef}
          brushColor={brushColor}
          brushRadius={brushRadius}
          lazyRadius={0}
          canvasWidth={400}
          canvasHeight={400}
          hideGrid={true}
          className="scribble-canvas"
          backgroundColor="white"
        />
      </div>
    </div>
  );
} 
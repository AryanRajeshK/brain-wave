"use client"

import React, { useRef, useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { Eraser } from "lucide-react";
import { XCircle } from "lucide-react";
import "./canvas.css";
import io from 'socket.io-client';

const socket = io('http://localhost:3000/');
export default function Canvas() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#3B3B3B");
  const [size, setSize] = useState("3");
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const timeout = useRef(null);
  const [cursor, setCursor] = useState("default");

  useEffect(() => {
    const canvas = canvasRef.current;
    ctx.current = canvas.getContext("2d");

    //Resizing
    canvas.height = 600;
    canvas.width = 800;

    //Load from locastorage
    const canvasimg = localStorage.getItem("canvasimg");
    if (canvasimg) {
      var image = new Image();
      ctx.current = canvas.getContext("2d");
      image.onload = function () {
        ctx.current.drawImage(image, 0, 0);
        setIsDrawing(false);
      };
      image.src = canvasimg;
    }
    
    const btnContainer = document.querySelector('.canvas-btn');
  if (btnContainer) {
    const btnContainerWidth = btnContainer.offsetWidth;
    const btnContainerHeight = btnContainer.offsetHeight;
    const btnContainerLeft = 100 / 2 - btnContainerWidth / 2;
    const btnContainerTop = 500 / 2 - btnContainerHeight / 2;

    btnContainer.style.position = 'absolute';
    btnContainer.style.top = `${btnContainerTop}px`;
    btnContainer.style.left = `${btnContainerLeft}px`;
  }

  }, [ctx]);

  const startPosition = ({ nativeEvent }) => {
    setIsDrawing(true);
    draw(nativeEvent);
  };

  const finishedPosition = () => {
    setIsDrawing(false);
    ctx.current.beginPath();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = nativeEvent.clientX - rect.left;
    const y = nativeEvent.clientY - rect.top;

    ctx.current.lineWidth = size;
    ctx.current.lineCap = "round";
    ctx.current.strokeStyle = color;

    ctx.current.lineTo(x, y);
    ctx.current.stroke();
    ctx.current.beginPath();
    ctx.current.moveTo(x, y);
    socket.emit('draw',{x, y, color, size});

    if (timeout.current !== undefined) clearTimeout(timeout.current);
    timeout.current = setTimeout(function () {
      var base64ImageData = canvas.toDataURL("image/png");
      localStorage.setItem("canvasimg", base64ImageData);
    }, 400);
  };

  const clearCanvas = () => {
    localStorage.removeItem("canvasimg");
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    socket.emit('clearCanvas');

    //Passing clear screen
    if (timeout.current !== undefined) clearTimeout(timeout.current);
    timeout.current = setTimeout(function () {
      var base64ImageData = canvas.toDataURL("image/png");
      localStorage.setItem("canvasimg", base64ImageData);
    }, 400);
  };

  socket.on('draw', (data) => {
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = data.x - rect.left;
    const y = data.y - rect.top;

    ctx.current.lineWidth = data.size;
    ctx.current.lineCap = "round";
    ctx.current.strokeStyle = data.color;

    ctx.current.lineTo(x, y);
    ctx.current.stroke();
    ctx.current.beginPath();
    ctx.current.moveTo(x, y);
  });

  socket.on('clearCanvas', () => {
    localStorage.removeItem("canvasimg");
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
  });

  const getPen = () => {
    setCursor("default");
    setSize("3");
    setColor("#3B3B3B");
  };

  const eraseCanvas = () => {
    setCursor("grab");
    setSize("20");
    setColor("#FFFFFF");

    if (!isDrawing) {
      return;
    }
  };

  return (
    <>
      <div className="canvas-btn">
        <button onClick={getPen} className="btn-width" >
          <Pencil/>
        </button>
        <div className="btn-width" style={{backgroundColor: 'black'}}>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{backgroundColor: 'black'}}
          />
        </div>
        <div>
          <select
            className="btn-width"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option> 1 </option>
            <option> 3 </option>
            <option> 5 </option>
            <option> 10 </option>
            <option> 15 </option>
            <option> 20 </option>
            <option> 25 </option>
            <option> 30 </option>
          </select>
        </div>
        <button onClick={clearCanvas} className="btn-width">
          <XCircle />
        </button>
        <div>
          <button onClick={eraseCanvas} className="btn-width">
            <Eraser/>
          </button>
        </div>
      </div>
      <canvas
        style={{ cursor: cursor }}
        onMouseDown={startPosition}
        onMouseUp={finishedPosition}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </>
  );
}
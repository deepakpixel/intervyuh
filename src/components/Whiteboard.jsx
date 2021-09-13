import React, { useRef, useEffect, useState } from 'react';
import { useSocket } from '../contexts/socket';
import { default as TrashIcon } from '../components/icons/Trash';
const Whiteboard = ({ mainRef: canvasWrapper, tabRef }) => {
  const canvasRef = useRef(null);
  const colorsRef = useRef(null);
  // const canvasWrapper = useRef(null);
  const [activeColor, setActiveColor] = useState('black');
  const socket = useSocket();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const colors = colorsRef.current.childNodes;
    const current = {
      color: 'black',
      x: 0,
      y: 0,
      fixX: 0,
      fixY: 0,
      fixed: false,
    };

    colors.forEach((color) => {
      color.addEventListener(
        'click',
        (e) => {
          if (!e.target.dataset.color) return;
          current.color = e.target.dataset.color;
          setActiveColor(current.color);
        },
        false
      );
    });
    let drawing = false;
    const drawLine = (x0, y0, x1, y1, color, emit) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
      context.closePath();

      if (!emit) {
        return;
      }
      const w = canvas.width;
      const h = canvas.height;

      socket.emit('drawing', {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color,
      });
    };
    const onMouseDown = (e) => {
      if (canvas.width === 0 || canvas.height === 0 || !current.fixed) {
        // onResize();
        setOffset();
        current.fixed = true;
      }
      console.log('mouse down');
      drawing = true;
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
      current.x -= current.fixX;
      current.y -= current.fixY;
    };
    const onMouseMove = (e) => {
      try {
        if (!drawing) return;
        let newX = e.clientX || e.touches[0].clientX;
        let newY = e.clientY || e.touches[0].clientY;
        newX -= current.fixX;
        newY -= current.fixY;
        drawLine(current.x, current.y, newX, newY, current.color, true);
        current.x = newX;
        current.y = newY;
      } catch (error) {}
    };

    const onMouseUp = (e) => {
      try {
        if (!drawing) return;
        let newX = e.clientX || e.touches[0].clientX;
        let newY = e.clientY || e.touches[0].clientY;
        newX -= current.fixX;
        newY -= current.fixY;
        drawing = false;
        drawLine(current.x, current.y, newX, newY, current.color, true);
      } catch (error) {}
    };
    const throttle = (callback, delay) => {
      let previousCall = new Date().getTime();
      return function () {
        const time = new Date().getTime();

        if (time - previousCall >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    };
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);
    // Touch support for mobile devices
    canvas.addEventListener('touchstart', onMouseDown, false);
    canvas.addEventListener('touchend', onMouseUp, false);
    canvas.addEventListener('touchcancel', onMouseUp, false);
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

    // -------------- make the canvas fill its parent component -----------------
    const onResize = () => {
      canvas.width = canvasWrapper.current?.offsetWidth || 0;
      canvas.height =
        canvasWrapper.current?.offsetHeight - tabRef.current?.offsetHeight || 0;
      setOffset();
    };

    const setOffset = () => {
      current.fixX = document
        .querySelector('canvas')
        ?.getBoundingClientRect().left;
      current.fixY = document
        .querySelector('canvas')
        ?.getBoundingClientRect().top;
    };

    window.addEventListener('resize', onResize, false);
    window.addEventListener('resize', setOffset, false);
    window.addEventListener('scroll', setOffset, false);
    onResize();
    setOffset();
    // ----------------------- socket.io connection ----------------------------
    const onDrawingEvent = (data) => {
      if (canvas.width === 0 || canvas.height === 0 || !current.fixed) {
        // onResize();
        // setOffset();
        // current.fixed = true;
      }
      const w = canvas.width;
      const h = canvas.height;
      console.log({ w, h });
      drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
    };
    socket.on('drawing', onDrawingEvent);
    socket.on('clear-canvas', () =>
      context.clearRect(0, 0, canvas.width, canvas.height)
    );
  }, [socket, setActiveColor, canvasWrapper, tabRef]);
  console.log(activeColor);

  // ------------- The Canvas and color elements --------------------------

  return (
    <div
      // ref={canvasWrapper}
      className="relative h-full"
    >
      <canvas
        // height="100%"
        // width="100%"
        ref={canvasRef}
        className="w-full h-full"
      />
      <div
        ref={colorsRef}
        className="m-2 absolute flex justify-center top-0 left-0 bg-gray-300 border rounded-full"
      >
        <div
          data-color="black"
          className={`${
            activeColor === 'black' && 'active-color'
          } h-10 w-10 rounded-full m-1 bg-black `}
        />
        <div
          data-color="red"
          className={`${
            activeColor === 'red' && 'active-color'
          } h-10 w-10 rounded-full m-1 bg-red-500`}
        />
        <div
          data-color="green"
          className={`${
            activeColor === 'green' && 'active-color'
          } h-10 w-10 rounded-full m-1 bg-green-500`}
        />
        <div
          data-color="blue"
          className={`${
            activeColor === 'blue' && 'active-color'
          } h-10 w-10 rounded-full m-1 bg-blue-500 `}
        />
        <div
          data-color="yellow"
          className={`${
            activeColor === 'yellow' && 'active-color'
          } h-10 w-10 rounded-full m-1 bg-yellow-500 `}
        />
        <div
          onClick={() => {
            canvasRef.current
              .getContext('2d')
              .clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              );
            socket.emit('clear-canvas', '');
          }}
          className={`h-10 w-10 rounded-full m-1 bg-white grid place-items-center cursor-pointer hover:bg-red-500 text-red-500 hover:text-white`}
        >
          <TrashIcon />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;

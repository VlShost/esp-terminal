import React, { useState, useEffect, useRef } from 'react';

function EspSerial({ baudRate, endLine, charset, serialActive }) {
  const [active, setActive] = useState(false);
  // const [port, setPort] = useState(null);
  const [writer, setWriter] = useState(null);
  const [reader, setReader] = useState(null);

  const textDecoder = new TextDecoder(charset);
  const textEncoder = new TextEncoder(charset);
  const closeReadLoop = useRef(null);

  // console.log(baudRate);
  // console.log(navigator.serial);

  useEffect(() => {
    const portOpen = async () => {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate });
      console.log(port);
    };
  }, [baudRate]);

  const handleKeyPress = () => {};

  const handlePaste = () => {};

  return (
    <div className="container">
      <textarea rows="25" onKeyDown={handleKeyPress} onPaste={handlePaste}></textarea>
    </div>
  );
}

export default EspSerial;

import React, { useState, useEffect, useRef } from 'react';

function EspSerial() {
  const [serialActive, setSerialActive] = useState(false);
  const [baudRate, setBaudRate] = useState('115200');
  const [endLine, setEndLine] = useState('\r\n');
  const [charset, setCharset] = useState('utf8');

  const [port, setPort] = useState(null);
  const [writer, setWriter] = useState(null);
  const [reader, setReader] = useState(null);

  const textDecoder = new TextDecoder(charset);
  const textEncoder = new TextEncoder(charset);
  const closeReadLoop = useRef(null);

  const options = [
    { value: '9600', label: '9600' },
    { value: '14400', label: '14400' },
    { value: '19200', label: '19200' },
    { value: '28800', label: '28800' },
    { value: '38400', label: '38400' },
    { value: '57600', label: '57600' },
    { value: '115200', label: '115200' },
    { value: '230400', label: '230400' },
    { value: '460800', label: '460800' },
    { value: '921600', label: '921600' },
  ];

  // console.log(baudRate);

  const handleConnect = async () => {
    if (!serialActive) {
      setSerialActive(true);
      try {
        let availablePort = await navigator.serial.requestPort();
        console.log(availablePort);
        setPort(availablePort);
        console.log(port);
        await port.open({ baudRate, endLine, charset });

        port.ondisconnect = (e) => {
          port.close();
        };

        closeReadLoop(handleRead());
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDisconnect = async () => {
    if (serialActive) {
      setSerialActive(false);
      if (port.readable) reader.cancel();
      try {
        await closeReadLoop;
        await port.close();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = (e) => {
    setBaudRate(e.target.value);
  };

  const handleRead = async () => {
    while (port.readable && serialActive) {
      const reader = port.readable.getReader();
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          textDecoder.decode(value);
        }
      } catch (error) {
        // readable stream error
        console.log('onError', error);
      } finally {
        reader.releaseLock();
      }
    }
  };

  const handleKeyPress = () => {};

  const handlePaste = () => {};

  return (
    <div className="container">
      <label>
        Baud rate:
        <select value={baudRate} onChange={handleChange}>
          {options.map((option) => {
            return (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            );
          })}
        </select>
      </label>
      {serialActive ? (
        <button type="button" onClick={handleDisconnect}>
          Disconnect
        </button>
      ) : (
        <button type="button" onClick={handleConnect}>
          Connect
        </button>
      )}
      <div>
        <textarea rows="25" onKeyDown={handleKeyPress} onPaste={handlePaste}></textarea>
      </div>
    </div>
  );
}

export default EspSerial;

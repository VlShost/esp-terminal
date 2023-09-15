import { useState } from 'react';

import Serial from './espserial';

import './App.css';

function App() {
  const [serialActive, setSerialActive] = useState(false);
  const [baudRate, setBaudRate] = useState('115200');

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

  const handleConnect = () => {
    if (!serialActive) {
      setSerialActive(true);
    } else {
      setSerialActive(false);
    }
    // console.log(serialActive);
  };

  const handleChange = (e) => {
    setBaudRate(e.target.value);
  };

  return (
    <div className="App">
      <main className="container">
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
        {!serialActive ? (
          <button type="button" onClick={handleConnect}>
            Disconnect
          </button>
        ) : (
          <button type="button" onClick={handleConnect}>
            Connect
          </button>
        )}
      </main>
      <Serial baudRate={baudRate} endLine={'\r\n'} charset={'utf8'} serialActive />
    </div>
  );
}

export default App;

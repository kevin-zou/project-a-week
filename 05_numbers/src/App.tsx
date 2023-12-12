import { useEffect, useState } from 'react';
import './App.css';
import OptionsDialog from './OptionsDialog';
import { DEFAULT_CONFIG } from './constants';

function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [number, setNumber] = useState<number>();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    generate();
  }, []);

  function generate() {
    const { max, min, includePrime } = config;
    let number = Math.floor(Math.random() * (max - min)) + min;

    // Check if we should exclude prime numbers
    if (!includePrime) {
      while (isPrime(number)) {
        number = Math.floor(Math.random() * (max - min)) + min;
      }
    }

    setNumber(number);
  }

  function isPrime(num: number): boolean {
    for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
      if (num % i === 0) return false;
    }
    return num > 1;
  }

  return (
    <>
      <h1>Another number generator</h1>
      <div className='button-row'>
        <button onClick={generate}>Generate</button>
        <button onClick={() => setModalOpen(!modalOpen)}>Options</button>
      </div>
      <div className='number'>
        {number}
      </div>
      <OptionsDialog
        open={modalOpen}
        existingConfig={config}
        onClose={(config) => {
          setModalOpen(false);
          setConfig(config);
        }}
      />
    </>
  )
}

export default App

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import './OptionsDialog.css';
import { DEFAULT_CONFIG } from './constants';

type OptionsDialogProps = {
  open: boolean,
  existingConfig: typeof DEFAULT_CONFIG,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: (config: any) => void,
}

export default function OptionsDialog(props: OptionsDialogProps) {
  const { open, existingConfig, onClose } = props;
  const [config, setConfig] = useState(existingConfig);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = dialogRef?.current;
    if (modal && open) {
      modal.showModal();
    }
  }, [open]);

  function updateConfig(field: string, event: ChangeEvent<HTMLInputElement>) {
    if (field === 'includePrime') {
      setConfig({
        ...config,
        [field]: !config.includePrime,
      });
    } else {
      setConfig({
        ...config,
        [field]: event.currentTarget.value,
      });
    }
  }

  return (
    <>
      <dialog ref={dialogRef} className='options-dialog'>
        <h2>Options</h2>
        <div className='inputs'>
          <div className='input-row'>
            <label htmlFor='min'>Minimum number</label>
            <input
              name='min'
              type='number'
              max={Number.MAX_SAFE_INTEGER}
              value={config.min}
              onChange={(e) => updateConfig('min', e)}
            />
          </div>
          <div className='input-row'>
            <label htmlFor='max'>Maxmimum number</label>
            <input
              name='max'
              type='number'
              min={0}
              value={config.max}
              onChange={(e) => updateConfig('max', e)}
            />
          </div>
          <div className='input-row'>
            <label htmlFor='include-prime'>Include prime numbers</label>
            <div className='checkbox-container'>
              <input
                name='include-prime'
                type='checkbox'
                checked={config.includePrime}
                onChange={(e) => updateConfig('includePrime', e)}
              />
            </div>
          </div>
        </div>
        <div className='footer-row'>
          <button
            onClick={() => {
              dialogRef.current?.close();
              onClose(config);
            }}
          >
            Save
          </button>
        </div>
      </dialog>
    </>
  );
}

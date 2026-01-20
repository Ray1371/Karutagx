//Should be temporary
import { useEffect, useState } from 'react';
import Modal from './Modal';
import { handleUpload } from './Upload';
import { uploadProgress } from './processSignals';
import type { Card } from './db';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UploadModal({ isOpen, onClose }: Props) {
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    return uploadProgress.subscribe(setProgress);
  }, []);

  const onPickFile = async (file?: File) => {
    if (!file || busy) return;

    setBusy(true);
    setFileName(file.name);
    uploadProgress.set(0);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed)) {
        alert('Expected a JSON array of cards.');
        return;
      }

      const cards = parsed as Card[];
      await handleUpload(cards);
      uploadProgress.set(100);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Could not read/parse that file as JSON.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Karuta file">
      <p style={{ marginTop: 0 }}>
        Select your Karuta export file to import into IndexedDB.
      </p>

      <input
        type="file"
        accept=".json"
        disabled={busy}
        onChange={(e) => onPickFile(e.target.files?.[0])}
      />

      {fileName && <p>Selected: <code>{fileName}</code></p>}
      <p>Progress: {progress}%</p>

      <button onClick={onClose} disabled={busy}>Close</button>
    </Modal>
  );
}

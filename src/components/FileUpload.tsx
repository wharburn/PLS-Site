import React, { useState, useEffect } from 'react';
import '../styles/FileUpload.css';

interface FileUploadProps {
  clientId: string;
  onUploadSuccess?: (filename: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ clientId, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  useEffect(() => {
    loadFiles();
  }, [clientId]);

  const loadFiles = async () => {
    try {
      const response = await fetch(`/api/files?clientId=${clientId}`);
      if (response.ok) {
        const files = await response.json();
        setUploadedFiles(files);
      }
    } catch (err) {
      console.error('Error loading files:', err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    setUploading(true);
    setMessage('Uploading...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('clientId', clientId);
      formData.append('filename', file.name);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      setMessage(`✅ Uploaded: ${result.filename}`);
      setFile(null);

      if (onUploadSuccess) {
        onUploadSuccess(result.filename || '');
      }

      // Reload files
      await loadFiles();
    } catch (err) {
      setMessage(`❌ ${String(err)}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="upload-zone">
        <label className="upload-label">
          <span className="upload-icon">📤</span>
          <strong>Drop file here or click to select</strong>
          <small>PDF, Image, or Document (Max 100MB)</small>
          <input
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {file && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#f0f4ff', borderRadius: '6px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500' }}>
            Selected: {file.name}
          </p>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn-upload"
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      )}

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="files-list">
          <h3>📁 Uploaded Files ({uploadedFiles.length})</h3>
          <ul>
            {uploadedFiles.map((file) => (
              <li key={file.name}>
                <span>
                  <strong>{file.name}</strong>
                  <br />
                  <small>{(file.size / 1024).toFixed(1)} KB</small>
                </span>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0057FF', textDecoration: 'none', fontWeight: '500' }}
                >
                  ↓
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

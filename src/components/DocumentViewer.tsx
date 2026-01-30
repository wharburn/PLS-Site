import React, { useState } from 'react';

interface DocumentViewerProps {
  document: any;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
  const [loading, setLoading] = useState(true);

  const getFileType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext;
  };

  const fileType = getFileType(document.filename);
  const storageUrl = `https://vbyxkoirudagvgnxgndk.supabase.co/storage/v1/object/public/statements/${document.storage_path}`;

  return (
    <div className="document-viewer-overlay" onClick={onClose}>
      <div className="document-viewer" onClick={(e) => e.stopPropagation()}>
        <div className="viewer-header">
          <h2>{document.filename}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="viewer-content">
          {loading && <div className="loading">Loading...</div>}

          {fileType === 'pdf' && (
            <iframe
              src={`${storageUrl}#toolbar=0`}
              type="application/pdf"
              width="100%"
              height="600"
              onLoad={() => setLoading(false)}
              style={{ border: 'none' }}
            />
          )}

          {['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType || '') && (
            <img
              src={storageUrl}
              alt={document.filename}
              onLoad={() => setLoading(false)}
              style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain' }}
            />
          )}

          {['txt', 'doc', 'docx'].includes(fileType || '') && (
            <div className="file-preview">
              <div className="file-info">
                <p>📄 {document.filename}</p>
                <p>Size: {document.file_size ? `${(document.file_size / 1024).toFixed(2)}KB` : 'Unknown'}</p>
                <p>Type: {fileType?.toUpperCase()}</p>
                <a href={storageUrl} download target="_blank" rel="noopener noreferrer" className="btn-download">
                  Download File
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="viewer-footer">
          <p>Uploaded: {new Date(document.uploaded_at).toLocaleString()}</p>
        </div>
      </div>

      <style>{`
        .document-viewer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .document-viewer {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 900px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .viewer-header {
          padding: 15px 20px;
          border-bottom: 1px solid #ddd;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .viewer-header h2 {
          margin: 0;
          font-size: 18px;
          color: #333;
          word-break: break-all;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
        }

        .close-btn:hover {
          color: #333;
        }

        .viewer-content {
          flex: 1;
          overflow: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .loading {
          text-align: center;
          color: #666;
        }

        .file-preview {
          background: #f9f9f9;
          padding: 40px;
          border-radius: 8px;
          text-align: center;
        }

        .file-info p {
          margin: 10px 0;
          color: #666;
        }

        .btn-download {
          display: inline-block;
          margin-top: 15px;
          padding: 10px 20px;
          background: #0057FF;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-download:hover {
          background: #0045cc;
        }

        .viewer-footer {
          padding: 10px 20px;
          border-top: 1px solid #ddd;
          background: #f5f5f5;
          font-size: 12px;
          color: #999;
        }
      `}</style>
    </div>
  );
};

export default DocumentViewer;

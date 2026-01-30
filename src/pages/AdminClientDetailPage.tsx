import React, { useState } from 'react';

const AdminClientDetailPage = () => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  return (
    <div className="mt-40 p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Client Details</h1>
      
      {/* Identity Documents */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6">Identity Documents</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-lg border border-slate-200 shadow text-center hover:shadow-lg transition">
            <div className="text-8xl mb-4">🛂</div>
            <h3 className="font-bold text-xl mb-2">Passport</h3>
            <p className="text-sm text-slate-600">Identity verification</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg border border-slate-200 shadow text-center hover:shadow-lg transition">
            <div className="text-8xl mb-4">🪪</div>
            <h3 className="font-bold text-xl mb-2">Driver's License</h3>
            <p className="text-sm text-slate-600">Driving credentials</p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6">Upload Documents</h2>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'
          }`}
          onDragOver={() => setDragOver(true)}
          onDragLeave={() => setDragOver(false)}
        >
          <div className="text-4xl mb-3">📤</div>
          <h3 className="font-bold text-lg mb-2">Drop files here</h3>
          <p className="text-sm text-slate-600">or click to browse</p>
          <input type="file" className="hidden" />
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            Select File
          </button>
          {uploadMessage && (
            <p className="text-green-600 text-sm mt-3">{uploadMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminClientDetailPage;

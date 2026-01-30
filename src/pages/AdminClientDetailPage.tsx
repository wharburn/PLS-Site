import React from 'react';

const AdminClientDetailPage = () => (
  <div className="mt-40 p-8 max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-8">Client Details</h1>
    
    <div className="grid grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🛂</div>
          <div>
            <h3 className="font-bold text-lg">Passport</h3>
            <p className="text-sm text-slate-600">Identity verification</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🪪</div>
          <div>
            <h3 className="font-bold text-lg">Driver's License</h3>
            <p className="text-sm text-slate-600">Driving credentials</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AdminClientDetailPage;

import React from 'react';

const CertificationsSection = ({ resumeData, setResumeData }) => {
  const handleChange = (index, field, value) => {
    const newCertifications = [...resumeData.certifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    setResumeData(prev => ({ ...prev, certifications: newCertifications }));
  };

  const addCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', issuer: '', date: '', expirationDate: '', credentialId: '', url: '' }]
    }));
  };

  const removeCertification = (index) => {
    const newCertifications = [...resumeData.certifications];
    newCertifications.splice(index, 1);
    setResumeData(prev => ({ ...prev, certifications: newCertifications }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Certifications (Optional)</h2>
        <button onClick={addCertification} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">+ Add Certification</button>
      </div>
      <div className="space-y-6">
        {resumeData.certifications.map((cert, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certification Name *</label>
                <input type="text" value={cert.name} onChange={(e) => handleChange(index, 'name', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="AWS Certified Solutions Architect" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization *</label>
                <input type="text" value={cert.issuer} onChange={(e) => handleChange(index, 'issuer', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Amazon Web Services" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Earned</label>
                <input type="month" value={cert.date} onChange={(e) => handleChange(index, 'date', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification URL</label>
                <input type="url" value={cert.url} onChange={(e) => handleChange(index, 'url', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="https://cert-verification-url.com" />
              </div>
            </div>
            <button onClick={() => removeCertification(index)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove Certification</button>
          </div>
        ))}
        {resumeData.certifications.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">No certifications added yet</p>
            <button onClick={addCertification} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">+ Add Your First Certification</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsSection;

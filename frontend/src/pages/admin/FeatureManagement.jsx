import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeatures, updateFeature } from '../../store/featureSlice';

const FeatureManagement = () => {
  const dispatch = useDispatch();
  const { features, isLoading } = useSelector(state => state.features);
  
  const [editingFeature, setEditingFeature] = useState(null);
  const [editedFeature, setEditedFeature] = useState({});
  
  useEffect(() => {
    dispatch(fetchFeatures());
  }, [dispatch]);
  
  const handleEdit = (feature) => {
    setEditingFeature(feature._id);
    setEditedFeature({ ...feature });
  };
  
  const handleCancel = () => {
    setEditingFeature(null);
    setEditedFeature({});
  };
  
  const handleSave = async () => {
    try {
      await dispatch(updateFeature(editedFeature)).unwrap();
      setEditingFeature(null);
      setEditedFeature({});
    } catch (error) {
      console.error('Error updating feature:', error);
    }
  };
  
  const handleInputChange = (field, value) => {
    setEditedFeature({
      ...editedFeature,
      [field]: value
    });
  };
  
  const handleRoleChange = (role, checked) => {
    const currentRoles = editedFeature.allowedRoles || [];
    let newRoles;
    
    if (checked) {
      newRoles = [...currentRoles, role];
    } else {
      newRoles = currentRoles.filter(r => r !== role);
    }
    
    setEditedFeature({
      ...editedFeature,
      allowedRoles: newRoles
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Feature Management</h1>
          <p className="mt-2 text-gray-600 text-lg">Control which features are available to users</p>
        </div>
        
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Features</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Feature
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Allowed Roles
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Daily Limit
                  </th>
                  <th scope="col" className="relative px-6 py-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {features.map((feature) => (
                  <tr key={feature._id} className="hover:bg-gray-50 transition-all duration-150">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-base font-bold text-gray-900">
                        {feature.featureName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {editingFeature === feature._id ? (
                        <div className="flex items-center">
                          <input
                            id="enabled"
                            name="enabled"
                            type="checkbox"
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={editedFeature.isEnabled}
                            onChange={(e) => handleInputChange('isEnabled', e.target.checked)}
                          />
                          <label htmlFor="enabled" className="ml-3 block text-base font-medium text-gray-900">
                            Enabled
                          </label>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full ${
                          feature.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {feature.isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {editingFeature === feature._id ? (
                        <div className="space-y-3">
                          {['user', 'admin', 'superadmin', 'fresher', 'experienced', 'tech', 'non-tech', 'student'].map((role) => (
                            <div key={role} className="flex items-center">
                              <input
                                id={`role-${role}`}
                                name={`role-${role}`}
                                type="checkbox"
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                checked={editedFeature.allowedRoles?.includes(role) || false}
                                onChange={(e) => handleRoleChange(role, e.target.checked)}
                              />
                              <label htmlFor={`role-${role}`} className="ml-3 block text-base text-gray-900">
                                {role}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-base font-medium text-gray-900">
                          {feature.allowedRoles && feature.allowedRoles.length > 0 
                            ? feature.allowedRoles.join(', ') 
                            : 'All users'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {editingFeature === feature._id ? (
                        <input
                          type="number"
                          min="0"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-base border-gray-300 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-md"
                          value={editedFeature.dailyLimit || 0}
                          onChange={(e) => handleInputChange('dailyLimit', parseInt(e.target.value) || 0)}
                        />
                      ) : (
                        <div className="text-base font-medium text-gray-900">
                          {feature.dailyLimit > 0 ? feature.dailyLimit : 'No limit'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      {editingFeature === feature._id ? (
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={handleSave}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-bold rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(feature)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Feature Descriptions */}
        <div className="mt-8 bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Feature Descriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Resume Generator</h3>
              <p className="text-gray-600">
                Allows users to generate complete resumes using AI based on job role and experience level.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Section Improver</h3>
              <p className="text-gray-600">
                Enables users to improve individual resume sections with AI-powered suggestions.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-2">ATS Score Checker</h3>
              <p className="text-gray-600">
                Allows users to check their resume compatibility with Applicant Tracking Systems.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Template Usage</h3>
              <p className="text-gray-600">
                Controls access to resume templates for building resumes.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-2">PDF Download</h3>
              <p className="text-gray-600">
                Allows users to download their resumes as PDF files.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-2">ODF Download</h3>
              <p className="text-gray-600">
                Allows users to download their resumes as ODF (.odt) files.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureManagement;
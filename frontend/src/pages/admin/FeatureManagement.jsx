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
  
  const handleSave = () => {
    dispatch(updateFeature({ 
      name: editedFeature.featureName, 
      featureData: {
        isEnabled: editedFeature.isEnabled,
        allowedRoles: editedFeature.allowedRoles,
        dailyLimit: editedFeature.dailyLimit
      }
    }));
    setEditingFeature(null);
  };
  
  const handleCancel = () => {
    setEditingFeature(null);
  };
  
  const handleInputChange = (field, value) => {
    setEditedFeature({ ...editedFeature, [field]: value });
  };
  
  const handleRoleChange = (role, checked) => {
    const roles = editedFeature.allowedRoles || [];
    if (checked) {
      setEditedFeature({ ...editedFeature, allowedRoles: [...roles, role] });
    } else {
      setEditedFeature({ ...editedFeature, allowedRoles: roles.filter(r => r !== role) });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Feature Management</h1>
          <p className="mt-2 text-gray-600">Control which features are available to users</p>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Features</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allowed Roles
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Daily Limit
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {features.map((feature) => (
                  <tr key={feature._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {feature.featureName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingFeature === feature._id ? (
                        <div className="flex items-center">
                          <input
                            id="enabled"
                            name="enabled"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={editedFeature.isEnabled}
                            onChange={(e) => handleInputChange('isEnabled', e.target.checked)}
                          />
                          <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
                            Enabled
                          </label>
                        </div>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          feature.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {feature.isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingFeature === feature._id ? (
                        <div className="space-y-2">
                          {['user', 'admin', 'superadmin', 'fresher', 'experienced', 'tech', 'non-tech', 'student'].map((role) => (
                            <div key={role} className="flex items-center">
                              <input
                                id={`role-${role}`}
                                name={`role-${role}`}
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                checked={editedFeature.allowedRoles?.includes(role) || false}
                                onChange={(e) => handleRoleChange(role, e.target.checked)}
                              />
                              <label htmlFor={`role-${role}`} className="ml-2 block text-sm text-gray-900">
                                {role}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">
                          {feature.allowedRoles && feature.allowedRoles.length > 0 
                            ? feature.allowedRoles.join(', ') 
                            : 'All users'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingFeature === feature._id ? (
                        <input
                          type="number"
                          min="0"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={editedFeature.dailyLimit || 0}
                          onChange={(e) => handleInputChange('dailyLimit', parseInt(e.target.value) || 0)}
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {feature.dailyLimit > 0 ? feature.dailyLimit : 'No limit'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingFeature === feature._id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(feature)}
                          className="text-indigo-600 hover:text-indigo-900"
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
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Feature Descriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-900">AI Resume Generator</h3>
              <p className="mt-1 text-sm text-gray-500">
                Allows users to generate complete resumes using AI based on job role and experience level.
              </p>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-900">AI Section Improver</h3>
              <p className="mt-1 text-sm text-gray-500">
                Enables users to improve individual resume sections with AI-powered suggestions.
              </p>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-900">ATS Score Checker</h3>
              <p className="mt-1 text-sm text-gray-500">
                Allows users to check their resume compatibility with Applicant Tracking Systems.
              </p>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-900">Template Usage</h3>
              <p className="mt-1 text-sm text-gray-500">
                Controls access to resume templates for building resumes.
              </p>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-900">PDF Download</h3>
              <p className="mt-1 text-sm text-gray-500">
                Allows users to download their resumes as PDF files.
              </p>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-900">ODF Download</h3>
              <p className="mt-1 text-sm text-gray-500">
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
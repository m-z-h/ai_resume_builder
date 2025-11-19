import React, { useState } from 'react';

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Professional', category: 'Business', isFree: true, price: 0, isActive: true, usedBy: 124 },
    { id: 2, name: 'Creative', category: 'Creative', isFree: false, price: 9.99, isActive: true, usedBy: 87 },
    { id: 3, name: 'Minimalist', category: 'General', isFree: true, price: 0, isActive: false, usedBy: 210 },
    { id: 4, name: 'Executive', category: 'Business', isFree: false, price: 14.99, isActive: true, usedBy: 65 },
    { id: 5, name: 'Modern', category: 'Technical', isFree: true, price: 0, isActive: true, usedBy: 156 },
    { id: 6, name: 'Academic', category: 'General', isFree: false, price: 7.99, isActive: true, usedBy: 92 }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'General',
    isFree: true,
    price: 0,
    isActive: true
  });
  
  const handleStatusChange = (templateId, newStatus) => {
    setTemplates(templates.map(template => 
      template.id === templateId ? { ...template, isActive: newStatus } : template
    ));
  };
  
  const handleAddTemplate = () => {
    const template = {
      id: templates.length + 1,
      ...newTemplate,
      usedBy: 0
    };
    setTemplates([...templates, template]);
    setNewTemplate({
      name: '',
      category: 'General',
      isFree: true,
      price: 0,
      isActive: true
    });
    setShowAddModal(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Template Management</h1>
          <p className="mt-2 text-gray-600">Manage resume templates and their availability</p>
        </div>
        
        {/* Add Template Button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Template
          </button>
        </div>
        
        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.category}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    template.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    {template.isFree ? 'Free' : `$${template.price}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Used by {template.usedBy} users
                  </p>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => handleStatusChange(template.id, !template.isActive)}
                    className={`text-sm font-medium ${
                      template.isActive ? 'text-red-600 hover:text-red-500' : 'text-green-600 hover:text-green-500'
                    }`}
                  >
                    {template.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <div className="flex space-x-2">
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      Edit
                    </button>
                    <button className="text-sm font-medium text-red-600 hover:text-red-500">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Add Template Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New Template
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Template Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={newTemplate.category}
                          onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                        >
                          <option value="General">General</option>
                          <option value="Business">Business</option>
                          <option value="Creative">Creative</option>
                          <option value="Technical">Technical</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="isFree"
                          name="isFree"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={newTemplate.isFree}
                          onChange={(e) => setNewTemplate({...newTemplate, isFree: e.target.checked})}
                        />
                        <label htmlFor="isFree" className="ml-2 block text-sm text-gray-900">
                          Free Template
                        </label>
                      </div>
                      
                      {!newTemplate.isFree && (
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Price ($)
                          </label>
                          <input
                            type="number"
                            name="price"
                            id="price"
                            min="0"
                            step="0.01"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={newTemplate.price}
                            onChange={(e) => setNewTemplate({...newTemplate, price: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <input
                          id="isActive"
                          name="isActive"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={newTemplate.isActive}
                          onChange={(e) => setNewTemplate({...newTemplate, isActive: e.target.checked})}
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                          Active
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddTemplate}
                >
                  Add Template
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManagement;
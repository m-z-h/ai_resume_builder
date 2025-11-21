import React, { useState } from 'react';
import AIGenerateButton from '../../../components/AIGenerateButton';
import axios from 'axios';

const ProjectsSection = ({ resumeData, setResumeData }) => {
  const [aiLoading, setAiLoading] = useState(null);

  const handleChange = (index, field, value) => {
    const newProjects = [...resumeData.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setResumeData(prev => ({ ...prev, projects: newProjects }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: [], url: '', startDate: '', endDate: '' }]
    }));
  };

  const removeProject = (index) => {
    const newProjects = [...resumeData.projects];
    newProjects.splice(index, 1);
    setResumeData(prev => ({ ...prev, projects: newProjects }));
  };

  const generateDescription = async (index) => {
    setAiLoading(index);
    try {
      const project = resumeData.projects[index];
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ai/generateProjectDescription',
        { projectTitle: project.name, technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies, projectPurpose: project.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        handleChange(index, 'description', response.data.data.description);
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <button onClick={addProject} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">+ Add Project</button>
      </div>
      <div className="space-y-6">
        {resumeData.projects.map((project, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                <input type="text" value={project.name} onChange={(e) => handleChange(index, 'name', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Project Name" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
                <input type="url" value={project.url} onChange={(e) => handleChange(index, 'url', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="https://project-url.com" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Technologies Used</label>
              <input type="text" value={Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies} onChange={(e) => handleChange(index, 'technologies', e.target.value.split(',').map(t => t.trim()))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="React, Node.js, MongoDB" />
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <AIGenerateButton onClick={() => generateDescription(index)} loading={aiLoading === index} text="Generate Description" />
              </div>
              <textarea rows={4} value={project.description} onChange={(e) => handleChange(index, 'description', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Describe the project, your role, and key achievements..."></textarea>
            </div>
            <button onClick={() => removeProject(index)} className="text-red-600 hover:text-red-800 text-sm font-medium">Remove Project</button>
          </div>
        ))}
        {resumeData.projects.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">No projects added yet</p>
            <button onClick={addProject} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">+ Add Your First Project</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;

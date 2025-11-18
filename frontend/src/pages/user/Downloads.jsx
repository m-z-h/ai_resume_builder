import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { downloadResumePdf, downloadResumeOdf, downloadResumeDocx } from '../../store/resumeSlice';
import { useMultipleFeatureCheck } from '../../hooks/useFeatureCheck';

const Downloads = () => {
  const dispatch = useDispatch();
  const { features } = useSelector(state => state.features);
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Check which download features are enabled
  const featureStatus = useMultipleFeatureCheck(['pdfDownload', 'odfDownload', 'docxDownload']);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const response = await axios.get('/api/resumes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Transform the data to match the existing structure
        const transformedResumes = response.data.map(resume => ({
          id: resume._id,
          title: resume.title,
          template: resume.templateId?.name || 'Default',
          createdAt: resume.createdAt,
          lastModified: resume.updatedAt,
          formats: ['PDF', 'ODT', 'DOCX'], // All formats available
          status: resume.isPublished ? 'published' : 'draft'
        }));
        
        setDownloads(transformedResumes);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        // Fallback to mock data if API call fails
        setDownloads([
          {
            id: 1,
            title: 'Software Engineer Resume',
            template: 'Professional',
            createdAt: '2023-05-15T10:30:00Z',
            lastModified: '2023-05-20T14:22:00Z',
            formats: ['PDF', 'ODT'],
            status: 'completed'
          },
          {
            id: 2,
            title: 'Marketing Manager Resume',
            template: 'Modern',
            createdAt: '2023-04-22T09:15:00Z',
            lastModified: '2023-05-10T11:30:00Z',
            formats: ['PDF', 'ODT', 'DOCX'],
            status: 'completed'
          },
          {
            id: 3,
            title: 'Data Analyst Resume',
            template: 'Technical',
            createdAt: '2023-03-18T16:45:00Z',
            lastModified: '2023-03-25T09:20:00Z',
            formats: ['PDF'],
            status: 'completed'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleDownload = async (resumeId, format) => {
    // Check if the download feature is enabled
    let featureEnabled = false;
    switch (format) {
      case 'PDF':
        featureEnabled = featureStatus.pdfDownload;
        break;
      case 'ODT':
        featureEnabled = featureStatus.odfDownload;
        break;
      case 'DOCX':
        featureEnabled = featureStatus.docxDownload;
        break;
    }
    
    if (!featureEnabled) {
      alert(`${format} download is currently disabled.`);
      return;
    }
    
    try {
      switch (format) {
        case 'PDF':
          await dispatch(downloadResumePdf(resumeId)).unwrap();
          break;
        case 'ODT':
          await dispatch(downloadResumeOdf(resumeId)).unwrap();
          break;
        case 'DOCX':
          await dispatch(downloadResumeDocx(resumeId)).unwrap();
          break;
        default:
          alert(`Unsupported format: ${format}`);
          return;
      }
      // In a real implementation, this would trigger a file download
      alert(`${format} download started!`);
    } catch (error) {
      alert(`Error downloading ${format}: ${error}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Downloads</h1>
          <p className="mt-2 text-gray-600">Manage and download your resume files</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Downloadable Resumes ({downloads.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resume Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Modified
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Formats
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {downloads.map((download) => (
                    <tr key={download.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{download.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{download.template}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(download.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(download.lastModified)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-2">
                          {download.formats
                            .filter(format => {
                              if (format === 'PDF') return featureStatus.pdfDownload;
                              if (format === 'ODT') return featureStatus.odfDownload;
                              if (format === 'DOCX') return featureStatus.docxDownload;
                              return true;
                            })
                            .map((format, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {format}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          {download.formats
                            .filter(format => {
                              if (format === 'PDF') return featureStatus.pdfDownload;
                              if (format === 'ODT') return featureStatus.odfDownload;
                              if (format === 'DOCX') return featureStatus.docxDownload;
                              return true;
                            })
                            .map((format, index) => (
                              <button
                                key={index}
                                onClick={() => handleDownload(download.id, format)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Download {format}
                              </button>
                            ))}
                          <Link to={`/resume/builder/${download.id}`} className="text-gray-600 hover:text-gray-900">
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {downloads.length === 0 && (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No downloads available</h3>
                <p className="mt-1 text-sm text-gray-500">Create your first resume to get started.</p>
                <div className="mt-6">
                  <Link
                    to="/resume/builder"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Create Resume
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Downloads;
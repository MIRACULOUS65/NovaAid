import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, Loader2, CheckCircle, Settings } from 'lucide-react';
import fraudDetectionService from '../services/fraudDetectionService';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processingStatus, setProcessingStatus] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      setSelectedFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please drop a valid image file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image to upload');
      return;
    }

    setLoading(true);
    setError('');
    setProcessingStatus('Loading AI models...');

    try {
      console.log('🚀 Starting fraud detection process');
      
      setProcessingStatus('Detecting face in image...');
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX
      
      const result = await fraudDetectionService.detectFraud(selectedFile);
      
      console.log('📋 Detection result:', result);
      
      if (result.success) {
        setProcessingStatus('Analysis complete! Redirecting...');
        console.log('✅ Navigating to results page with data:', result);
        
        // Small delay to show success message
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Navigate to results page with detection data
        navigate('/results', { 
          state: { detection: result },
          replace: false
        });
      } else {
        console.error('❌ Detection failed:', result.error);
        setError(result.error || 'Failed to process the image');
        setProcessingStatus('');
        setLoading(false);
      }
    } catch (err) {
      console.error('💥 Exception during detection:', err);
      setError(`An error occurred: ${err.message}. Check console for details.`);
      setProcessingStatus('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg-dark flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Fraud Detection System
          </h1>
          <p className="text-gray-400">
            Upload a user image to verify authenticity
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit}>
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors duration-300 cursor-pointer"
              onClick={() => document.getElementById('fileInput').click()}
            >
              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg shadow-lg"
                  />
                  <p className="text-green-400 flex items-center justify-center gap-2">
                    <CheckCircle size={20} />
                    Image selected
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="mx-auto text-gray-400" size={64} />
                  <div>
                    <p className="text-white text-lg mb-2">
                      Drop your image here or click to browse
                    </p>
                    <p className="text-gray-400 text-sm">
                      Supports: JPG, PNG, GIF, WEBP
                    </p>
                  </div>
                </div>
              )}
              
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Processing Status */}
            {loading && processingStatus && (
              <div className="mt-4 p-4 bg-blue-900 bg-opacity-50 border border-blue-500 rounded-lg flex items-start gap-3">
                <Loader2 className="text-blue-400 flex-shrink-0 mt-0.5 animate-spin" size={20} />
                <p className="text-blue-200">{processingStatus}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="mt-6 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Analyze Image
                </>
              )}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-white font-semibold mb-3">How it works:</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Upload a clear image of the user's face</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Our AI compares the face with registered users in the database</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Get instant fraud detection results with confidence score</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">ℹ️</span>
                <span className="text-green-300">Works in demo mode without Firebase setup (check console for details)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Admin Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/admin')}
            className="text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <Settings size={16} />
            <span className="text-sm">Register New Users (Admin)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;

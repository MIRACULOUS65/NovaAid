import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import fraudDetectionService from '../services/fraudDetectionService';

/**
 * Admin page for registering legitimate users in the system
 * This page is optional but useful for initial setup
 */
const AdminPage = () => {
  console.log('🔧 Admin page loaded');
  const [userName, setUserName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  console.log('Admin page state:', { userName, selectedFile: !!selectedFile, loading });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file' });
        return;
      }
      
      setSelectedFile(file);
      setMessage({ type: '', text: '' });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Form submitted');
    
    if (!userName.trim()) {
      console.log('❌ Validation failed: No user name');
      setMessage({ type: 'error', text: 'Please enter a user name' });
      return;
    }

    if (!selectedFile) {
      console.log('❌ Validation failed: No image selected');
      setMessage({ type: 'error', text: 'Please select an image' });
      return;
    }

    console.log(`🚀 Starting registration for: ${userName}`);
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await fraudDetectionService.registerUser(userName, selectedFile);
      console.log('📋 Registration result:', result);
      
      if (result.success) {
        console.log(`✅ ${userName} registered successfully`);
        setMessage({ 
          type: 'success', 
          text: result.message || `Successfully registered ${userName}! You can now use this user for fraud detection.` 
        });
        
        // Reset form
        setUserName('');
        setSelectedFile(null);
        setPreview(null);
        
        // Reset file input
        const fileInput = document.getElementById('adminFileInput');
        if (fileInput) fileInput.value = '';
      } else {
        console.error('❌ Registration failed:', result.error);
        setMessage({ type: 'error', text: result.error || 'Failed to register user' });
      }
    } catch (err) {
      console.error('💥 Exception during registration:', err);
      setMessage({ type: 'error', text: `An error occurred: ${err.message}` });
    } finally {
      setLoading(false);
      console.log('✋ Registration process completed');
    }
  };

  return (
    <div className="min-h-screen gradient-bg-dark p-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Register Legitimate User
          </h1>
          <p className="text-gray-400">
            Add verified users to the fraud detection database
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit}>
            {/* User Name Input */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                User Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter user's full name"
                className="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                User Photo
              </label>
              <div
                className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-purple-500 transition-colors duration-300 cursor-pointer"
                onClick={() => document.getElementById('adminFileInput').click()}
              >
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg shadow-lg"
                    />
                    <p className="text-green-400 flex items-center justify-center gap-2">
                      <CheckCircle size={20} />
                      Image selected
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <UserPlus className="mx-auto text-gray-400" size={48} />
                    <p className="text-white">Click to select user photo</p>
                    <p className="text-gray-400 text-sm">
                      Ensure the photo is clear and shows the face directly
                    </p>
                  </div>
                )}
                
                <input
                  id="adminFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Message */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                message.type === 'success' 
                  ? 'bg-green-900 bg-opacity-50 border border-green-500' 
                  : 'bg-red-900 bg-opacity-50 border border-red-500'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
                ) : (
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                )}
                <p className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
                  {message.text}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Registering User...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Register User
                </>
              )}
            </button>
          </form>

          {/* Demo Mode Notice */}
          <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 border border-blue-600 rounded-lg">
            <p className="text-blue-200 text-sm">
              <strong>ℹ️ Demo Mode:</strong> Users will be stored in your browser's local storage since Firebase is not configured. 
              They will work for fraud detection during this session. For permanent storage across devices, enable Firebase Storage and Firestore.
            </p>
          </div>

          {/* Info Section */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-white font-semibold mb-3">Registration Guidelines:</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Use clear, well-lit photos with the face directly facing the camera</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Ensure the entire face is visible without obstructions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Register only verified, legitimate users for accurate fraud detection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span>Each registered user will be used as a reference for future comparisons</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span className="text-green-300">Works in demo mode - registered users persist in browser until you clear data</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, ArrowLeft, Shield, TrendingUp, Clock } from 'lucide-react';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const detection = location.state?.detection;

  console.log('📊 Results page loaded');
  console.log('Location state:', location.state);
  console.log('Detection data:', detection);

  if (!detection) {
    console.error('❌ No detection data found in location state');
    return (
      <div className="min-h-screen gradient-bg-dark flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="mx-auto text-red-400 mb-4" size={64} />
          <p className="text-white text-xl mb-2">No detection data available</p>
          <p className="text-gray-400 mb-6">The fraud detection result could not be loaded.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back to Upload
          </button>
        </div>
      </div>
    );
  }

  console.log('✅ Rendering results for detection:', detection.detectionId);

  const { isFraud, confidenceScore, matchedUserName, similarity, timestamp, imageUrl } = detection;

  const getStatusColor = () => {
    if (isFraud) {
      return 'from-red-600 to-orange-600';
    }
    return 'from-green-600 to-emerald-600';
  };

  const getStatusIcon = () => {
    if (isFraud) {
      return <AlertTriangle size={48} className="text-red-400" />;
    }
    return <CheckCircle size={48} className="text-green-400" />;
  };

  const getStatusText = () => {
    if (isFraud) {
      return 'FRAUD DETECTED';
    }
    return 'VERIFIED USER';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen gradient-bg-dark p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          Back to Upload
        </button>

        {/* Main Result Card */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Status Banner */}
          <div className={`bg-gradient-to-r ${getStatusColor()} p-6 text-center`}>
            <div className="flex justify-center mb-3">
              {getStatusIcon()}
            </div>
            <h1 className="text-3xl font-bold text-white">
              {getStatusText()}
            </h1>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Preview */}
              <div>
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-purple-400" />
                  Uploaded Image
                </h2>
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Analyzed"
                    className="w-full rounded-lg shadow-lg border border-gray-700"
                  />
                )}
              </div>

              {/* Detection Details */}
              <div className="space-y-6">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-purple-400" />
                  Detection Results
                </h2>

                {/* Fraud Status */}
                <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Fraud Status</span>
                    <span className={`font-bold ${isFraud ? 'text-red-400' : 'text-green-400'}`}>
                      {isFraud ? 'FRAUD' : 'LEGITIMATE'}
                    </span>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400">Confidence Score</span>
                    <span className="text-white font-bold text-xl">
                      {confidenceScore.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getStatusColor()} transition-all duration-500`}
                      style={{ width: `${Math.min(confidenceScore, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Similarity Score */}
                <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Similarity Match</span>
                    <span className="text-white font-bold">
                      {similarity.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Matched User */}
                {matchedUserName && matchedUserName !== 'Unknown' && (
                  <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Closest Match</span>
                      <span className="text-white font-bold">
                        {matchedUserName}
                      </span>
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock size={16} />
                    <span>Analyzed on {formatDate(timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="mt-8 p-6 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700">
              <h3 className="text-white font-semibold mb-3">Recommendation:</h3>
              <p className="text-gray-400">
                {isFraud ? (
                  <>
                    This user appears to be fraudulent or not registered in the system. 
                    The confidence score indicates a <strong className="text-red-400">high likelihood of fraud</strong>. 
                    We recommend additional verification steps before proceeding.
                  </>
                ) : (
                  <>
                    This user has been successfully verified against the registered database. 
                    The confidence score indicates a <strong className="text-green-400">legitimate user</strong>. 
                    You may proceed with confidence.
                  </>
                )}
              </p>
            </div>

            {/* Demo Mode Notice */}
            {matchedUserName === 'Demo Mode' && (
              <div className="mt-6 p-4 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>⚠️ Demo Mode:</strong> No registered users found in the database. 
                  The similarity score shown is simulated. Please visit the{' '}
                  <button
                    onClick={() => navigate('/admin')}
                    className="underline hover:text-yellow-100"
                  >
                    Admin Page
                  </button>
                  {' '}to register legitimate users for accurate fraud detection.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                Analyze Another Image
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-gray-800 bg-opacity-30 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
          <h3 className="text-white font-semibold mb-3">About the Detection:</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>
                <strong className="text-white">Fraud Status:</strong> Indicates whether the uploaded image matches a registered user
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>
                <strong className="text-white">Confidence Score:</strong> Shows how certain the system is about its decision (higher is more certain)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span>
                <strong className="text-white">Similarity Match:</strong> Percentage of facial feature similarity with the closest registered user
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;

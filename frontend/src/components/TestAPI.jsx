import { useState } from 'react';
import { checkAuth, loginWithSteam, getUserProfile } from '../services/api';

function TestAPI() {
  const [authStatus, setAuthStatus] = useState(null);
  const [profile, setProfile] = useState(null);

  const handleCheckAuth = async () => {
    try {
      const data = await checkAuth();
      setAuthStatus(data);
      console.log('Auth Status:', data);
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleGetProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
      console.log('Profile:', data);
    } catch (error) {
      console.error('Get profile failed:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={() => loginWithSteam()}
          className="bg-steam-blue text-white px-4 py-2 rounded"
        >
          Login with Steam
        </button>

        <button
          onClick={handleCheckAuth}
          className="bg-green-500 text-white px-4 py-2 rounded ml-2"
        >
          Check Auth
        </button>

        <button
          onClick={handleGetProfile}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
        >
          Get Profile
        </button>
      </div>

      {authStatus && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <h2 className="font-bold">Auth Status:</h2>
          <pre>{JSON.stringify(authStatus, null, 2)}</pre>
        </div>
      )}

      {profile && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <h2 className="font-bold">Profile:</h2>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default TestAPI;
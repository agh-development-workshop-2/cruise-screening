import React, { useEffect, useState } from 'react';
import Base from '../base/Base';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { accessToken, deleteAccount } = useAuth();
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileResponse = await api.get('/profile/', {
            
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setUserData(profileResponse.data);

        const orgResponse = await api.get(`/find_organisations/${profileResponse.data.id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setOrganizations(orgResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user profile or organizations.');
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleDeleteAccount = async () => {
    if(deleteAccount()) {
        alert('Account deleted successfully!');
        navigate('/login')
    } else {
      setError('Failed to delete account.');
    }
  }

  const to_edit = () => {
    navigate("/edit_profile")
  }

  if (loading) {
    return  (
        <Base>
        <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg my-12 flex justify-center items-center">
            <div className="spinner is-centered animate-spin border-t-4 border-orange-600 border-solid rounded-full w-16 h-16"></div>
        </div>
        </Base>
    );
  }

  if (error) {
    return <Base>{error}</Base>;
  }

  return (
    <Base>
      <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg my-12">
        <h1 className="text-3xl font-bold text-orange-600 text-center mb-8">User Profile</h1>
        <div className="text-gray-800 text-base space-y-4">
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>First Name:</strong> {userData.first_name}</p>
          <p><strong>Last Name:</strong> {userData.last_name}</p>
          <p><strong>Date of Birth:</strong> {userData.date_of_birth || 'Not provided'}</p>
          <p><strong>Location:</strong> {userData.location || 'Not provided'}</p>
          <p><strong>Languages:</strong> {userData.languages?.map((x) => x.name).join(', ') || 'Not provided'}</p>
          <p><strong>Knowledge Areas:</strong> {userData.knowledge_areas?.map((x) => x.name).join(', ') || 'Not provided'}</p>
          <p><strong>Allow Logging:</strong> {userData.allow_logging ? 'Yes' : 'No'}</p>
        </div>
        <hr className="my-6" />
        <div>
          <h2 className="text-xl font-bold mb-4">Organizations</h2>
          {organizations?.length > 0 ? (
            <div className="flex flex-wrap">
              {organizations.map((org) => (
                <a
                  key={org.id}
                  href={`/view_organisation/${org.id}`}
                  className="tag m-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full hover:bg-orange-200"
                >
                  {org.title}
                </a>
              ))}
            </div>
          ) : (
            <p>No organizations found.</p>
          )}
        </div>
        <div className="mt-8 flex space-x-4">
          <a onClick={to_edit} className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition">
            Edit Profile
          </a>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
    </Base>
  );
};

export default UserProfile;
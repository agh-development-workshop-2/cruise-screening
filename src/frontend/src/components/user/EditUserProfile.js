
import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Base from '../base/Base';
import { useNavigate } from 'react-router-dom';
import MultipleSelection from "../utils/MultipleSelection";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    location: '',
    allow_logging: false,
    date_of_birth: '',
    languages: [],
    knowledge_areas: [],
  });
  const [languagesOptions, setLanguagesOptions] = useState([]);
  const [knowledgeAreasOptions, setKnowledgeAreasOptions] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch user profile data
        const profileResponse = await api.get('/profile/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        // Fetch options for languages and knowledge areas
        const languagesResponse = await api.get('/languages/');
        const knowledgeAreasResponse = await api.get('/knowledge_areas/');

        setFormData(profileResponse.data);
        setLanguagesOptions(languagesResponse.data);
        setKnowledgeAreasOptions(knowledgeAreasResponse.data);
        setLoading(false);
    } catch (err) {
        setError('Failed to load user profile or organizations.');
        setLoading(false);
        setMessage('Failed to load profile or options.');
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'select-multiple') {
      const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
      setFormData({ ...formData, [name]: selectedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const setSelectedLanguages = (selected) => {
    setFormData({ ...formData, languages: selected });
  }
  const setKnowledgeAreas = (selected) => {
    setFormData({ ...formData, knowledge_areas: selected });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestBody = { ...formData, languages: formData.languages.map((x) => x.id), knowledge_areas: formData.knowledge_areas.map((x) => x.id)};
    
    try {
      const response = await api.post('/edit_profile/', requestBody, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (response.status != 200){
        throw response
      }
      setMessage(response.data.message || 'Profile updated successfully!');
      navigate("/profile");
    } catch (err) {
      setMessage('Failed to update profile.');
    }
  };

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
        <h1 className="text-3xl font-bold text-orange-600 text-center mb-8">Edit Profile</h1>
        {message && <p className="text-center text-red-600 mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 border rounded-md"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="allow_logging"
              checked={formData.allow_logging}
              onChange={handleChange}
            />
            <label>
              Allow Logging (This helps improve the quality of the search engine.)
            </label>
          </div>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth ?? ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          <label>Languages</label>
            <MultipleSelection
                hint="Select languages"
                options={languagesOptions}
                selectedOptions={formData.languages}
                onChange={setSelectedLanguages}
            />
          <label>Knowledge Areas</label>
          <MultipleSelection
                hint="Select knowledge areas"
                options={knowledgeAreasOptions}
                selectedOptions={formData.knowledge_areas}
                onChange={setKnowledgeAreas}
            />
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition"
            >
              Save Changes
            </button>
      
            <a onClick={()=>navigate("/profile")} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </Base>
  );
};

export default EditProfile;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Base from '../base/Base';

const AddMember = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [availableUsers, setAvailableUsers] = useState([]); 
    const [selectedUser, setSelectedUser] = useState(null); 
    const [role, setRole] = useState('ME'); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

   
    const fetchUsers = async (query) => {
        if (query.trim() === '') {
            setAvailableUsers([]); 
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/users/search/?query=${query}`); 
            setAvailableUsers(response.data); 
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('An error occurred while searching for users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchQuery.trim()) {
            fetchUsers(searchQuery); 
        } else {
            setAvailableUsers([]); 
        }
    }, [searchQuery]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) {
            setError('Please select a user.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.post(`/organisations/${id}/members/add/`, {
                user_id: selectedUser,
                role,
            });

            if (response.status === 200) {
                navigate(`/organisations/${id}`); 
            } else {
                setError('An error occurred while adding the member.');
            }
        } catch (err) {
            console.error('Error adding member:', err);
            setError('An error occurred while adding the member.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Base>
            <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg my-12">
                <h1 className="text-3xl font-bold text-orange-600 text-center mb-8">
                    Add New Member to Organisation
                </h1>

                {error && <p className="text-red-600 mb-6">{error}</p>}

                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-6">
                        <label className="block text-lg font-semibold text-gray-800">Search User</label>
                        <input
                            type="text"
                            className="input w-full p-2 border border-gray-300 rounded mt-2"
                            placeholder="Start typing to search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                    </div>

                    
                    {availableUsers.length > 0 && (
                        <div className="mb-6">
                            <label className="block text-lg font-semibold text-gray-800">Select User</label>
                            <ul className="border border-gray-300 rounded mt-2 max-h-60 overflow-y-auto">
                                {availableUsers.map((user) => (
                                    <li
                                        key={user.id}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => setSelectedUser(user.id)} 
                                    >
                                        {user.username} ({user.first_name} {user.last_name})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    
                    {selectedUser && (
                        <div className="mb-6">
                            <label className="block text-lg font-semibold text-gray-800">Selected User</label>
                            <p className="mt-2">{availableUsers.find((user) => user.id === selectedUser)?.username}</p>
                        </div>
                    )}

                    
                    <div className="mb-6">
                        <label className="block text-lg font-semibold text-gray-800">Role</label>
                        <select
                            className="select w-full p-2 border border-gray-300 rounded mt-2"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="AD">Admin</option>
                            <option value="ME">Member</option>
                            <option value="GU">Guest</option>
                        </select>
                    </div>

                    
                    <div className="flex justify-end gap-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-500"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Member'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <button
                        className="button is-light"
                        onClick={() => navigate(`/organisations/${id}`)}
                    >
                        Back to Organisation
                    </button>
                </div>
            </div>
        </Base>
    );
};

export default AddMember;

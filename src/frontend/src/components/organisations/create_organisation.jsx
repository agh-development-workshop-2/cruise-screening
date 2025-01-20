import React, { useState, useEffect } from 'react';
import Base from '../base/Base';
import api from '../../api/api'; 

function CreateOrganisation() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [admins, setAdmins] = useState([]); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [suggestedUsers, setSuggestedUsers] = useState([]); 
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    
    const fetchUsers = async (query) => {
        try {
            const response = await api.get(`/users/search/?query=${query}`); 
            setSuggestedUsers(response.data); 
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    
    useEffect(() => {
        if (searchQuery.trim()) {
            fetchUsers(searchQuery);
        } else {
            setSuggestedUsers([]);
        }
    }, [searchQuery]);

    const handleAddAdmin = (user) => {
        if (!admins.some((admin) => admin.id === user.id)) {
            setAdmins([...admins, user]);
        }
        setSearchQuery(''); 
        setSuggestedUsers([]);
    };

    const handleRemoveAdmin = (userId) => {
        setAdmins(admins.filter((admin) => admin.id !== userId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const response = await api.post('/organisations/', {
                title,
                description,
                admins: admins.map((admin) => admin.id), 
            });
            setSuccessMessage('Organisation created successfully!');
            setTitle('');
            setDescription('');
            setAdmins([]);
        } catch (error) {
            console.error('Error creating organisation:', error);
            setErrorMessage('Failed to create organisation. Please try again.');
        }
    };

    return (
        <Base>
            <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg my-12">
                <h1 className="text-3xl font-bold text-orange-600 text-center mb-8">Create New Organisation</h1>

                {errorMessage && (
                    <div className="mb-4 p-3 text-red-800 bg-red-100 border border-red-300 rounded">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 text-green-800 bg-green-100 border border-green-300 rounded">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
                            Organisation Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            className="w-full p-2 border rounded"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            className="w-full p-2 border rounded"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Search for Administrators</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            placeholder="Type to search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <ul className="mt-2 border rounded bg-white shadow">
                            {suggestedUsers.map((user) => (
                                <li
                                    key={user.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleAddAdmin(user)}
                                >
                                    {user.username} ({user.email})
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Selected Administrators</label>
                        <ul className="list-disc pl-5">
                            {admins.map((admin) => (
                                <li key={admin.id} className="flex items-center justify-between">
                                    <span>
                                        {admin.username} ({admin.email})
                                    </span>
                                    <button
                                        type="button"
                                        className="text-red-600 hover:underline"
                                        onClick={() => handleRemoveAdmin(admin.id)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button type="submit" className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-500">
                        Create Organisation
                    </button>
                </form>
            </div>
        </Base>
    );
}

export default CreateOrganisation;

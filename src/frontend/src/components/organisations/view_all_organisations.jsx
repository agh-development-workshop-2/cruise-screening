import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api'; 
import Base from '../base/Base';

const Organisations = () => {
    const navigate = useNavigate();
    const [organisations, setOrganisations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrganisations = async () => {
            try {
                const response = await api.get('/organisations/'); 
                setOrganisations(response.data || []);
            } catch (err) {
                console.error('Error fetching organisations:', err);
                setError('An error occurred while fetching organisations.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrganisations();
    }, []);

    if (loading) {
        return (
            <Base>
                <div className="max-w-5xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg my-12">
                    <p>Loading...</p>
                </div>
            </Base>
        );
    }

    if (error) {
        return (
            <Base>
                <div className="max-w-5xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg my-12">
                    <p className="notification is-danger">{error}</p>
                </div>
            </Base>
        );
    }

    return (
        <Base>
            <div className="max-w-5xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg my-12">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Organisations</h1>
                    <button
                        className="button is-link"
                        onClick={() => navigate('/organisations/new')}
                    >
                        Create new organisation
                    </button>
                </div>

                <table className="table is-striped is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Members</th>
                            <th>Reviews</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organisations.map((organisation, index) => (
                            <tr key={organisation.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <a href={`/organisations/${organisation.id}`}>
                                        {organisation.title}
                                    </a>
                                </td>
                                <td>{organisation.description}</td>
                                <td>{organisation.number_of_members}</td>
                                <td>{organisation.n_reviews}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Base>
    );
};

export default Organisations;

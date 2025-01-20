import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api'; 
import Base from '../base/Base';

const Organisation = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    const [organisation, setOrganisation] = useState(null);
    const [members, setMembers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/organisations/${id}/`); 
                const { organisation, members, literature_reviews, current_user_role } = response.data;

                if (organisation) {
                    setOrganisation(organisation);
                    setMembers(members || []);
                    setReviews(literature_reviews || []);
                    setUserRole(current_user_role || null);
                } else {
                    setError('No organisation data found.');
                }
            } catch (err) {
                console.error('Error fetching organisation data:', err);
                setError('An error occurred while fetching organisation data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleRemoveMember = async (memberId) => {
        try {
            await api.delete(`/organisations/${id}/members/${memberId}/`);
            setMembers((prevMembers) => prevMembers.filter((member) => member.member.id !== memberId));
        } catch (err) {
            console.error('Error removing member:', err);
            setError('An error occurred while removing a member.');
        }
    };

    const handleDeleteOrganisation = async () => {
        try {
            await api.delete(`/organisations/${id}/`);
            navigate('/organisations');
        } catch (err) {
            console.error('Error deleting organisation:', err);
            setError('An error occurred while deleting the organisation.');
        }
    };

    
    if (error) {
        return (
            <Base>
                <div className="max-w-5xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg my-12">
                    <div className="notification is-danger">{error}</div>
                    <button className="button is-link" onClick={() => navigate('/organisations')}>
                        Back
                    </button>
                </div>
            </Base>
        );
    }

    
    if (loading) {
        return (<Base><div className="max-w-5xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg my-12"><p>Loading...</p></div></Base>);
    }

    
    return (
        <Base>
            <div className="max-w-5xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg my-12">
                <h1 className="text-3xl font-bold mb-4">Organisation: {organisation.title}</h1>

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Members</h2>
                    <table className="table is-striped is-fullwidth is-hoverable">
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                {userRole === 'AD' || userRole === 'ME' ? <th>Role</th> : null}
                                {userRole === 'AD' ? <th>Actions</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member, index) => (
                                <tr key={member.member.id}>
                                    <td>{index + 1}</td>
                                    <td>{member.member.username}</td>
                                    <td>{member.member.email}</td>
                                    <td>{member.member.first_name}</td>
                                    <td>{member.member.last_name}</td>
                                    {userRole === 'AD' || userRole === 'ME' ? <td>{member.role}</td> : null}
                                    {userRole === 'AD' ? (
                                        <td>
                                            <button
                                                className="button is-danger is-small"
                                                onClick={() => handleRemoveMember(member.member.id)}
                                            >
                                                Remove member
                                            </button>
                                        </td>
                                    ) : null}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Reviews</h2>
                    <table className="table is-striped is-fullwidth is-hoverable">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Discipline</th>
                                <th>#PDFs / #papers</th>
                                <th>#Screened (%)</th>
                                <th>Decisions (I / ? / E)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review, index) => (
                                <tr key={review.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <a href={`/reviews/${review.id}`}>{review.title}</a>
                                    </td>
                                    <td>{review.description}</td>
                                    <td>{review.discipline}</td>
                                    <td>
                                        {review.number_of_pdfs} / {review.number_of_papers}
                                    </td>
                                    <td>
                                        {review.number_of_screened} ({review.percentage_screened}%)
                                    </td>
                                    <td>
                                        {review.decisions_count[0]} / {review.decisions_count[1]} / {review.decisions_count[2]}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {userRole === 'AD' && (
                    <div className="flex gap-4">
                        <button className="button is-primary" onClick={() => navigate(`/organisations/${id}/add-member`)}>
                            Add member
                        </button>
                        <button className="button" disabled>
                            Edit
                        </button>
                        <button className="button is-danger" onClick={handleDeleteOrganisation}>
                            Delete organisation
                        </button>
                        <button className="button is-link" onClick={() => navigate('/organisations')}>
                            Back
                        </button>
                    </div>
                )}
            </div>
        </Base>
    );
};

export default Organisation;

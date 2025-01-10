import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from '../../api/api';
import Base from '../base/Base';

const LiteratureReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get("/literature-reviews/", {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}`, },
                });
                setReviews(response.data);
            } catch (err) {
                setError(err.response?.data?.detail || "Error fetching reviews");
            }
        };

        fetchReviews();
    }, []);

    const handleSort = (column) => {
        const newSortOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
        const sortedReviews = [...reviews].sort((a, b) => {
            const aValue = a[column] || "";
            const bValue = b[column] || "";
            if (newSortOrder === "asc") {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            }
        });

        setSortColumn(column);
        setSortOrder(newSortOrder);
        setReviews(sortedReviews);
    };

    return (
        <Base>
        <div>
            <div className="card p-4">
                <div className="card-content">
                    <h1 className="title is-1">
                        My Literature Reviews
                        <Link to="/literature-reviews/create" className="button is-link ml-5 mt-3">
                            Create new review
                        </Link>
                    </h1>
                </div>
            </div>

            <div className="card p-4">
                <div className="card-content">
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <table className="table is-striped is-fullwidth is-hoverable">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("id")}>Number</th>
                                <th onClick={() => handleSort("title")}>Title</th>
                                <th onClick={() => handleSort("description")}>Description</th>
                                <th onClick={() => handleSort("discipline")}>Discipline</th>
                                <th>Search Queries</th>
                                <th onClick={() => handleSort("number_of_papers")}>#Papers</th>
                                <th onClick={() => handleSort("number_of_pdfs")}>#PDFs</th>
                                <th onClick={() => handleSort("number_of_screened")}>#Screened</th>
                                <th onClick={() => handleSort("percentage_screened")}>% Screened</th>
                                <th>Decisions (I / ? / E)</th>
                                <th>Manage Review</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review, index) => (
                                <tr key={review.id}>
                                    <th>{index + 1}</th>
                                    <td>
                                        <Link to={`/review-details/${review.id}`}>{review.title}</Link>
                                    </td>
                                    <td>{review.description || "N/A"}</td>
                                    <td>{review.discipline || "N/A"}</td>
                                    <td>
                                        {review.search_queries?.map((query, idx) => (
                                            <span key={idx} className="tag is-light">
                                                {query}
                                            </span>
                                        )) || "N/A"}
                                    </td>
                                    <td>{review.number_of_papers}</td>
                                    <td>{review.number_of_pdfs}</td>
                                    <td>{review.number_of_screened}</td>
                                    <td>{review.percentage_screened}%</td>
                                    <td>
                                        {review.decisions_count[0]} / {review.decisions_count[1]} /{" "}
                                        {review.decisions_count[2]}
                                    </td>
                                    <td>
                                        <Link to={`/manage-review/${review.id}`}>Settings</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
            </Base>
    );
};

export default LiteratureReviews;

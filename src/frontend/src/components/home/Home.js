import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Base from '../base/Base'

function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?search_query=${encodeURIComponent(searchQuery)}&source=main_search`);
        }
    };

    return (
        <Base>
            <div className="search-box">
                <img src="cruise-logo.png" className="search-box__logo" width="300" height="300" />
                <form id="search_box" onSubmit={handleSearch}>
                    <div className="search-box__input">
                        <input
                            type="search"
                            className="input mr-2"
                            name="search_query"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search CRUISE"
                            aria-label="Search"
                        />
                        <button type="submit" className="button is-primary">
                            Search
                        </button>
                    </div>
                    <input type="hidden" name="source" value="main_search" />
                </form>
            </div>
        </Base>
    );
}

export default Home;

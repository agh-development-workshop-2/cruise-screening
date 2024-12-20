import React from 'react';
import {useSearchParams} from 'react-router-dom';
import SearchResultList from '../search_result_list/SearchResultList';
import Base from '../../base/Base';
import Home from '../../home/Home';

const PlainSearch = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search_query');
    const source = searchParams.get('source');

    if (!searchQuery && !source) {
        return <Home/>;
    }

    return (
        <Base title={`Cruise-literature: ${searchQuery || 'Search'}`}>
            <div className="search-results-one-column">
                <div>
                    <SearchResultList searchQuery={searchQuery} source={source}/>
                </div>
            </div>
        </Base>
    );
};

export default PlainSearch;

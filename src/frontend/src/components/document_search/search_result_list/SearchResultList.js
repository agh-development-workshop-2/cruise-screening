import React, {useEffect, useState} from 'react';
import WikipediaCard from '../wikipedia_card/WikipediaCard';
import axios from 'axios';
import Card from "../card/Card";

const SEARCH_API_URL = process.env.REACT_APP_SEARCH_API_URL


const SearchResultList = ({
                              searchQuery, source, currentPage
                          }) => {
    const [currentPageState, setCurrentPageState] = useState(currentPage);
    const [searchTime, setSearchTime] = useState(0);
    const [uniqueSearches, setUniqueSearches] = useState(0);
    const [searchResult, setSearchResult] = useState([]);
    const [matchedWikiPage, setMatchedWikiPage] = useState();
    const [pageSize, setPageSize] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(SEARCH_API_URL + '/search', {
            params: {
                search_query: searchQuery
            }
        }).then(response => {
            if (response) {
                setSearchResult(response.data.search_result);
                setSearchTime(response.data.search_time);
                setUniqueSearches(response.data.unique_searches);
                setMatchedWikiPage(response.data.matched_wiki_page);
                setPageSize(response.data.page_size);
                setLoading(false);
                setTotalPages(response.data.search_result.length > 0 ? Math.ceil(response.data.search_result.length / response.data.page_size) : 1)
            }
        })
            .catch(function (error) {
                // todo - handle request abort
                console.error(error)
            })
        setCurrentPageState(Number(currentPage));
    }, [searchQuery, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPageState(page);
        window.location.href = `/search?search_query=${encodeURIComponent(searchQuery)}&source=${source}&page=${page}`;
    };

    return (<div className="search-results__list">
        <h2 className="title is-4 mb-1">Search results: {searchQuery}</h2>

        {loading ? (<div
            className="max-w-3xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-lg my-12 flex justify-center items-center">
            <div
                className="spinner is-centered animate-spin border-t-4 border-orange-600 border-solid rounded-full w-16 h-16">
            </div>
        </div>) : (<></>)}

        {matchedWikiPage && (<WikipediaCard matchedWikiPage={matchedWikiPage}/>)}

        {searchResult?.length > 0 ? (<>
            <p className="mb-4">
                Returned <strong>{uniqueSearches} unique search results</strong> ({searchTime} seconds)
            </p>
            {searchResult.slice((currentPageState - 1) * pageSize, Math.min(currentPageState * pageSize, searchResult.length)).map((result, _) => {
                return (<Card key={result.id} searchResult={result}/>);
            })}
        </>) : (<p>No search results are available ({searchTime} seconds)</p>)}

        {totalPages > 1 && (<ul className="pagination">
            {currentPageState > 1 ? (<li>
                <a
                    href="#"
                    onClick={() => handlePageChange(currentPageState - 1)}
                >
                    &laquo;
                </a>
            </li>) : (<li className="disabled">
                <span>&laquo;</span>
            </li>)}

            {Array.from({length: totalPages}, (_, index) => (<li
                key={index + 1}
                className={(currentPageState === index + 1) ? 'active' : ''}
            >
                <a
                    href="#"
                    onClick={() => handlePageChange(index + 1)}
                >
                    {index + 1}
                </a>
            </li>))}

            {currentPageState < totalPages ? (<li>
                <a
                    href="#"
                    onClick={() => handlePageChange(currentPageState + 1)}
                >
                    &raquo;
                </a>
            </li>) : (<li className="disabled">
                <span>&raquo;</span>
            </li>)}
        </ul>)}
    </div>);
};

export default SearchResultList;

import React, {useState, useEffect} from 'react';
import WikipediaCard from '../wikipedia_card/WikipediaCard';
import Card from '../card/Card';

const SearchResultList = ({
                              searchQuery,
                              matchedWikiPage,
                              searchResultList,
                              searchTime,
                              uniqueSearches,
                              currentPage,
                              totalPages
                          }) => {
    const [currentPageState, setCurrentPageState] = useState(currentPage);

    useEffect(() => {
        setCurrentPageState(currentPage);
    }, [searchQuery, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPageState(page);
        window.location.href = `/search?search_query=${encodeURIComponent(searchQuery)}&page=${page}`;
    };

    return (
        <div className="search-results__list">
            <h2 className="title is-4 mb-1">Search results: {searchQuery}</h2>

            {matchedWikiPage && (
                <WikipediaCard matchedWikiPage={matchedWikiPage}/>
            )}

            {searchResultList && searchResultList.length > 0 ? (
                <>
                    <p className="mb-4">
                        Returned <strong>{uniqueSearches} unique search results</strong> ({searchTime} seconds)
                    </p>
                    {searchResultList.map((searchResult, index) => (
                        <Card key={index} searchResult={searchResult}/>
                    ))}
                </>
            ) : (
                <p>No search results are available ({searchTime} seconds)</p>
            )}

            {totalPages > 1 && (
                <ul className="pagination">
                    {currentPageState > 1 ? (
                        <li>
                            <a
                                href="#"
                                onClick={() => handlePageChange(currentPageState - 1)}
                            >
                                &laquo;
                            </a>
                        </li>
                    ) : (
                        <li className="disabled">
                            <span>&laquo;</span>
                        </li>
                    )}

                    {Array.from({length: totalPages}, (_, index) => (
                        <li
                            key={index + 1}
                            className={currentPageState === index + 1 ? 'active' : ''}
                        >
                            <a
                                href="#"
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </a>
                        </li>
                    ))}

                    {currentPageState < totalPages ? (
                        <li>
                            <a
                                href="#"
                                onClick={() => handlePageChange(currentPageState + 1)}
                            >
                                &raquo;
                            </a>
                        </li>
                    ) : (
                        <li className="disabled">
                            <span>&raquo;</span>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchResultList;

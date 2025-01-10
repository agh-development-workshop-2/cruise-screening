import React, { useState } from 'react';

const Card = ({ resultKey, searchResult }) => {
    const [openAbstract, setOpenAbstract] = useState(false);
    const [openKeywords, setOpenKeywords] = useState(false);

    const truncateText = (text, length = 500) => {
        return text.length > length ? text.substring(0, length) + '...' : text;
    };

    return (
        <article className="card mb-4" x-data="{ openAbstract: false, openKeywords: false, showCSOKeywords: false}">
            <div className="card-content pb-1">
                <p className="title">
                    {searchResult.url ? (
                        <a href={searchResult.url}>{searchResult.title}</a>
                    ) : (
                        searchResult.title
                    )}
                    {searchResult.pdf && (
                        <a href={searchResult.pdf}>
                            <img src="pdf-icon.svg" width="25" height="25" alt="PDF" />
                        </a>
                    )}
                </p>
                <p className="subtitle mb-2">{searchResult.authors}</p>
                <p>
                    <span className="is-size-6 p-0 m-0 has-text-primary">
                        {searchResult.publication_date} - {searchResult.venue}
                    </span>
                    {searchResult.doi && (
                        <span className="has-text-grey-light is-size-7">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;
                            <a href={`https://doi.org/${searchResult.doi}`} target="_blank" rel="noopener noreferrer">
                                {searchResult.doi}
                            </a>
                        </span>
                    )}
                </p>
            </div>

            <div className="card-content pt-1">
                <div className="content">
                    {searchResult.abstract && searchResult.abstract !== truncateText(searchResult.abstract) ? (
                        openAbstract ? (
                            <p className="is-5">
                                <strong>Abstract:</strong> {searchResult.abstract}
                                <br />
                                <button
                                    type="button"
                                    className="card__show-more"
                                    onClick={() => setOpenAbstract(false)}
                                >
                                    Show less
                                </button>
                            </p>

                        ) : (
                            <p className="is-5">
                                <strong>Abstract:</strong> {truncateText(searchResult.abstract)}
                                <br />
                                <button
                                    type="button"
                                    className="card__show-more"
                                    onClick={() => setOpenAbstract(true)}
                                >
                                    Show full abstract
                                </button>
                            </p>

                        )
                    ) : searchResult.abstract ? (
                        <p className="is-5">
                            <strong>Abstract:</strong> {searchResult.abstract}
                        </p>
                    ) : searchResult.snippet ? (
                        <p className="is-5">
                            <strong>Snippet:</strong> {searchResult.snippet}...
                        </p>
                    ) : (
                        <p className="is-5">
                            <strong>Abstract:</strong> No abstract available
                        </p>
                    )}

                    <p>
                        {/* todo - potentially not working */}
                        {searchResult.keywords_snippet?.map(([keyword, score]) => (
                            <a
                                key={keyword}
                                href={`?search_query=${encodeURIComponent(keyword)}&source=keywords`}
                                className={`button is-light is-small mb-2 ${score}`}
                            >
                                {keyword}
                            </a>
                        ))}

                        {searchResult.keywords_rest?.length > 0 && !openKeywords && (
                            <button type="button" className="card__show-more" onClick={() => setOpenKeywords(true)}>
                                Show more
                            </button>
                        )}

                        {openKeywords && (
                            <>
                                <span>
                                    {/* todo - potentially not working */}
                                    {searchResult.keywords_rest?.map(([keyword, score]) => (
                                        <a
                                            key={keyword}
                                            href={`?search_query=${encodeURIComponent(keyword)}&source=keywords`}
                                            className={`button is-light is-small mb-2 ${score}`}
                                        >
                                            {keyword}
                                        </a>
                                    ))}
                                </span>
                                <button type="button" className="card__show-more"
                                    onClick={() => setOpenKeywords(false)}>
                                    Show less
                                </button>
                            </>
                        )}
                    </p>

                    {/* todo - there are no citations and references in searchResult */}
                    <p className="has-text-info">
                        Cited
                        by {searchResult.citations} &nbsp;&nbsp; - &nbsp;&nbsp; {searchResult.references} references
                    </p>
                </div>
            </div>
        </article>
    )
};

export default Card;

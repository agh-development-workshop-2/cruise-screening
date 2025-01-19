import React from 'react';

const WikipediaCard = ({matchedWikiPage}) => {
    return (
        <article className="card my-4 card--wiki">
            <div className="card-content">
                {!matchedWikiPage.ambiguous && (
                    <>
                        <p className="subtitle">Multiple matches found. Did you mean:</p>
                        <hr/>
                    </>
                )}

                <p className="title">
                    <a href={matchedWikiPage.url} target="_blank" rel="noopener noreferrer">
                        {matchedWikiPage.title}
                    </a>
                </p>

                <p className="subtitle">
                    <img src="wikipedia-logo.png" width="24" height="24" alt="Wikipedia Logo"/> Wikipedia
                </p>
            </div>

            <div className="card-content">
                <div className="content">
                    <p>{matchedWikiPage.snippet}</p>
                </div>
            </div>
        </article>
    );
};

export default WikipediaCard;

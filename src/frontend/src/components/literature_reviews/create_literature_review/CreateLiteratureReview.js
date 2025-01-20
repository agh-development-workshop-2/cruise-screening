import Base from '../../base/Base';
import React, {useEffect, useState} from "react";
import api from "../../../api/api";

const CreateLiteratureReview = () => {

    const [searchEngines, setSearchEngines] = useState([]);
    const [reviewTypes, setReviewTypes] = useState({});

    useEffect(() => {
        const fetchSearchEnginesResult = async () => {
            try {
                return await api.get('/search_engines');
            } catch (err) {
                console.error(err);
            }
        };

        const fetchReviewTypes = async () => {
            try {
                return await api.get('/review_types');
            } catch (err) {
                console.error(err);
            }
        };

        fetchSearchEnginesResult().then(response => {
            if (response) {
                setSearchEngines(response.data.search_engines);

            }
        });

        fetchReviewTypes().then(response => {
            if (response) {
                setReviewTypes(response.data.review_types);
            }
        })
    }, []);

    const exclusionCriteria = ["Paper written in language other than English", "Only title is available",]

    const getDeadlineRanges = () => {
        let currentDate = new Date();

        let minusTenYears = new Date();
        minusTenYears.setFullYear(currentDate.getFullYear() - 10);

        let plusTenYears = new Date();
        plusTenYears.setFullYear(currentDate.getFullYear() + 10);

        return {
            now: currentDate.toISOString().split('T')[0],
            min: minusTenYears.toISOString().split('T')[0],
            max: plusTenYears.toISOString().split('T')[0]
        }
    }

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        search_queries: '',
        inclusion_criteria: '',
        exclusion_criteria: exclusionCriteria.join("\n"),
        top_k: 25,
        annotations_per_paper: Array.from({length: 3}, (_, i) => i + 1),
        deadline: getDeadlineRanges(),
        discipline: '---------',
        organisation: '---------'
    })

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        if (type !== 'select-one') {
            setFormData({...formData, [name]: value});
        }

        console.log(type);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    }

    return (<Base>
        <div className={"card"}>
            <div className={"card-header pl-4"}>
                <a href={"/literature-reviews"} className={"button is-link is-small"}>
                    Back
                </a>
            </div>
            <div className={"register"}>
                <h1 className={"title is-1"}>Create a new literature review</h1>
                <div>
                    <form onSubmit={handleSubmit} className={"space-y-4"}>
                        <div className={"field"}>
                            <label className="label">Literature review title:</label>
                            <div className={"control"}>
                                <input
                                    type={"text"}
                                    name={"title"}
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={"input form_required"}
                                />
                            </div>
                        </div>
                        <div className={"field"}>
                            <label className="label">Literature review description:</label>
                            <div className={"control"}>
                                    <textarea
                                        name={"description"}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className={"textarea is-small form_required"}
                                    />
                            </div>
                        </div>
                        <div className={"field"}>
                            <label className="label">Type in your search queries, every query in a new line:</label>
                            <div className={"control"}>
                                    <textarea
                                        name={"search_queries"}
                                        value={formData.search_queries}
                                        onChange={handleChange}
                                        className={"textarea is-small form_required"}
                                    />
                            </div>
                        </div>
                        <div className={"field"}>
                            <label className="label">Type in your inclusion criteria, each one on a new
                                line:</label>
                            <div className={"control"}>
                                    <textarea
                                        name={"inclusion_criteria"}
                                        value={formData.inclusion_criteria}
                                        onChange={handleChange}
                                        className={"textarea is-small form_required"}
                                    />
                            </div>
                        </div>
                        <div className={"field"}>
                            <label className="label">Type in your exclusion criteria, each one on a new
                                line:</label>
                            <div className={"control"}>
                                    <textarea
                                        name={"exclusion_criteria"}
                                        value={formData.exclusion_criteria}
                                        onChange={handleChange}
                                        className={"textarea is-small form_required"}
                                    />
                            </div>
                        </div>
                        <div className={"field"}>
                            <label className="label">Select in which search engines you want to search for the
                                papers:</label>
                            {searchEngines.map((engine) => (
                                <div key={engine} className={"select is-fullwidth is-multiple is-medium"}>
                                    <input type="checkbox" id={engine} name={engine}/>
                                    <label htmlFor={engine}>{engine}</label>
                                </div>))}
                            <span className={"help-block"} style={{fontSize: '.75rem'}}>By default, it uses the internal CRUISE database, SemanticScholar and CORE.
        Selecting Google Scholar will drastically increase the search time.
        PubMed is the only search engine which supports Boolean operators in search queries.</span>
                        </div>

                        <div className={"field"}>
                            <label className="label">Number of records retrieved per search query:</label>
                            <div className={"control"}>
                                <input
                                    type={"number"}
                                    name={"top_k"}
                                    value={formData.top_k}
                                    onChange={handleChange}
                                    className={"input"}
                                    min={"10"}
                                    max={"500"}
                                />
                            </div>
                            <span className={"help-block"} style={{fontSize: '.75rem'}}>The maximal value is 500, the minimal value is 10.</span>
                        </div>
                        <div>
                            <div>
                                <label style={{margin: "2px"}}>Review type:</label>
                                <select
                                    name={"review_types"}
                                    onChange={handleChange}
                                    style={{
                                        border: "1px solid black",
                                        borderRadius: "3px",
                                        padding: "3px",
                                        fontSize: "14px"
                                    }}
                                >
                                    {Object.entries(reviewTypes).map(entry => (
                                        <option value={entry[0]} key={entry[0]}>{entry[1]}</option>
                                    ))}
                                </select>
                            </div>
                            <span className={"help-block"} style={{fontSize: '.75rem'}}>The maximal value is 500, the minimal value is 10.</span>
                        </div>
                        <div>
                            <div>
                                <label style={{margin: "2px"}}>Annotations per paper:</label>
                                <select
                                    name={"annotations_per_paper"}
                                    onChange={handleChange}
                                    style={{
                                        border: "1px solid black",
                                        borderRadius: "3px",
                                        padding: "3px",
                                        fontSize: "14px"
                                    }}
                                >
                                    {formData.annotations_per_paper.map(entry => (
                                        <option value={entry} key={entry}>{entry}</option>
                                    ))}
                                </select>
                            </div>
                            <span className={"help-block"} style={{fontSize: '.75rem'}}>By how many annotators each paper needs to be screened.</span>
                        </div>
                        <h3 className={"title is-5"}>Additional fields:</h3>
                        <div>
                            <div>
                                <label style={{margin: "2px"}}>Project deadline:</label>
                                <input
                                    type={"date"}
                                    name={"deadline"}
                                    value={formData.deadline.now}
                                    onChange={handleChange}
                                    className={"input"}
                                    min={formData.deadline.min}
                                    max={formData.deadline.max}
                                />
                            </div>
                            <span className={"help-block"} style={{fontSize: '.75rem'}}>The maximal value is 500, the minimal value is 10.</span>
                        </div>

                        {/*TODO - add rest inputs */}

                        <div>
                            <button type="submit" className="button is-link mt-5 is-fullwidth">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Base>);
};

export default CreateLiteratureReview;
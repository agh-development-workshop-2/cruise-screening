from dataclasses import dataclass
from typing import Union, Optional, Dict, List


@dataclass
class Article:
    """Class for representing an article."""

    id: str
    title: str
    url: str  # this could be a list
    pdf: str
    snippet: str
    abstract: Optional[str]
    authors: str
    publication_date: str = ""
    publication_year: Optional[int] = None
    urls: Optional[List[str]] = None  # this could be a list
    venue: str = ""
    keywords_snippet: Union[Dict[str, Union[int, float]], None] = None
    keywords_rest: Union[Dict[str, Union[int, float]], None] = None
    CSO_keywords: Union[Dict[str, Union[int, float]], None] = None
    n_references: Optional[int] = None  # references count
    n_citations: Optional[int] = None  # citations count

    semantic_scholar_id: Optional[str] = None
    core_id: Optional[str] = None
    doi: Optional[str] = None
    pmid: Optional[str] = None
    arxiv_id: Optional[str] = None

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "url": self.url,
            "pdf": self.pdf,
            "snippet": self.snippet,
            "abstract": self.abstract,
            "authors": self.authors,
            "publication_date": self.publication_date,
            "publication_year": self.publication_year,
            "urls": self.urls,
            "venue": self.venue,
            "keywords_snippet": self.keywords_snippet,
            "keywords_rest": self.keywords_rest,
            "CSO_keywords": self.CSO_keywords,
            "n_references": self.n_references,
            "n_citations": self.n_citations,
            "semantic_scholar_id": self.semantic_scholar_id,
            "core_id": self.core_id,
            "doi": self.doi,
            "pmid": self.pmid,
            "arxiv_id": self.arxiv_id
        }


@dataclass()
class WikipediaArticle:
    """Class for representing Wikipedia article."""

    id: str
    title: str
    url: str
    snippet: str
    content: str
    ambiguous: bool = True
    keywords: Optional[List[str]] = None

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "url": self.url,
            "snippet": self.snippet,
            "content": self.content,
            "ambiguous": self.ambiguous,
            "keywords": self.keywords
        }


@dataclass()
class Author:
    """Class for representing an author."""

    display_name: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    id: Optional[str] = None
    aminer_id: Optional[str] = None
    semantic_scholar_id: Optional[str] = None
    google_scholar_id: Optional[str] = None
    orcid_id: Optional[str] = None

    def to_dict(self):
        return {
            "display_name": self.display_name,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "id": self.id,
            "aminer_id": self.aminer_id,
            "semantic_scholar_id": self.semantic_scholar_id,
            "google_scholar_id": self.google_scholar_id,
            "orcid_id": self.orcid_id
        }

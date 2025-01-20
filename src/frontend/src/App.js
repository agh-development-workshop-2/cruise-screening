import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home/Home';
import Faq from './components/faq/Faq';
import About from './components/about/About';
import './index.css';
import Login from './components/user/Login';
import Register from './components/user/Register';
import UserProfile from './components/user/UserProfile';
import { AuthProvider } from './components/auth/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import EditUserProfile from './components/user/EditUserProfile';
import LiteratureReviewList from './components/literature_reviews/home/Home';
import PlainSearch from './components/document_search/plain_search/PlainSearch';
import CreateLiteratureReview from "./components/literature_reviews/create_literature_review/CreateLiteratureReview";

function App() {
  return (
    <div className="App">
      <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit_profile" element={<EditUserProfile />} />
          <Route path="/profile"
            element={
                <ProtectedRoute>
                    <UserProfile />
                </ProtectedRoute>
            } />
          <Route path="/literature-reviews"
            element={
                <ProtectedRoute>
                    <LiteratureReviewList />
                </ProtectedRoute>
            }/>
            <Route path="/search" element={<PlainSearch/>}/>
            <Route path="/literature-reviews/create" element={
                <ProtectedRoute>
                    <CreateLiteratureReview />
                </ProtectedRoute>
            } />
        </Routes>
      </Router>
      </AuthProvider>
    </div>
  );
}

export default App;

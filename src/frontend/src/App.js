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
import LiteratureReviewList from './components/literature_reviews/Home';

import Organisation from './components/organisations/view_organisation'; 
import CreateOrganisation from './components/organisations/create_organisation'; 
import AddMember from './components/organisations/add_member';
import Organisations from './components/organisations/view_all_organisations';


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

          <Route
              path="/organisations"
              element={
                <ProtectedRoute>
                  <Organisations/>
                </ProtectedRoute>
              }
            />
          <Route
              path="/organisations/new"
              element={
                <ProtectedRoute>
                  <CreateOrganisation />
                </ProtectedRoute>
              }
            />
          <Route 
              path="/organisations/:id" 
              element={
                <ProtectedRoute>
                  <Organisation />
                </ProtectedRoute>
              } 
            />
          <Route 
              path="/organisations/:id/add-member" 
              element={
                <ProtectedRoute>
                  <AddMember/>
                </ProtectedRoute>
              } 
            />
          
        </Routes>
      </Router>
      </AuthProvider>
    </div>
  );
}

export default App;

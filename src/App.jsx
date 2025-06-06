// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

import LoginContainer from './pages/auth/LoginContainer';
import Dashboard from './pages/Dashboard';
import ResourceManager from './pages/resources/ResourceManager-maxwell';
import { ToastContainer } from 'react-toastify'
import AddResourceTypeForm from './components/Resources/Form/AddResourceType-maxwell';
import ReservationForm from './components/Resources/Form/ReservationForm-maxwell';
import ReservationsList from './components/Resources/List/ReservationsList-maxwell';
import ReservationHistory from './components/Resources/List/ReservationHistory-maxwell';
import RegisterContainer from './pages/auth/RegisterContainer';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Route publique vers le container (qui rend LoginView) */}
          <Route path="/login" element={<LoginContainer />} />
          <Route path="/register" element={<RegisterContainer/>}/>

          {/* {<Route element={<ProtectedRoute />}>} */}
            <Route path="/dashboard" element={<Dashboard />}>
              <Route
                index
                element={
                  <div className="text-gray-700">
                    Sélectionne une option dans la barre latérale.
                  </div>
                }
              />
              <Route path="resources" element={<ResourceManager />} />
              <Route path='resources/type/create' element={<AddResourceTypeForm/>}/>
              <Route path='reservation/create' element={<ReservationForm/>}/>
              <Route path='reservations' element={<ReservationsList/>}/>
              <Route path='reservations/history' element={<ReservationHistory/>}/>
            </Route>
          {/* </Route> */}

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

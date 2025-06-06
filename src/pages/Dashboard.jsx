import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/layouts/navbar';

import { HomeIcon, BookOpenIcon, BookmarkIcon, ClockIcon } from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex flex-col h-screen">
      <Navbar user={user} logout={logout} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r overflow-auto">

          <nav className="mt-6">
            <ul>
              <li>
                <Link
                   to="/dashboard"
                   end
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <HomeIcon className="h-5 w-5 text-gray-500" />

                  <span className="ml-3 font-medium">Accueil</span>

                  <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    5
                  </span>
                </Link>
              </li>
             
              <li>
                <Link
                  to="/dashboard/resources"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <BookOpenIcon className="h-5 w-5 text-gray-500" />
                  
                   <span className="ml-3 font-medium">Ressources pédagogiques</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard/reservations"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <BookmarkIcon className="h-5 w-5 text-gray-500" />
                  
                   <span className="ml-3 font-medium">Réservations </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/reservations/history"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <ClockIcon className="h-5 w-5 text-gray-500" />
                  
                   <span className="ml-3 font-medium">Historiques </span>
                </Link>
              </li>
              {/* … autres liens éventuels … */}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 container  p-6 overflow-auto">
          {/* Outlet pour injecter la page enfant (Accueil ou Resources) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

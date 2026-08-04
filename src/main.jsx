import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import MainLayout from './layout/MainLayout';

import Home from './page/Home';
import SearchPage from './page/SearchPage';
import Donate from './page/Donate';
import DonateRequest from './page/DonateRequest';
import Profile from './page/Profile';
import BloodInformation from './page/BloodInformation';
import BloodRequest from './page/BloodRequest';
import Login from './page/Login';
import Register from './page/Register';
import AuthProviders from './providers/AuthProviders';
import { Toaster } from 'react-hot-toast';
import AvailableDonors from './page/AvailableDonors';


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/donate',
        element: <Donate />,
      },
      {
        path: '/donate-request',
        element: <DonateRequest />,
      },
      {
        path: '/blood-request',
        element: <BloodRequest />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/blood-information',
        element: <BloodInformation />,
      },
      {
        path: '/available-donors',
        element: <AvailableDonors />,
      },


      
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },

    ]
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProviders>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProviders>
  </StrictMode>,
)
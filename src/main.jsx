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
import CompleteProfile from './page/CompleteProfile';
// import PrivateRoute from './routes/PrivateRoute';
import GuestRoute from './route/GuestRoute';
import PrivateRoute from './route/PrivateRoute';


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
        element: <PrivateRoute><Profile /></PrivateRoute>,
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
        path: "/complete-profile",
        element: <CompleteProfile />,
      },
      
      {
        path: '/login',
        element: <GuestRoute><Login /></GuestRoute>,
      },
      {
        path: '/register',
        element: <GuestRoute><Register /></GuestRoute>,
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
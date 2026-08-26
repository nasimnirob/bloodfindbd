import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "leaflet/dist/leaflet.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import MainLayout from './layout/MainLayout';

import Home from './page/Home';
import SearchPage from './page/SearchPage';
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
import Donate from './page/Donate';
import NotFound from './page/NotFound';
import MyPosts from './page/MyPosts';
import EditPost from './page/EditPost';
import AdminLayout from './Dashboard/layouts/AdminLayout';
import AdminDashboard from './Dashboard/pages/admin/AdminDashboard';
import AdminUsers from './Dashboard/pages/admin/AdminUsers';
import AdminBloodRequests from './Dashboard/pages/admin/AdminBloodRequests';
import AdminRoute from './route/AdminRoute';


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
        element: <PrivateRoute><Donate /></PrivateRoute>,
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
        element: <PrivateRoute> <CompleteProfile /> </PrivateRoute>,
      },

      {
        path: "/my-posts",
        element: <PrivateRoute> <MyPosts /> </PrivateRoute>,
      },
      {
        path: "/edit-post/:id",
        element: <PrivateRoute> <EditPost /> </PrivateRoute>,
      },


      // Auth

      {
        path: '/login',
        element: <GuestRoute><Login /></GuestRoute>,
      },
      {
        path: '/register',
        element: <GuestRoute><Register /></GuestRoute>,
      },


      {
        path: "*",
        element: <NotFound />,
      },
    ]
  },

  // ADMIN ROUTE

  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "users",
            element: <AdminUsers />,
          },
          {
            path: "blood-requests",
            element: <AdminBloodRequests />,
          },
        ],
      },
    ],
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
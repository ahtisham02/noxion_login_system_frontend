import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import ProtectedRoute from 'src/utils/ProtectedRoute';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const ViewEmails = Loadable(lazy(() => import('../views/smtp_emails/ViewEmails')))
const ViewUsers = Loadable(lazy(() => import('../views/users/ViewUsers')))
const ViewLogs = Loadable(lazy(() => import('../views/logs/Logs')))
const AddUsers = Loadable(lazy(() => import('../views/users/AddUsers')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));

const Router = [
  {
    path: '/home',
    element: <ProtectedRoute><FullLayout /></ProtectedRoute>,
    children: [
      { path: '/home', element: <Navigate to="/home/dashboard" /> },
      { path: '/home/dashboard', exact: true, element: <ViewEmails /> },
      { path: '/home/users', exact: true, element: <ViewUsers /> },
      { path: '/home/logs', exact: true, element: <ViewLogs /> },
      { path: '/home/addUsers', exact: true, element: <AddUsers /> },
      { path: '/home/logs', exact: true, element: <AddUsers /> },
      { path: '*', element: <Navigate to="/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/register', element: <Register /> },
      { path: '/', element: <Login /> },
      // { path: '*', element: <Navigate to="/login" /> },
    ],
  },
];

export default Router;

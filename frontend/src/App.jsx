import React from 'react';
import { createBrowserRouter, RouterProvider, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Game from './pages/Game';
import Navbar from './components/Navbar';
import { UserProvider } from './UserContext';
import Callback from './pages/Callback';
import EmailConfirmation from './pages/EmailConfirmation';
import ResetPassword from './pages/ResetPassword';

const Layout = () => (
  <>
    <Navbar />
    <div className="container">
      <Outlet />
    </div>
  </>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/settings', element: <Settings /> },
      { path: '/game', element: <Game /> },
      { path: '/callback', element: <Callback /> },
      { path: '/confirm/:token', element: <EmailConfirmation /> },
      { path: '/reset-password', element: <ResetPassword /> },
    ],
  },
]);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
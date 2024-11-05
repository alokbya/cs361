// main.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorPage from './error-page';
import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Schedules from './pages/Schedules';
import Details from './pages/Details';
import Events from './pages/Events';
import Profile from './pages/Profile/Profile';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import AuthLayout from './components/AuthLayout';

// Create the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "schedules",
        element: (
          <ProtectedRoute>
            <Schedules />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />
      },
      {
        path: "events",
        element: (
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />
      },
      {
        path: "details",
        element: (
          <ProtectedRoute>
            <Details />
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />
      }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
        {
          path: "login",
          element: <Login />,
          errorElement: <ErrorPage />,
        },
        {
          path: "register",
          element: <Register />,
          errorElement: <ErrorPage />,
        },
      ]
    }
  
]);

// Create App wrapper component
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
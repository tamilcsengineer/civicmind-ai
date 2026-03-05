import HomePage from './pages/HomePage';
import SubmitComplaintPage from './pages/SubmitComplaintPage';
import TrackComplaintPage from './pages/TrackComplaintPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import AdminComplaintDetailPage from './pages/AdminComplaintDetailPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />
  },
  {
    name: 'Submit Complaint',
    path: '/submit',
    element: <SubmitComplaintPage />
  },
  {
    name: 'Track Complaint',
    path: '/track',
    element: <TrackComplaintPage />
  },
  {
    name: 'Admin Dashboard',
    path: '/admin',
    element: <AdminDashboardPage />
  },
  {
    name: 'Admin Complaints',
    path: '/admin/complaints',
    element: <AdminComplaintsPage />
  },
  {
    name: 'Admin Complaint Detail',
    path: '/admin/complaint/:id',
    element: <AdminComplaintDetailPage />
  }
];

export default routes;

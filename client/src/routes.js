import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
// ----------------------------------------------------------------------
import UsersList from './views/admin/users';
import AddUser from './views/admin/users/addUser';
import EditUser from './views/admin/users/editUser';
import StoresList from './views/admin/stores';
import AddStore from './views/admin/stores/addStore';
import EditStore from './views/admin/stores/editStore';
import LoginPage from './views/auth/loginPage';
import RegisterPage from './views/auth/registerPage';

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'users', element: <UsersList/> },
        { path: 'add-user', element: <AddUser/> },
        { path: 'edit-user/:id', element: <EditUser/> },
        { path: 'stores', element: <StoresList/> },
        { path: 'add-store', element: <AddStore/> },
        { path: 'edit-store/:id', element: <EditStore/> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterPage/>,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

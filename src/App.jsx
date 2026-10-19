import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import DialPage from './pages/DialPage'
import TablePage from './pages/TablePage'
import ScoresPage from './pages/ScoresPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DialPage /> },
      { path: 'table', element: <TablePage /> },
      { path: 'scores', element: <ScoresPage /> },
      // The old meeting planner became the Table.
      { path: 'meeting-planner', element: <Navigate to="/table" replace /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
], {
  // Without the trailing slash, /world-clock (as kwame.co serves it) matches too.
  basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
})

function App() {
  return <RouterProvider router={router} />
}

export default App

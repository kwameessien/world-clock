import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import AppLayout from './layout/AppLayout'
import WorldClock from './pages/WorldClock'
import MeetingPlannerPage from './pages/MeetingPlannerPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <WorldClock /> },
      { path: 'meeting-planner', element: <MeetingPlannerPage /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App

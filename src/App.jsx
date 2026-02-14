import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import AppLayout from './layout/AppLayout'
import WorldClock from './pages/WorldClock'
import MeetingPlannerPage from './pages/MeetingPlannerPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<WorldClock />} />
          <Route path="meeting-planner" element={<MeetingPlannerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Chart from './Chart'

function App() {
  return (
    <BrowserRouter basename="/Chart/">
      <Routes>
        <Route path="/Chart" element={<Chart />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

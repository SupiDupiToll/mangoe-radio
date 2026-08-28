import { Routes, Route } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import PlayerPage from './pages/PlayerPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="suche" element={<SearchPage />} />
        <Route path="player" element={<PlayerPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  )
}

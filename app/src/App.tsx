import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChapterPage from './pages/ChapterPage';
import ReviewPage from './pages/ReviewPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chapter/:slug" element={<ChapterPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

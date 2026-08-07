import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import ChapterPage from './pages/ChapterPage';
import ReviewPage from './pages/ReviewPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/chapter/:slug" element={<ChapterPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}

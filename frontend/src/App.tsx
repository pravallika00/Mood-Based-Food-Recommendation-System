import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FaceEmotionPage from './pages/FaceEmotionPage';
import VoiceEmotionPage from './pages/VoiceEmotionPage';
import SentimentPage from './pages/SentimentPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/face-emotion" element={<FaceEmotionPage />} />
          <Route path="/voice-emotion" element={<VoiceEmotionPage />} />
          <Route path="/sentiment" element={<SentimentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

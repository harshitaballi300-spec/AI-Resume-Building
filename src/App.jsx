import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Builder from './pages/Builder';
import Preview from './pages/Preview';
import Proof from './pages/Proof';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/proof" element={<Proof />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

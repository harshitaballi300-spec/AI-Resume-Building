import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  Step01, Step02, Step03, Step04,
  Step05, Step06, Step07, Step08
} from './pages/Steps';
import ProofPage from './pages/ProofPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/rb/01-problem" replace />} />
        <Route path="/rb/01-problem" element={<Step01 />} />
        <Route path="/rb/02-market" element={<Step02 />} />
        <Route path="/rb/03-architecture" element={<Step03 />} />
        <Route path="/rb/04-hld" element={<Step04 />} />
        <Route path="/rb/05-lld" element={<Step05 />} />
        <Route path="/rb/06-build" element={<Step06 />} />
        <Route path="/rb/07-test" element={<Step07 />} />
        <Route path="/rb/08-ship" element={<Step08 />} />
        <Route path="/rb/proof" element={<ProofPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

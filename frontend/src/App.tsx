import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';

function App() {
  return <Routes>
    <Route path="/login" element={<Login/>} />
    <Route path="/" element={<div>Home Page</div>} />
    <Route path="/about" element={<div>About Page</div>} />
    <Route path="/contact" element={<div>Contact Page</div>} />
    <Route path="*" element={<div>404 Not Found</div>} />
  </Routes>
}

export default App;

import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Check from './pages/check';
import Layout from './components/layout';
import NotFound from './pages/notFound';
import Cities from './pages/cities';

function App() {
  return <Routes>
    <Route path="/" element={<Check/>} />
    <Route path="/login" element={<Login/>} />
    <Route element={<Layout/>}>
      <Route path="/add" element={<div>About Page</div>} />
      <Route path="/list" element={<div>Contact Page</div>} />
      <Route path="/clients" element={<div>Contact Page</div>} />
      <Route path="/cities" element={<Cities/>} />
      <Route path="*" element={<NotFound/>} />
    </Route>
  </Routes>
}

export default App;

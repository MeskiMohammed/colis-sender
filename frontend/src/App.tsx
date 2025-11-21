import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Check from './pages/check';
import Layout from './components/layout';
import NotFound from './pages/notFound';
import Cities from './pages/cities';
import Clients from './pages/clients';
import List from './pages/list';
import Add from './pages/add';

function App() {
  return <Routes>
    <Route path="/" element={<Check/>} />
    <Route path="/login" element={<Login/>} />
    <Route element={<Layout/>}>
      <Route path="/add" element={<Add/>} />
      <Route path="/list" element={<List/>} />
      <Route path="/clients" element={<Clients/>} />
      <Route path="/cities" element={<Cities/>} />
      <Route path="*" element={<NotFound/>} />
    </Route>
  </Routes>
}

export default App;

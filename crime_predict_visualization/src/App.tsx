import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import OurWork from './pages/OurWork';
import Demo from './pages/Demo';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Layout from './components/Layout';
import { ScrollProvider } from './contexts/ScrollContext';
import { AnimationProvider } from './contexts/AnimationContext';

function App() {
  return (
    <AnimationProvider>
      <ScrollProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ourwork" element={<OurWork />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Layout>
        </Router>
      </ScrollProvider>
    </AnimationProvider>
  );
}

export default App;

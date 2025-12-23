import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
const Home = lazy(() => import('./pages/Home'));
const OurWork = lazy(() => import('./pages/OurWork'));
const Demo = lazy(() => import('./pages/Demo'));
const Team = lazy(() => import('./pages/Team'));
const Contact = lazy(() => import('./pages/Contact'));
import Layout from './components/Layout';
import { ScrollProvider } from './contexts/ScrollContext';
import { AnimationProvider } from './contexts/AnimationContext';

function App() {
  return (
    <AnimationProvider>
      <ScrollProvider>
        <Router>
          <Layout>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ourwork" element={<OurWork />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </ScrollProvider>
    </AnimationProvider>
  );
}

export default App;

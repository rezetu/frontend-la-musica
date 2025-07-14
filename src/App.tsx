import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Users, Book, GraduationCap, type LucideIcon } from 'lucide-react';

import { cn } from './lib/utils';

import HomePage from './pages/HomePage';
import PessoasPage from './pages/PessoasPage';
import CursosPage from './pages/CursosPage';
import MatriculasPage from './pages/MatriculasPage';

type NavItem = {
  name: string;
  icon: LucideIcon; 
  path: string;
};

const navItems: NavItem[] = [
  { name: 'Início', icon: Home, path: '/' },
  { name: 'Pessoas', icon: Users, path: '/pessoas' },
  { name: 'Cursos', icon: Book, path: '/cursos' },
  { name: 'Matrículas', icon: GraduationCap, path: '/matriculas' },
];

function App() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Espaço La Música</h1>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                'flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-200',
                location.pathname === item.path && 'bg-gray-200 font-semibold'
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
          <h1 className="text-xl font-bold text-gray-900">Espaço La Música</h1>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pessoas" element={<PessoasPage />} />
            <Route path="/cursos" element={<CursosPage />} />
            <Route path="/matriculas" element={<MatriculasPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

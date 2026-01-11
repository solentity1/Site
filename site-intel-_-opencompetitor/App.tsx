import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Bot, Github, Twitter } from 'lucide-react';
import Home from './pages/Home';
import ToolRunner from './pages/ToolRunner';

const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 mt-auto">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
                <Bot className="w-6 h-6 text-indigo-600" />
                <span className="text-xl font-bold text-gray-900 tracking-tight">Site Intel</span>
            </div>
            <p className="text-slate-600 text-sm max-w-sm mb-6">
                Democratizing competitive intelligence. We believe SEO tools should be fast, free, and accessible to everyone.
            </p>
            <div className="flex space-x-4">
                <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors"><Github className="w-5 h-5"/></a>
                <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors"><Twitter className="w-5 h-5"/></a>
            </div>
        </div>
        <div>
            <h4 className="text-gray-900 font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-600">Cookie Policy</a></li>
            </ul>
        </div>
        <div>
            <h4 className="text-gray-900 font-semibold mb-4">Disclaimer</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
                All data presented is estimated by AI algorithms utilizing live search grounding. 
                We are not affiliated with Google or any analyzed brand. 
                Use for educational purposes only. AdSense Safe.
            </p>
        </div>
    </div>
    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Site Intel Open Source. Built with React & Gemini.
    </div>
  </footer>
);

const Header = () => (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <Link to="/" className="flex items-center space-x-2">
                    <Bot className="w-8 h-8 text-indigo-600" />
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Site Intel</span>
                </Link>
                <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                        <Link to="/" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Tools</Link>
                        <a href="#" className="text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</a>
                        <a href="#" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20">Analyze Now</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
);

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white text-slate-900">
        <Header />
        <main className="flex-grow">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tool/:toolId" element={<ToolRunner />} />
            </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
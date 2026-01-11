import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import * as Icons from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 bg-white opacity-90 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8 animate-in fade-in zoom-in duration-500">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            v2.2 Now Live • Enhanced Accuracy with Domain Age Checks
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
            Expose Any Website’s <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">
              Weakness & Strategy
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Analyze competitors, uncover SEO gaps, and detect growth opportunities with 10 premium tools. 
            <span className="text-slate-900 font-semibold block mt-2">100% Free. No Sign Up.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/tool/weakness-scanner" 
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/25 hover:scale-105"
            >
              Analyze a Website
            </Link>
            <a 
              href="#tools" 
              className="px-8 py-4 bg-white hover:bg-gray-50 text-slate-700 border border-gray-200 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-sm"
            >
              View All Tools
            </a>
          </div>
        </div>
      </section>

      {/* Tool Grid */}
      <section id="tools" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">The Intelligence Suite</h2>
            <p className="text-slate-500">Ten powerful tools to dissect any domain on the web.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool) => {
              const Icon = (Icons as any)[tool.icon];
              return (
                <Link 
                  key={tool.id} 
                  to={`/tool/${tool.id}`}
                  className="group bg-white border border-gray-200 hover:border-indigo-500 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icons.ArrowUpRight className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${tool.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{tool.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{tool.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust/About Section */}
      <section className="py-20 px-4 border-t border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Why Use Site Intel?</h2>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Icons.ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Privacy First</h4>
                    <p className="text-slate-500 text-sm">No data storage. No tracking cookies. Your analysis is ephemeral.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Icons.Zap className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">Lightning Fast</h4>
                    <p className="text-slate-500 text-sm">Built on React for instant interactions and zero page loads.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Icons.Unlock className="w-10 h-10 text-indigo-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-slate-900 mb-2">100% Unlocked</h4>
                    <p className="text-slate-500 text-sm">No credit cards. No "Upgrade for Pro". Every tool is free.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
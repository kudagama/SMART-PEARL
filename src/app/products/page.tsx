"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, Wifi, Smartphone, Tv, Phone, Shield, ArrowRight, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import CopilotChat from '@/components/copilot/CopilotChat';

const products = [
  {
    id: 'slt-fibre',
    name: 'SLT Fibre',
    category: 'Broadband',
    icon: <Wifi className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-400',
    description: 'Ultra-fast fiber optic broadband for seamless streaming and gaming.',
    features: ['Up to 1 Gbps speeds', 'Unlimited data plans', 'Free router included'],
    price: 'Starting at LKR 1,490/mo',
  },
  {
    id: 'peo-tv',
    name: 'PEO TV',
    category: 'Entertainment',
    icon: <Tv className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-500',
    description: 'Premium IPTV service with HD channels and interactive features.',
    features: ['150+ Channels', 'Catch-up TV (up to 48 hours)', 'Video on Demand (VOD)'],
    price: 'Starting at LKR 990/mo',
  },
  {
    id: 'mobitel-mobile',
    name: 'Mobitel Mobile',
    category: 'Mobile',
    icon: <Smartphone className="w-8 h-8" />,
    color: 'from-emerald-400 to-teal-500',
    description: 'Reliable mobile network with 4G/5G coverage nationwide.',
    features: ['Prepaid & Postpaid', 'Roaming packages', 'Unlimited social media'],
    price: 'Packages from LKR 400',
  },
  {
    id: 'slt-voice',
    name: 'SLT Voice (Megaline)',
    category: 'Voice',
    icon: <Phone className="w-8 h-8" />,
    color: 'from-orange-400 to-rose-400',
    description: 'Crystal clear fixed-line voice services for homes and businesses.',
    features: ['Free SLT to SLT calls', 'Low IDD rates', 'Value added services'],
    price: 'Starting at LKR 300/mo',
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security Solutions',
    category: 'Enterprise',
    icon: <Shield className="w-8 h-8" />,
    color: 'from-slate-600 to-slate-800',
    description: 'Advanced threat protection and managed security for enterprises.',
    features: ['DDoS Protection', 'Managed Firewall', 'Security Operations Center'],
    price: 'Custom Pricing',
  }
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex w-full h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="flex-1 flex overflow-hidden bg-slate-50/50">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto relative">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-200/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 px-8 py-10 max-w-6xl mx-auto w-full">
          
          <header className="mb-12">
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-sm font-bold mb-4"
            >
              <Zap className="w-4 h-4 fill-blue-500" />
              SLT Product Catalog
            </motion.div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005696] to-[#00A3E0]">Services</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              Quickly find information about SLT\'s wide range of products to assist customers with their inquiries and provide accurate details.
            </p>
          </header>

          {/* Search Bar */}
          <div className="relative mb-10 max-w-xl group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[#005696] transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005696]/20 focus:border-[#005696] transition-all text-slate-700 font-medium placeholder-slate-400"
              placeholder="Search products, services, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
                  className={`relative overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer ${
                    selectedProduct === product.id 
                    ? 'border-[#005696]/30 shadow-[0_8px_30px_rgba(0,86,150,0.12)] bg-white' 
                    : 'border-slate-200/60 shadow-sm bg-white/60 hover:bg-white hover:shadow-md hover:-translate-y-1'
                  }`}
                >
                  <div className={`h-2 w-full bg-gradient-to-r ${product.color}`} />
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${product.color} text-white shadow-sm`}>
                        {product.icon}
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{product.name}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                      {product.description}
                    </p>

                    <div className={`space-y-4 overflow-hidden transition-all duration-300 ${selectedProduct === product.id ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                      <div className="h-px w-full bg-slate-100" />
                      
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-amber-500" /> Key Features
                        </h4>
                        <ul className="space-y-2">
                          {product.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Pricing</p>
                          <p className="text-sm font-bold text-slate-800">{product.price}</p>
                        </div>
                        <button className="flex items-center justify-center w-8 h-8 rounded-full bg-[#005696] text-white hover:bg-[#00407a] transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">No products found</h3>
              <p className="text-sm text-slate-500 font-medium">Try adjusting your search terms.</p>
            </div>
          )}

        </div>
      </div>
      </div>
      <CopilotChat />
    </div>
  );
}

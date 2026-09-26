import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import AddItemPage from './pages/AddItemPage';
import ItemDetailPage from './pages/ItemDetailPage';
import AuthPage from './pages/AuthPage';
import MyItemsPage from './pages/MyItemsPage';
import MyRequestsPage from './pages/MyRequestsPage';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen bg-paper text-ink">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/add" element={<AddItemPage />} />
              <Route path="/item/:id" element={<ItemDetailPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/my-items" element={<MyItemsPage />} />
              <Route path="/my-requests" element={<MyRequestsPage />} />
            </Routes>
          </main>
          <footer className="border-t border-lead/20 py-8 mt-12">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <p className="font-serif italic text-lead text-sm">
                ShareZone — kết nối hàng xóm qua những món đồ nhỏ
              </p>
            </div>
          </footer>
        </div>
      </HashRouter>
    </AppProvider>
  );
}

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { MapPin, ClipboardList, Package, LogOut, MessageCircle, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Navbar() {
  const { currentUser, logout, getTotalUnreadCount } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');
  const unreadCount = currentUser ? getTotalUnreadCount(currentUser.id) : 0;

  return (
    <header className="border-b-2 border-ink/10 bg-paper">
      {/* Supabase config warning banner */}
      {!isSupabaseConfigured && (
        <div className="bg-butter/20 border-b border-butter/30 px-6 py-2 flex items-center gap-2 text-xs text-ink-light">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>Chế độ demo:</strong> Đang dùng localStorage.{' '}
            <a
              href="https://github.com/your-repo/blob/main/SUPABASE_SETUP.md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-moss-dark"
            >
              Cấu hình Supabase →
            </a>
          </span>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-start justify-between">
          {/* Left: Title like notebook cover */}
          <div>
            <Link to="/" className="block">
              <h1 className="font-serif text-3xl font-bold text-ink tracking-tight leading-tight">
                ShareZone
              </h1>
              <p className="font-serif italic text-lead text-sm mt-0.5">
                bảng tin đồ dùng thành phố
              </p>
            </Link>
          </div>

          {/* Right: Nav + Actions */}
          <div className="flex items-center gap-4">
            {/* Nav links - minimal, text-based */}
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <Link
                to="/map"
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive('/map') ? 'text-moss font-medium' : 'text-lead hover:text-ink'
                }`}
              >
                <MapPin className="w-4 h-4" />
                bản đồ
              </Link>
              {currentUser && (
                <>
                  <Link
                    to="/messages"
                    className={`flex items-center gap-1.5 transition-colors relative ${
                      isActive('/messages') ? 'text-moss font-medium' : 'text-lead hover:text-ink'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    tin nhắn
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-3 bg-terracotta text-paper text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/my-items"
                    className={`flex items-center gap-1.5 transition-colors ${
                      isActive('/my-items') ? 'text-moss font-medium' : 'text-lead hover:text-ink'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    đồ của tôi
                  </Link>
                  <Link
                    to="/my-requests"
                    className={`flex items-center gap-1.5 transition-colors ${
                      isActive('/my-requests') ? 'text-moss font-medium' : 'text-lead hover:text-ink'
                    }`}
                  >
                    <ClipboardList className="w-4 h-4" />
                    yêu cầu
                  </Link>
                </>
              )}
            </nav>

            {/* Auth / Post button */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/add"
                  className="px-4 py-2 bg-moss text-paper text-sm font-medium rounded-sm hover:bg-moss-dark transition-colors"
                >
                  + đăng đồ
                </Link>
                <div className="hidden md:flex items-center gap-2 text-sm text-lead">
                  <span>{currentUser.name}</span>
                  <button
                    onClick={logout}
                    className="p-1.5 text-lead hover:text-terracotta transition-colors"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 bg-moss text-paper text-sm font-medium rounded-sm hover:bg-moss-dark transition-colors"
              >
                đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

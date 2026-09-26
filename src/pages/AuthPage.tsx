import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('email không tồn tại. thử: minh@demo.com, lan@demo.com, hung@demo.com, hoa@demo.com');
      }
    } else {
      if (!name.trim()) {
        setError('vui lòng nhập tên');
        return;
      }
      const success = register(email, name, password);
      if (success) {
        navigate('/');
      } else {
        setError('email đã được sử dụng');
      }
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-paper-dark/40 border border-lead/20 rounded-sm text-sm text-ink placeholder:text-lead-light focus:outline-none focus:border-moss/50 focus:bg-paper transition-colors";

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-ink mb-1">
            {isLogin ? 'chào bạn trở lại' : 'tham gia bảng tin'}
          </h1>
          <p className="font-serif italic text-lead text-sm">
            {isLogin ? 'đăng nhập để xem và đăng đồ' : 'tạo tài khoản để bắt đầu chia sẻ'}
          </p>
        </div>

        <div className="border border-lead/15 rounded-sm bg-paper p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-ink mb-1.5">tên của bạn</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-ink mb-1.5">email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-ink mb-1.5">mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                className={inputClass}
                required
              />
            </div>

            {error && (
              <div className="bg-terracotta/10 border border-terracotta/20 text-terracotta text-sm rounded-sm p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-moss text-paper font-medium rounded-sm hover:bg-moss-dark transition-colors"
            >
              {isLogin ? 'đăng nhập' : 'tạo tài khoản'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-moss hover:text-moss-dark font-medium"
            >
              {isLogin ? 'chưa có tài khoản? tạo mới' : 'đã có tài khoản? đăng nhập'}
            </button>
          </div>

          {isLogin && (
            <div className="mt-4 p-3 bg-butter/10 border border-butter/20 rounded-sm">
              <p className="text-xs text-ink-light font-medium mb-1">tài khoản demo:</p>
              <div className="text-xs text-lead space-y-0.5">
                <p>• minh@demo.com (mật khẩu: bất kỳ)</p>
                <p>• lan@demo.com • hung@demo.com • hoa@demo.com</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

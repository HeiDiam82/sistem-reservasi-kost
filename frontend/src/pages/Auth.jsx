import React, { useState } from 'react';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    no_hp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        onLoginSuccess(data.data);
      } else {
        setError(data.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80svh] flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-w-4xl w-full animate-fade-in">
        {/* Left Side - Image/Info */}
        <div className="md:w-1/2 bg-primary p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <circle cx="0" cy="0" r="50" fill="white" />
              <circle cx="100" cy="100" r="40" fill="white" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="bg-white p-2 rounded-lg inline-block mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F2B8C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">Selamat Datang di KostReservation</h2>
            <p className="text-gray-300 text-lg">
              {isLogin 
                ? 'Masuk untuk mengelola reservasi dan melihat penawaran menarik kami.' 
                : 'Daftar sekarang dan temukan hunian impianmu dalam hitungan menit.'}
            </p>
          </div>
          
          <div className="relative z-10 pt-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <img key={i} className="w-10 h-10 rounded-full border-2 border-primary object-cover" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-primary bg-secondary flex items-center justify-center text-xs font-bold">
                +2k
              </div>
            </div>
            <p className="text-sm mt-3 text-gray-400">Bergabung dengan 2,000+ penyewa lainnya.</p>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="md:w-1/2 p-12">
          <div className="mb-8 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-primary">{isLogin ? 'Login' : 'Daftar Akun'}</h3>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent font-bold text-sm hover:underline"
            >
              {isLogin ? 'Buat Akun Baru' : 'Sudah punya akun?'}
            </button>
          </div>
          
          {error && (
            <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="nama"
                    required
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">No. WhatsApp</label>
                  <input 
                    type="tel" 
                    name="no_hp"
                    required
                    value={formData.no_hp}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all"
                    placeholder="Contoh: 08123456789"
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all"
                placeholder="email@contoh.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-primary-light transition-all transform active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </span>
              ) : (
                isLogin ? 'Masuk Sekarang' : 'Daftar Sekarang'
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-text-muted">
              Dengan melanjutkan, Anda menyetujui <a href="/terms" className="text-primary hover:underline">Ketentuan Layanan</a> dan <a href="/privacy" className="text-primary hover:underline">Kebijakan Privasi</a> kami.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

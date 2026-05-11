import React, { useState, useEffect } from 'react';
import RoomCard from '../components/RoomCard';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch rooms from API
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/kamar');
        const data = await response.json();
        if (data.success) {
          setRooms(data.data);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1554995207-c18c203602cb" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent"></div>
        </div>
        
        <div className="container relative z-10 text-white">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-5xl md:text-6xl mb-6">Hunian Nyaman, <br/>Harga Bersahabat.</h1>
            <p className="text-xl text-gray-200 mb-8 max-w-lg">
              Temukan berbagai pilihan kost berkualitas dengan fasilitas lengkap di lokasi strategis. Booking sekarang tanpa ribet.
            </p>
            <div className="flex gap-4">
              <a href="#listings" className="bg-secondary text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 shadow-lg">
                Cari Kost Sekarang
              </a>
              <a href="/about" className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg border border-white/30 hover:bg-white/30">
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mb-20 -mt-24 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-primary mb-1">50+</p>
            <p className="text-text-muted">Kamar Pilihan</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-1">100+</p>
            <p className="text-text-muted">Penyewa Aktif</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-1">10+</p>
            <p className="text-text-muted">Lokasi Strategis</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-1">4.8/5</p>
            <p className="text-text-muted">Rating Kepuasan</p>
          </div>
        </div>
      </section>

      {/* Room Listings */}
      <section id="listings" className="container">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl text-primary mb-2">Pilihan Kamar Terbaik</h2>
            <p className="text-text-muted">Kamar-kamar terbaru yang tersedia untukmu</p>
          </div>
          <a href="/rooms" className="text-accent font-bold hover:underline flex items-center gap-1">
            Lihat Semua 
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.length > 0 ? (
              rooms.map(room => (
                <RoomCard key={room.kamar_id} room={room} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-text-muted text-lg">Maaf, belum ada kamar yang tersedia saat ini.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-primary/5 py-20 mt-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl text-primary mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-text-muted max-w-2xl mx-auto">Kami memberikan layanan terbaik untuk memastikan kenyamanan dan keamanan hunian Anda.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1F2B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Keamanan 24 Jam</h4>
              <p className="text-text-muted">Sistem keamanan terjamin dengan CCTV dan penjagaan untuk ketenangan Anda.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F25028" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M16 8l-4 4-4-4"></path>
                  <path d="M12 12v8"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Lokasi Strategis</h4>
              <p className="text-text-muted">Dekat dengan kampus, perkantoran, dan fasilitas umum lainnya.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#026AF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Fasilitas Lengkap</h4>
              <p className="text-text-muted">Kamar sudah termasuk AC, WiFi cepat, laundry, dan pembersihan rutin.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

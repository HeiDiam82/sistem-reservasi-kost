import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RoomDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    tanggal_masuk: '',
    tanggal_keluar: '',
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/kamar/${id}`);
        const data = await response.json();
        if (data.success) {
          setRoom(data.data);
        }
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reservasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kamar_id: id,
          ...bookingData,
          total_harga: room.harga_bulan // simplified
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Reservasi berhasil dikirim! Silakan tunggu konfirmasi admin.');
        navigate('/');
      } else {
        alert(data.message || 'Gagal melakukan reservasi.');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi.');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!room) return <div className="container py-20 text-center">Kamar tidak ditemukan.</div>;

  return (
    <div className="container py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Gallery */}
        <div className="lg:w-2/3">
          <div className="rounded-3xl overflow-hidden shadow-lg mb-6 h-[400px]">
            <img 
              src={room.foto_kamar || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'} 
              className="w-full h-full object-cover"
              alt={`Kamar ${room.nomor_kamar}`}
            />
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block">
                  {room.nama_tipe}
                </span>
                <h1 className="text-4xl text-primary mt-2">Kamar No. {room.nomor_kamar}</h1>
                <p className="text-text-muted mt-2 flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Lantai {room.lantai}, Lokasi Strategis
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-secondary">Rp {parseInt(room.harga_bulan).toLocaleString()}</p>
                <p className="text-sm text-text-muted">/ bulan</p>
              </div>
            </div>

            <hr className="my-8 border-gray-100" />

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Fasilitas Kamar</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.fasilitas && room.fasilitas.split(',').map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-600">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    {f.trim()}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Deskripsi</h3>
              <p className="text-text-muted leading-relaxed">
                Kamar ini menawarkan kenyamanan ekstra dengan desain modern dan pencahayaan yang baik. 
                Dilengkapi dengan fasilitas penunjang yang akan membuat Anda merasa seperti di rumah sendiri.
                Sangat cocok untuk mahasiswa maupun profesional muda yang mencari hunian tenang dan bersih.
              </p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24 animate-fade-in">
            <h3 className="text-2xl font-bold mb-6 text-primary">Booking Sekarang</h3>
            
            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Masuk</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                  value={bookingData.tanggal_masuk}
                  onChange={(e) => setBookingData({...bookingData, tanggal_masuk: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Keluar (Estimasi)</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                  value={bookingData.tanggal_keluar}
                  onChange={(e) => setBookingData({...bookingData, tanggal_keluar: e.target.value})}
                />
              </div>

              <div className="bg-background p-4 rounded-2xl flex justify-between items-center">
                <span className="text-sm font-bold">Total Estimasi</span>
                <span className="text-lg font-bold text-secondary">Rp {parseInt(room.harga_bulan).toLocaleString()}</span>
              </div>

              <button 
                type="submit"
                className="w-full bg-secondary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transform active:scale-95 transition-all"
              >
                Konfirmasi Booking
              </button>
            </form>
            
            <p className="text-xs text-center text-text-muted mt-6">
              * Admin akan menghubungi Anda setelah konfirmasi untuk proses pembayaran.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;

import React, { useState, useEffect } from 'react';
import { API_BASE_URL, fetchWithAuth } from '../api/config';

const STAT_CARDS = [
  { key: 'total_users', label: 'Total Penyewa', icon: '👥', color: 'from-blue-500 to-blue-600', text: 'text-blue-500' },
  { key: 'total_reservasi', label: 'Total Reservasi', icon: '📋', color: 'from-orange-500 to-orange-600', text: 'text-orange-500' },
  { key: 'total_pendapatan', label: 'Pendapatan', icon: '💰', color: 'from-emerald-500 to-emerald-600', text: 'text-emerald-500', isCurrency: true },
  { key: 'kamar_tersedia', label: 'Kamar Tersedia', icon: '🏠', color: 'from-indigo-500 to-indigo-600', text: 'text-indigo-500' },
];

const STATUS_CONFIG = {
  dikonfirmasi: { class: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Dikonfirmasi', icon: '✅' },
  menunggu: { class: 'bg-amber-50 text-amber-600 border-amber-100', label: 'Menunggu', icon: '⏳' },
  ditolak: { class: 'bg-rose-50 text-rose-600 border-rose-100', label: 'Ditolak', icon: '❌' },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_users: 0, total_reservasi: 0, total_pendapatan: 0, kamar_tersedia: 0 });
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [newRoom, setNewRoom] = useState({ nomor_kamar: '', tipe_id: '', lantai: '1', status: 'tersedia', foto_kamar: '' });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/dashboard`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API_BASE_URL}/reservasi`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API_BASE_URL}/tipe-kamar`).then(r => r.json()),
    ]).then(([statsData, resData, typeData]) => {
      if (statsData.success) setStats(statsData.data);
      if (resData.success) setReservations(resData.data);
      if (typeData.success) setRoomTypes(typeData.data);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetchWithAuth(`/reservasi/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) fetchData();
      else alert(data.message);
    } catch (err) {
      alert('Terjadi kesalahan koneksi');
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchWithAuth('/kamar', {
        method: 'POST',
        body: JSON.stringify(newRoom),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewRoom({ nomor_kamar: '', tipe_id: '', lantai: '1', status: 'tersedia', foto_kamar: '' });
        fetchData();
      } else alert(data.message);
    } catch (err) {
      alert('Terjadi kesalahan koneksi');
    }
  };

  const filtered = activeTab === 'all' ? reservations : reservations.filter(r => r.status === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl text-primary">Overview</h1>
            <p className="text-muted font-medium">Selamat datang kembali, Admin! Kelola hunian Anda di sini.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-secondary px-8 py-3.5 shadow-xl shadow-secondary/20"
            >
              <span>➕</span> Tambah Kamar Baru
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STAT_CARDS.map((card) => (
            <div key={card.key} className="bg-white rounded-[2rem] p-8 shadow-premium border border-slate-100 flex items-center gap-6 relative overflow-hidden group hover:border-accent/20 transition-all">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-2xl text-white shadow-lg`}>
                {card.icon}
              </div>
              <div>
                <p className="text-3xl font-black text-primary">
                  {card.isCurrency ? `Rp ${parseInt(stats[card.key] || 0).toLocaleString('id-ID')}` : stats[card.key]}
                </p>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mt-1">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <h3 className="text-2xl font-black text-primary">Data Reservasi</h3>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
              {['all', 'menunggu', 'dikonfirmasi', 'ditolak'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all capitalize ${
                    activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab === 'all' ? 'Semua' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  {['Penyewa', 'Kamar', 'Check-in', 'Total Bayar', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="px-8 py-5 text-left text-[10px] font-black text-muted uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                   <tr><td colSpan="6" className="py-20 text-center text-muted font-bold">Memuat data...</td></tr>
                ) : filtered.length > 0 ? filtered.map((res) => {
                  const s = STATUS_CONFIG[res.status] || { class: 'bg-slate-100 text-slate-500', label: res.status };
                  return (
                    <tr key={res.reservasi_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">{res.nama_penyewa?.charAt(0)}</div>
                          <div>
                            <p className="font-bold text-slate-800">{res.nama_penyewa}</p>
                            <p className="text-xs text-muted">{res.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-800">No. {res.nomor_kamar}</p>
                        <p className="text-xs text-muted">{res.nama_tipe}</p>
                      </td>
                      <td className="px-8 py-6 text-sm font-medium text-slate-600">
                        {new Date(res.tanggal_masuk).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-black text-primary">Rp {parseInt(res.total_harga).toLocaleString('id-ID')}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${s.class}`}>
                          {s.icon} {s.label}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                          {res.status === 'menunggu' && (
                            <>
                              <button onClick={() => handleUpdateStatus(res.reservasi_id, 'dikonfirmasi')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Konfirmasi">✓</button>
                              <button onClick={() => handleUpdateStatus(res.reservasi_id, 'ditolak')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Tolak">✗</button>
                            </>
                          )}
                          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-primary hover:text-white transition-all shadow-sm">ℹ️</button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="6" className="py-24 text-center text-muted italic">Belum ada data reservasi.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Room Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary-deep/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-slide-up">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-primary">Tambah Kamar Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-xl">✕</button>
            </div>
            <form onSubmit={handleAddRoom} className="p-8 grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Nomor Kamar</label>
                <input type="text" required placeholder="A-101" className="input-premium" value={newRoom.nomor_kamar} onChange={(e) => setNewRoom({ ...newRoom, nomor_kamar: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Tipe Kamar</label>
                <select required className="input-premium appearance-none" value={newRoom.tipe_id} onChange={(e) => setNewRoom({ ...newRoom, tipe_id: e.target.value })}>
                  <option value="">Pilih Tipe</option>
                  {roomTypes.map(t => <option key={t.tipe_id} value={t.tipe_id}>{t.nama_tipe}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Lantai</label>
                <input type="number" required min="1" className="input-premium" value={newRoom.lantai} onChange={(e) => setNewRoom({ ...newRoom, lantai: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Status Awal</label>
                <select className="input-premium appearance-none" value={newRoom.status} onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value })}>
                  <option value="tersedia">Tersedia</option>
                  <option value="perbaikan">Perbaikan</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">URL Foto Kamar</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="input-premium"
                  value={newRoom.foto_kamar}
                  onChange={(e) => setNewRoom({ ...newRoom, foto_kamar: e.target.value })}
                />
                {newRoom.foto_kamar && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 h-48 bg-slate-100">
                    <img
                      src={newRoom.foto_kamar}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                      onLoad={(e) => { e.target.style.display = 'block'; }}
                    />
                  </div>
                )}
                {!newRoom.foto_kamar && (
                  <div className="mt-3 rounded-2xl border-2 border-dashed border-slate-200 h-48 flex flex-col items-center justify-center text-slate-400">
                    <span className="text-4xl mb-2">🖼️</span>
                    <p className="text-xs font-bold">Masukkan URL foto untuk preview</p>
                  </div>
                )}
              </div>
              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full btn-secondary py-4 text-lg font-black shadow-xl shadow-secondary/20">Simpan Unit Kamar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

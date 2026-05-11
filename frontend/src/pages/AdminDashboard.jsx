import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_reservasi: 0,
    total_pendapatan: 0,
    kamar_tersedia: 0
  });
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch('http://localhost:5000/api/dashboard');
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);

        // Fetch reservations
        const resRes = await fetch('http://localhost:5000/api/reservasi');
        const resData = await resRes.json();
        if (resData.success) setReservations(resData.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="container py-12">
      <div className="mb-10">
        <h1 className="text-3xl text-primary mb-2">Dashboard Admin</h1>
        <p className="text-text-muted">Kelola hunian dan reservasi penyewa Anda.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-400 uppercase mb-2">Total Penyewa</p>
          <p className="text-3xl font-bold text-primary">{stats.total_users}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-400 uppercase mb-2">Total Reservasi</p>
          <p className="text-3xl font-bold text-accent">{stats.total_reservasi}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-400 uppercase mb-2">Pendapatan</p>
          <p className="text-3xl font-bold text-success">Rp {parseInt(stats.total_pendapatan || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-400 uppercase mb-2">Kamar Tersedia</p>
          <p className="text-3xl font-bold text-secondary">{stats.kamar_tersedia}</p>
        </div>
      </div>

      {/* Recent Reservations Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-primary">Reservasi Terbaru</h3>
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-light">
            Download Laporan
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="p-4 font-bold">Penyewa</th>
                <th className="p-4 font-bold">Kamar</th>
                <th className="p-4 font-bold">Tanggal Masuk</th>
                <th className="p-4 font-bold">Total</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservations.length > 0 ? (
                reservations.map(res => (
                  <tr key={res.reservasi_id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold">{res.nama_penyewa || 'Tanpa Nama'}</p>
                      <p className="text-xs text-text-muted">{res.email}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold">No. {res.nomor_kamar}</p>
                      <p className="text-xs text-text-muted">{res.nama_tipe}</p>
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(res.tanggal_masuk).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4 font-bold text-sm">
                      Rp {parseInt(res.total_harga).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        res.status === 'dikonfirmasi' ? 'bg-success/10 text-success' :
                        res.status === 'menunggu' ? 'bg-warning/10 text-warning' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-accent hover:underline text-sm font-bold">Detail</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-text-muted">Tidak ada data reservasi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

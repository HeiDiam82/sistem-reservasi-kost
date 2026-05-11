import React from 'react';

const RoomCard = ({ room }) => {
  const { nomor_kamar, nama_tipe, harga_bulan, foto_kamar, fasilitas, status } = room;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all animate-fade-in group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={foto_kamar || 'https://via.placeholder.com/400x300'} 
          alt={`Kamar ${nomor_kamar}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
            status === 'tersedia' ? 'bg-success text-white' : 'bg-error text-white'
          }`}>
            {status}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-sm text-text-muted mb-1">{nama_tipe}</p>
            <h3 className="text-xl font-bold text-primary">No. {nomor_kamar}</h3>
          </div>
          <div className="text-right">
            <p className="text-secondary font-bold text-lg">Rp {parseInt(harga_bulan).toLocaleString()}</p>
            <p className="text-xs text-text-muted">/ bulan</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 mb-6">
          {fasilitas && fasilitas.split(',').slice(0, 3).map((f, i) => (
            <span key={i} className="text-xs bg-background px-2 py-1 rounded text-text-muted">
              {f.trim()}
            </span>
          ))}
        </div>
        
        <a 
          href={`/rooms/${room.kamar_id}`}
          className="block w-full text-center bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-light transition-colors"
        >
          Lihat Detail
        </a>
      </div>
    </div>
  );
};

export default RoomCard;

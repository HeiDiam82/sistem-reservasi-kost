import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white py-12 mt-auto">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white p-2 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F2B8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <span className="text-xl font-bold">KostReservation</span>
          </div>
          <p className="text-gray-400 max-w-sm">
            Solusi terbaik mencari dan memesan kost dengan mudah, aman, dan transparan. Temukan hunian impianmu sekarang.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Tautan Cepat</h4>
          <ul className="flex flex-col gap-2 text-gray-400">
            <li><a href="/" className="hover:text-white">Beranda</a></li>
            <li><a href="/rooms" className="hover:text-white">Cari Kamar</a></li>
            <li><a href="/about" className="hover:text-white">Tentang Kami</a></li>
            <li><a href="/contact" className="hover:text-white">Hubungi Kami</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Kontak</h4>
          <ul className="flex flex-col gap-2 text-gray-400">
            <li>Email: info@kostreservation.com</li>
            <li>Telepon: +62 812 3456 7890</li>
            <li>Alamat: Jakarta, Indonesia</li>
          </ul>
        </div>
      </div>
      <div className="container mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
        <p>&copy; 2024 KostReservation. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

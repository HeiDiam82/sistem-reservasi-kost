import { query } from '../config/db';

const getStats = async () => {
    const [
        totalKamar,
        kamarTersedia,
        reservasiAktif,
        pendapatanBulanIni,
        reservasiMenunggu,
        pembayaranPending
    ] = await Promise.all([
        query(`SELECT COUNT(*) FROM kamar`),
        query(`SELECT COUNT(*) FROM kamar WHERE status = 'tersedia'`),
        query(`SELECT COUNT(*) FROM reservasi WHERE status IN ('dikonfirmasi', 'berjalan')`),
        query(
            `SELECT COALESCE(SUM(jumlah_bayar), 0) AS total
             FROM pembayaran
             WHERE status = 'sukses'
               AND EXTRACT(MONTH FROM tanggal_bayar) = EXTRACT(MONTH FROM CURRENT_DATE)
               AND EXTRACT(YEAR  FROM tanggal_bayar) = EXTRACT(YEAR  FROM CURRENT_DATE)`
        ),
        query(`SELECT COUNT(*) FROM reservasi WHERE status = 'menunggu'`),
        query(`SELECT COUNT(*) FROM pembayaran WHERE status = 'pending'`)
    ]);

    return {
        total_kamar:           parseInt(totalKamar.rows[0].count),
        kamar_tersedia:        parseInt(kamarTersedia.rows[0].count),
        total_reservasi_aktif: parseInt(reservasiAktif.rows[0].count),
        pendapatan_bulan_ini:  parseFloat(pendapatanBulanIni.rows[0].total),
        reservasi_menunggu:    parseInt(reservasiMenunggu.rows[0].count),
        pembayaran_pending:    parseInt(pembayaranPending.rows[0].count)
    };
};

export default { getStats };

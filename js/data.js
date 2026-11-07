// data.js - data dummy (pengganti database)
const dataUsers = [
  { nama: "Mahasiswa Demo", email: "mahasiswa@toko.id", password: "123456" }
];

const dataKatalogBuku = [
  { kode: "BK001", judul: "Dasar Pemrograman Web", penulis: "Rina Wijaya", kategori: "Teknologi", harga: 85000, stok: 24, gambar: "img/buku1.png" },
  { kode: "BK002", judul: "Belajar JavaScript Modern", penulis: "Andi Pratama", kategori: "Teknologi", harga: 98000, stok: 15, gambar: "img/buku2.png" },
  { kode: "BK003", judul: "Desain Antarmuka yang Ramah", penulis: "Sari Lestari", kategori: "Desain", harga: 110000, stok: 4, gambar: "img/buku3.png" },
  { kode: "BK004", judul: "Algoritma dan Struktur Data", penulis: "Budi Santoso", kategori: "Teknologi", harga: 120000, stok: 9, gambar: "img/buku4.png" },
  { kode: "BK005", judul: "Laskar Pelangi", penulis: "Andrea Hirata", kategori: "Novel", harga: 79000, stok: 30, gambar: "img/buku5.png" },
  { kode: "BK006", judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer", kategori: "Novel", harga: 95000, stok: 3, gambar: "img/buku6.png" },
  { kode: "BK007", judul: "Atomic Habits (Terjemahan)", penulis: "James Clear", kategori: "Pengembangan Diri", harga: 99000, stok: 18, gambar: "img/buku7.png" },
  { kode: "BK008", judul: "Ekonomi untuk Pemula", penulis: "Dewi Anggraini", kategori: "Ekonomi", harga: 72000, stok: 12, gambar: "img/buku8.png" }
];

// status: 0 Diproses, 1 Dikemas, 2 Dalam pengiriman, 3 Tiba di kota tujuan, 4 Diterima
const dataPengiriman = [
  { do: "DO-2026001", nama: "Rina Wijaya", ekspedisi: "JNE", tanggal: "2026-11-03", paket: "Reguler", total: 205000, status: 2 },
  { do: "DO-2026002", nama: "Andi Pratama", ekspedisi: "J&T", tanggal: "2026-11-01", paket: "Express", total: 316000, status: 4 },
  { do: "DO-2026003", nama: "Sari Lestari", ekspedisi: "SiCepat", tanggal: "2026-11-06", paket: "Reguler", total: 125000, status: 0 }
];

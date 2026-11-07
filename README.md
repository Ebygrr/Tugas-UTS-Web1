# Toko Buku Senja

Aplikasi web sederhana untuk pemesanan buku pada toko online.
Dibuat sebagai **Tugas UTS Pemrograman Web 1**.

| | |
|---|---|
| **Nama** | Saqila Elby Neina |
| **NIM** | 312510173 |
| **Mata Kuliah** | Pemrograman Web 1 |
| **Dosen** | Agung Nugroho, S.Kom., M.Kom. |

---

## Daftar Isi

1. [Deskripsi Project](#deskripsi-project)
2. [Fitur](#fitur)
3. [Teknologi](#teknologi)
4. [Struktur Folder](#struktur-folder)
5. [Cara Menjalankan](#cara-menjalankan)
6. [Penjelasan Data](#penjelasan-data)
7. [Hasil Tangkapan Layar dan Penjelasan Proses](#hasil-tangkapan-layar-dan-penjelasan-proses)
8. [Pemenuhan Kriteria Penilaian](#pemenuhan-kriteria-penilaian)

---

## Deskripsi Project

Toko Buku Senja adalah aplikasi **front-end** untuk memesan buku secara online. Aplikasi ini tidak memakai server atau database. Semua data (katalog buku, akun pengguna, dan data pengiriman) disimpan di file JavaScript terpisah (`js/data.js`) dalam format array JSON. Perubahan yang dibuat pengguna (stok baru, pesanan, akun baru) disimpan di `localStorage` browser supaya tidak hilang saat berpindah halaman atau me-refresh.

Alur penggunaan:

```
Login -> Dashboard -> Katalog/Stok -> Pemesanan -> Tracking Pengiriman
                  \-> Laporan Pemesanan, History Transaksi
```

## Fitur

| Halaman | File | Fitur utama |
|---|---|---|
| Login | `index.html` | Validasi email dan password, alert jika salah, modal Lupa Password dan Daftar |
| Dashboard | `dashboard.html` | Sapaan sesuai jam lokal, menu navigasi, modal Laporan dan History |
| Stok / Katalog | `stok.html` | Tabel dinamis dari `dataKatalogBuku`, tambah baris stok lewat DOM, cari, hapus |
| Pemesanan | `checkout.html` | Tambah, ubah, dan hapus pesanan, data pemesan, pembayaran, ongkir, validasi form |
| Tracking | `tracking.html` | Cari Nomor Delivery Order, progress bar status, detail ekspedisi dan pembayaran |

## Teknologi

- **HTML5 semantik** (`header`, `nav`, `main`, `section`, `aside`, `footer`, `label` terhubung ke `input`)
- **CSS eksternal** (Flexbox, Grid, CSS variable, media query, responsif), ditambah sedikit gaya inline untuk nilai dinamis
- **JavaScript** (manipulasi DOM, validasi form, modal, `localStorage`)

## Struktur Folder

```
tugas-uts-web1/
|-- index.html        (halaman login)
|-- dashboard.html
|-- stok.html
|-- tracking.html
|-- checkout.html
|-- css/
|   |-- style.css
|-- js/
|   |-- script.js     (logika semua halaman)
|   |-- data.js       (data dummy)
|-- assets/
|   |-- logo.png      (opsional)
|-- img/
|   |-- buku1.png ... (cover buku)
|-- screenshots/      (gambar untuk README ini)
|-- README.md
```

## Cara Menjalankan

1. Unduh atau ekstrak folder project.
2. Buka `index.html` dengan browser (Chrome, Edge, Firefox). Tidak perlu server.
3. Login dengan akun demo:

   ```
   Email    : mahasiswa@toko.id
   Password : 123456
   ```

   Atau klik **Daftar** untuk membuat akun baru.

Nomor Delivery Order contoh untuk halaman Tracking: `DO-2026001`, `DO-2026002`, `DO-2026003`.

## Penjelasan Data

`js/data.js` berisi tiga variabel:

- `dataUsers`: akun yang bisa dipakai login.
- `dataKatalogBuku`: katalog buku (kode, judul, penulis, kategori, harga, stok, gambar).
- `dataPengiriman`: contoh data pengiriman untuk halaman Tracking.

Data dipisah dari logika (`script.js`) supaya kalau suatu saat sumber data diganti dengan database atau API, logika tampilan tidak perlu diubah.

---

## Hasil Tangkapan Layar dan Penjelasan Proses

### 1. Halaman Login

![Halaman login](<img width="1365" height="597" alt="image" src="https://github.com/user-attachments/assets/79f9e82c-49ea-40e4-a0d6-13f73efa2683" />
)

Halaman awal berisi form email dan password, tombol **Login**, serta tombol **Lupa Password** dan **Daftar**. Panel kiri berisi ilustrasi deretan buku sebagai identitas visual toko.

**Validasi form login.** Jika kolom kosong, muncul pop-up pengingat.

![Validasi login](<img width="476" height="168" alt="image" src="https://github.com/user-attachments/assets/50bf2f22-a5fa-44ed-b7f1-86e7f6da617b" />
)

Jika email atau password tidak cocok dengan data, muncul alert berisi **"Email/password yang anda masukkan salah"**. Alert ini memakai `alert()` bawaan browser sehingga tidak tampak di screenshot.

**Modal Lupa Password.** Pengguna memasukkan email, lalu sistem mensimulasikan pengiriman tautan reset.

![Lupa password](<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/514cf819-a470-41b3-b56c-cf1498debe37" />
)

**Modal Daftar.** Validasi: nama minimal 3 karakter, format email benar, password minimal 6 karakter, dan email belum terdaftar.

![Daftar akun](<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/44e8b7a4-4220-4e2e-8290-26fe982aab26" />
)

Setelah berhasil, akun disimpan di `localStorage` dan langsung bisa dipakai login.

![Daftar berhasil](<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/4418685c-1fe6-4418-bfa1-fc41a7d86c77" />
)

### 2. Dashboard

![Dashboard](<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/3d8071e2-b07a-4b87-a9b9-de19ebfc1d18" />
)

Sapaan berubah sesuai jam lokal (pagi, siang, sore, malam), dihitung dengan `new Date().getHours()`. Menu berisi tombol ke Stok/Katalog, Tracking Pengiriman, Laporan Pemesanan, History Transaksi, dan Buat Pesanan. Laporan dan History tampil sebagai modal (lihat bagian 6).

### 3. Informasi Stok / Katalog

![Halaman stok](<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/2d47077a-08ad-47fe-a262-d685285bf729" />
)

Tabel dibuat dinamis dari `dataKatalogBuku`: HTML hanya menyediakan `tbody` kosong, lalu JavaScript membuat baris dengan `document.createElement`. Stok yang tinggal 5 atau kurang diberi warna kuning. Tersedia kolom pencarian dan tombol hapus.

**Validasi tambah stok.** Jika ada kolom yang kosong atau tidak valid (misalnya kode sudah dipakai, harga 0), muncul daftar kesalahan.

![Validasi stok](<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/318499f2-506b-4b12-aa73-da7d774d06fe" />
)

**Tambah baris stok baru.** Setelah form diisi dengan benar, baris baru langsung muncul di tabel tanpa refresh, dibuat dengan `createElement` dan `appendChild`.

![Stok bertambah](<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/96323fb5-6742-4fd2-a93d-8e415251c47c" />
)

### 4. Halaman Pemesanan (Checkout)

![Checkout kosong](<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/60e8a195-48e7-4866-98ca-b5354157aec0" />
)

Pilihan buku diambil dari katalog yang sama dengan halaman stok, jadi buku yang baru ditambahkan juga muncul di sini. Tabel pesanan masih kosong di awal.

**Menambah dan mengubah pesanan.** Buku dipilih lalu ditambahkan. Jumlah bisa diubah langsung di tabel dan tidak boleh melebihi stok. Tombol **Hapus** menghapus satu baris. Total otomatis menghitung subtotal ditambah ongkir sesuai ekspedisi.

![Pesanan terisi](<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/444bc605-48e8-4fcf-8497-fb413714a41b" />
)

**Validasi form pemesan dan pembayaran.** Semua kesalahan ditampilkan sekaligus (nama, email, nomor HP diawali 08, alamat, ekspedisi, metode pembayaran).

![Validasi checkout](<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/014dafa4-544b-45e4-a619-ff4435be3a89" />
)

**Pesanan berhasil.** Sistem membuat **Nomor Delivery Order**, mengurangi stok buku, dan menyimpan transaksi ke riwayat.

![Pesanan berhasil](<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/b8c2ee01-6693-4f64-b190-7b92b9f2523f" />
)

### 5. Informasi Pengiriman (Tracking)

![Halaman tracking](<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/3d431bcd-5b5b-4f3d-b32b-70db3de88bce" />
)

Pengguna memasukkan Nomor Delivery Order lalu menekan **Cari**.

**Hasil pencarian data contoh (DO-2026001).** Tampil nama pemesan, status pengiriman dalam bentuk progress bar dan lima langkah (Diproses, Dikemas, Dalam pengiriman, Tiba di kota tujuan, Diterima), serta ekspedisi, tanggal kirim, jenis paket, dan total pembayaran.

![Hasil tracking](<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/cc35105f-39b8-4776-8661-fcefc56e2fe5" />
)

**Hasil pencarian pesanan yang baru dibuat.** Nomor DO dari checkout bisa dilacak. Status pesanan baru maju otomatis tiap menit sebagai simulasi.


**Nomor tidak ditemukan.** Muncul pesan bahwa nomor tidak ditemukan.

![Tracking tidak ditemukan](<img width="1365" height="592" alt="image" src="https://github.com/user-attachments/assets/cb11d835-de7e-4071-b7ed-3f134fae6da9" />
)

### 6. Laporan Pemesanan dan History Transaksi

Setelah ada pesanan, **Laporan Pemesanan** menampilkan jumlah pesanan, jumlah buku terjual, dan total pendapatan.

![Laporan pemesanan](<img width="1365" height="597" alt="image" src="https://github.com/user-attachments/assets/b3447e59-cb4b-46a6-b4ee-41b9448927ad" />
)

**History Transaksi** menampilkan daftar nomor DO, tanggal, dan total tiap pesanan.

![History transaksi](<img width="1365" height="597" alt="image" src="https://github.com/user-attachments/assets/06aca4a2-3130-4a87-96cb-a27860cd0477" />
)

---

## Pemenuhan Kriteria Penilaian

| Kriteria | Penerapan |
|---|---|
| Struktur HTML semantik, valid, lengkap | Elemen semantik, `label` terhubung ke `input`, `lang="id"`, `meta viewport` |
| Desain CSS | CSS eksternal, CSS variable, Flexbox dan Grid, responsif, tema hijau dan kuning bertema buku |
| JavaScript DOM | Tabel dinamis, tambah, ubah, dan hapus baris, pencarian, progress bar tracking |
| Validasi form dan alert | Pop-up, alert, dan modal untuk setiap kesalahan input |
| Modularitas file | HTML, CSS, JS, dan data dipisah; data di `data.js`, logika di `script.js` |
| Kreativitas tambahan | Tema toko buku, laporan dan history, stok berkurang otomatis, status pengiriman otomatis maju |

---

## Catatan

- Data tersimpan di `localStorage`. Untuk mengembalikan data awal, hapus data situs lewat pengaturan browser (atau Developer Tools, tab Application, Clear site data).
- Font diambil dari Google Fonts. Tanpa internet, tampilan memakai font cadangan bawaan sistem.
- Cover buku diambil dari folder `img/`. Jika gambar belum ada, tabel tetap tampil dengan kotak hijau sebagai pengganti.

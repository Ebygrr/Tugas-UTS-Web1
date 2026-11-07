/* script.js - logika semua halaman (DOM, validasi, modal) */
const $ = (s, r = document) => r.querySelector(s);
const rupiah = n => 'Rp ' + Number(n).toLocaleString('id-ID');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
};

/* ---------- Modal / pop-up ---------- */
function showModal(title, html, onReady) {
  const o = document.createElement('div');
  o.className = 'overlay';
  o.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><button class="close" aria-label="Tutup">&times;</button><h2>${esc(title)}</h2><div>${html}</div></div>`;
  document.body.appendChild(o);
  const close = () => o.remove();
  $('.close', o).onclick = close;
  o.onclick = e => { if (e.target === o) close(); };
  document.addEventListener('keydown', function h(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', h); } });
  if (onReady) onReady(o, close);
  const first = $('input,button:not(.close)', o); if (first) first.focus();
  return close;
}
const notif = (msg, ok = false) =>
  showModal(ok ? 'Berhasil' : 'Periksa kembali', `<div>${msg}</div><button class="btn" onclick="this.closest('.overlay').remove()">OK</button>`);
const errList = arr => `<ul>${arr.map(e => `<li>${esc(e)}</li>`).join('')}</ul>`;

/* ---------- LOGIN ---------- */
function initLogin() {
  $('#formLogin').onsubmit = e => {
    e.preventDefault();
    const em = $('#email').value.trim().toLowerCase(), pw = $('#password').value;
    if (!em || !pw) return notif('Email dan password wajib diisi.');
    const u = [...dataUsers, ...store.get('users', [])].find(x => x.email === em && x.password === pw);
    if (!u) return alert('Email/password yang anda masukkan salah');
    store.set('user', { nama: u.nama, email: u.email });
    location.href = 'dashboard.html';
  };
  $('#btnLupa').onclick = () => showModal('Lupa password',
    `<form novalidate><label for="emLupa">Email terdaftar</label><input id="emLupa" type="email"><button class="btn" type="submit">Kirim tautan reset</button></form>`,
    (o, close) => $('form', o).onsubmit = e => {
      e.preventDefault();
      const em = $('#emLupa').value.trim();
      if (!/^\S+@\S+\.\S+$/.test(em)) return alert('Format email tidak valid.');
      close(); notif(`Tautan reset password dikirim ke <b>${esc(em)}</b> (simulasi).`, true);
    });
  $('#btnDaftar').onclick = () => showModal('Daftar akun baru',
    `<form novalidate><label for="rn">Nama lengkap</label><input id="rn"><label for="re">Email</label><input id="re" type="email"><label for="rp">Password (min. 6 karakter)</label><input id="rp" type="password"><button class="btn" type="submit">Daftar</button></form>`,
    (o, close) => $('form', o).onsubmit = e => {
      e.preventDefault();
      const nama = $('#rn').value.trim(), em = $('#re').value.trim().toLowerCase(), pw = $('#rp').value, err = [];
      const users = store.get('users', []);
      if (nama.length < 3) err.push('Nama minimal 3 karakter.');
      if (!/^\S+@\S+\.\S+$/.test(em)) err.push('Format email tidak valid.');
      if (pw.length < 6) err.push('Password minimal 6 karakter.');
      if ([...dataUsers, ...users].some(x => x.email === em)) err.push('Email sudah terdaftar.');
      if (err.length) return alert(err.join('\n'));
      users.push({ nama, email: em, password: pw }); store.set('users', users);
      close(); notif('Akun berhasil dibuat. Silakan login.', true);
    });
}

/* ---------- DASHBOARD ---------- */
function initDashboard() {
  const h = new Date().getHours();
  const waktu = h < 11 ? 'pagi' : h < 15 ? 'siang' : h < 18 ? 'sore' : 'malam';
  $('#greeting').textContent = `Selamat ${waktu}, ${store.get('user', {}).nama || 'Pelanggan'}!`;
  $('#subgreet').textContent = 'Sekarang pukul ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' waktu setempat.';
  const trx = () => store.get('transaksi', []);
  $('#btnLaporan').onclick = () => {
    const t = trx();
    const buku = t.reduce((a, x) => a + x.items.reduce((s, i) => s + i.qty, 0), 0);
    showModal('Laporan Pemesanan', `<dl><dt>Jumlah pesanan</dt><dd>${t.length}</dd><dt>Buku terjual</dt><dd>${buku}</dd><dt>Total pendapatan</dt><dd>${rupiah(t.reduce((a, x) => a + x.total, 0))}</dd></dl>${t.length ? '' : '<p>Belum ada pesanan. Buat pesanan lewat menu Pemesanan.</p>'}`);
  };
  $('#btnHistory').onclick = () => {
    const t = trx();
    showModal('History Transaksi', t.length
      ? `<div class="tablewrap"><table><thead><tr><th>No. DO</th><th>Tanggal</th><th>Total</th></tr></thead><tbody>${t.map(x => `<tr><td>${esc(x.do)}</td><td>${esc(x.tanggal)}</td><td>${rupiah(x.total)}</td></tr>`).join('')}</tbody></table></div>`
      : '<p>Belum ada transaksi.</p>');
  };
}

/* ---------- STOK / KATALOG ---------- */
function initStok() {
  const katalog = store.get('katalog', dataKatalogBuku);
  const tbody = $('#tbody');
  const save = () => store.set('katalog', katalog);
  function baris(b) {
    const tr = document.createElement('tr');
    const tdImg = document.createElement('td');
    const img = new Image(); img.className = 'cover'; img.alt = 'Cover ' + b.judul;
    if (b.gambar) img.src = b.gambar;
    img.onerror = () => { img.removeAttribute('src'); };
    tdImg.appendChild(img); tr.appendChild(tdImg);
    [b.kode, b.judul, b.penulis, b.kategori, rupiah(b.harga)].forEach(v => { const td = document.createElement('td'); td.textContent = v; tr.appendChild(td); });
    const tdS = document.createElement('td'), bd = document.createElement('span');
    bd.className = 'badge' + (b.stok <= 5 ? ' low' : ''); bd.textContent = b.stok; tdS.appendChild(bd); tr.appendChild(tdS);
    const tdA = document.createElement('td'), del = document.createElement('button');
    del.className = 'btn small danger'; del.textContent = 'Hapus';
    del.onclick = () => { if (confirm(`Hapus "${b.judul}" dari katalog?`)) { katalog.splice(katalog.indexOf(b), 1); save(); tr.remove(); } };
    tdA.appendChild(del); tr.appendChild(tdA);
    return tr;
  }
  const render = () => {
    const q = $('#cari').value.toLowerCase();
    tbody.replaceChildren(...katalog.filter(b => (b.judul + b.penulis).toLowerCase().includes(q)).map(baris));
  };
  render();
  $('#cari').oninput = render;
  $('#formStok').onsubmit = e => {
    e.preventDefault();
    const b = { kode: $('#kode').value.trim().toUpperCase(), judul: $('#judul').value.trim(), penulis: $('#penulis').value.trim(), kategori: $('#kategori').value.trim(), harga: Number($('#harga').value), stok: Number($('#stok').value), gambar: '' };
    const err = [];
    if (!b.kode) err.push('Kode wajib diisi.');
    else if (katalog.some(x => x.kode === b.kode)) err.push('Kode sudah dipakai.');
    if (!b.judul) err.push('Judul wajib diisi.');
    if (!b.penulis) err.push('Penulis wajib diisi.');
    if (!b.kategori) err.push('Kategori wajib diisi.');
    if (!(b.harga > 0)) err.push('Harga harus lebih dari 0.');
    if (!Number.isInteger(b.stok) || b.stok < 0 || $('#stok').value === '') err.push('Stok harus berupa angka 0 atau lebih.');
    if (err.length) return notif(errList(err));
    katalog.push(b); save(); render(); e.target.reset();
    notif(`Buku <b>${esc(b.judul)}</b> berhasil ditambahkan.`, true);
  };
}

/* ---------- CHECKOUT ---------- */
function initCheckout() {
  const katalog = store.get('katalog', dataKatalogBuku);
  let cart = store.get('cart', []);
  const sel = $('#buku');
  katalog.forEach(b => sel.add(new Option(`${b.judul} - ${rupiah(b.harga)} (stok ${b.stok})`, b.kode)));
  const ongkir = () => Number($('#ekspedisi').selectedOptions[0].dataset.ongkir || 0);
  const subtotal = () => cart.reduce((a, i) => { const b = katalog.find(x => x.kode === i.kode); return a + (b ? b.harga * i.qty : 0); }, 0);
  function draw() {
    const tb = $('#cartBody'); tb.replaceChildren();
    cart.forEach((it, i) => {
      const b = katalog.find(x => x.kode === it.kode); if (!b) return;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${esc(b.judul)}</td><td>${rupiah(b.harga)}</td><td><input type="number" min="1" max="${b.stok}" value="${it.qty}" data-i="${i}" aria-label="Jumlah ${esc(b.judul)}"></td><td>${rupiah(b.harga * it.qty)}</td><td><button type="button" class="btn small danger" data-del="${i}">Hapus</button></td>`;
      tb.appendChild(tr);
    });
    if (!cart.length) tb.innerHTML = '<tr><td colspan="5" class="empty">Belum ada buku. Pilih buku di atas lalu klik Tambah.</td></tr>';
    $('#total').textContent = rupiah(subtotal() + (cart.length ? ongkir() : 0));
    store.set('cart', cart);
  }
  draw();
  $('#ekspedisi').onchange = draw;
  $('#btnTambah').onclick = () => {
    const kode = sel.value, qty = parseInt($('#qty').value, 10), b = katalog.find(x => x.kode === kode);
    if (!b) return notif('Pilih buku terlebih dahulu.');
    if (!(qty >= 1)) return notif('Jumlah minimal 1.');
    const ada = cart.find(x => x.kode === kode), total = qty + (ada ? ada.qty : 0);
    if (total > b.stok) return notif(`Stok "${esc(b.judul)}" hanya tersisa ${b.stok}.`);
    if (ada) ada.qty = total; else cart.push({ kode, qty });
    draw();
  };
  $('#cartBody').onchange = e => {
    if (!e.target.dataset.i) return;
    const it = cart[e.target.dataset.i], b = katalog.find(x => x.kode === it.kode), v = parseInt(e.target.value, 10);
    if (!(v >= 1) || v > b.stok) notif(`Jumlah harus antara 1 dan ${b.stok}.`); else it.qty = v;
    draw();
  };
  $('#cartBody').onclick = e => { if (e.target.dataset.del !== undefined) { cart.splice(e.target.dataset.del, 1); draw(); } };
  $('#formCheckout').onsubmit = e => {
    e.preventDefault();
    const f = { nama: $('#nama').value.trim(), email: $('#emailP').value.trim(), telp: $('#telp').value.trim(), alamat: $('#alamat').value.trim(), ekspedisi: $('#ekspedisi').value, paket: $('#paket').value, bayar: $('#bayar').value };
    const err = [];
    if (!cart.length) err.push('Pesanan masih kosong, tambahkan minimal satu buku.');
    if (f.nama.length < 3) err.push('Nama pemesan minimal 3 karakter.');
    if (!/^\S+@\S+\.\S+$/.test(f.email)) err.push('Format email tidak valid.');
    if (!/^08\d{8,11}$/.test(f.telp)) err.push('No. HP harus diawali 08 dan berisi 10-13 digit.');
    if (f.alamat.length < 10) err.push('Alamat minimal 10 karakter.');
    if (!f.ekspedisi) err.push('Pilih ekspedisi.');
    if (!f.bayar) err.push('Pilih metode pembayaran.');
    if (err.length) return notif(errList(err));
    const items = cart.map(i => { const b = katalog.find(x => x.kode === i.kode); return { kode: b.kode, judul: b.judul, harga: b.harga, qty: i.qty }; });
    const trx = { do: 'DO-' + new Date().getFullYear() + Math.floor(1000 + Math.random() * 9000), tanggal: new Date().toISOString().slice(0, 10), created: Date.now(), ...f, items, total: subtotal() + ongkir() };
    cart.forEach(i => { katalog.find(x => x.kode === i.kode).stok -= i.qty; });
    store.set('katalog', katalog);
    store.set('transaksi', [trx, ...store.get('transaksi', [])]);
    cart = []; store.set('cart', cart);
    e.target.reset(); draw();
    notif(`Pesanan berhasil dibuat.<br>Nomor Delivery Order: <b>${trx.do}</b><br>Total: <b>${rupiah(trx.total)}</b><br>Gunakan nomor ini di halaman Tracking.`, true);
  };
}

/* ---------- TRACKING ---------- */
function initTracking() {
  const langkah = ['Diproses', 'Dikemas', 'Dalam pengiriman', 'Tiba di kota tujuan', 'Diterima'];
  $('#formTrack').onsubmit = e => {
    e.preventDefault();
    const no = $('#noDo').value.trim().toUpperCase();
    if (!no) return notif('Nomor Delivery Order wajib diisi.');
    const baru = store.get('transaksi', []).map(t => ({ do: t.do, nama: t.nama, ekspedisi: t.ekspedisi, tanggal: t.tanggal, paket: t.paket, total: t.total, status: Math.min(4, Math.floor((Date.now() - t.created) / 60000)) }));
    const d = [...dataPengiriman, ...baru].find(x => x.do.toUpperCase() === no);
    if (!d) { $('#hasil').innerHTML = ''; return notif(`Nomor <b>${esc(no)}</b> tidak ditemukan. Periksa kembali nomornya.`); }
    $('#hasil').innerHTML = `<div class="panel"><h2>${esc(d.do)}</h2>
      <p>Status: <b>${langkah[d.status]}</b></p>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${(d.status + 1) * 20}"><span style="width:${(d.status + 1) * 20}%"></span></div>
      <ol class="steps">${langkah.map((s, i) => `<li class="${i < d.status ? 'done' : i === d.status ? 'now' : ''}">${s}</li>`).join('')}</ol>
      <dl><dt>Nama pemesan</dt><dd>${esc(d.nama)}</dd><dt>Ekspedisi</dt><dd>${esc(d.ekspedisi)}</dd><dt>Tanggal kirim</dt><dd>${esc(d.tanggal)}</dd><dt>Jenis paket</dt><dd>${esc(d.paket)}</dd><dt>Total pembayaran</dt><dd>${rupiah(d.total)}</dd></dl></div>`;
  };
}

/* ---------- Inisialisasi per halaman ---------- */
const page = document.body.dataset.page;
if (page !== 'login' && !store.get('user', null)) {
  location.replace('index.html');
} else {
  const lo = $('#logout');
  if (lo) lo.addEventListener('click', e => { e.preventDefault(); localStorage.removeItem('user'); location.href = 'index.html'; });
  ({ login: initLogin, dashboard: initDashboard, stok: initStok, checkout: initCheckout, tracking: initTracking })[page]?.();
}

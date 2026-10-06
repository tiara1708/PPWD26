/* ============================================================
   WARUNG ICE CREAM - JQUERY SCRIPT
   Praktikum Pemrograman Web Dasar
   ============================================================ */
$(document).ready(function() {

  /* =====================================================
     1. DATA PRODUK
     ===================================================== */
  const produkData = [
    { id: 1, nama: 'Es Krim Cokelat', harga: 15000, kategori: 'es-krim', icon: '🍫', desc: 'Cokelat premium lembut', badge: 'Best Seller', badgeType: 'hot' },
    { id: 2, nama: 'Es Krim Strawberry', harga: 15000, kategori: 'es-krim', icon: '🍓', desc: 'Stroberi segar asli', badge: 'Favorit', badgeType: '' },
    { id: 3, nama: 'Es Krim Vanilla', harga: 13000, kategori: 'es-krim', icon: '🍦', desc: 'Vanilla klasik creamy', badge: '', badgeType: '' },
    { id: 4, nama: 'Es Krim Mangga', harga: 16000, kategori: 'es-krim', icon: '🥭', desc: 'Mangga manis tropis', badge: 'Baru', badgeType: '' },
    { id: 5, nama: 'Sundae Cokelat', harga: 25000, kategori: 'sundae', icon: '🍨', desc: 'Sundae dengan topping cokelat', badge: 'Best Seller', badgeType: 'hot' },
    { id: 6, nama: 'Sundae Keju', harga: 27000, kategori: 'sundae', icon: '🧀', desc: 'Sundae topping keju melimpah', badge: '', badgeType: '' },
    { id: 7, nama: 'Sundae Buah', harga: 28000, kategori: 'sundae', icon: '🍧', desc: 'Sundae dengan buah segar', badge: 'Favorit', badgeType: '' },
    { id: 8, nama: 'Milkshake Cokelat', harga: 20000, kategori: 'minuman', icon: '🥤', desc: 'Milkshake cokelat dingin', badge: '', badgeType: '' },
    { id: 9, nama: 'Milkshake Strawberry', harga: 20000, kategori: 'minuman', icon: '🥛', desc: 'Milkshake stroberi segar', badge: 'Baru', badgeType: '' },
    { id: 10, nama: 'Hot Tea', harga: 8000, kategori: 'minuman', icon: '🍵', desc: 'Hot tea hangat', badge: '', badgeType: '' },
    { id: 11, nama: 'Es Jeruk', harga: 10000, kategori: 'minuman', icon: '🍊', desc: 'Es jeruk peras asli', badge: '', badgeType: '' },
    { id: 12, nama: 'Float Ice Cream', harga: 22000, kategori: 'minuman', icon: '🍹', desc: 'Minuman soda dengan es krim', badge: 'Best Seller', badgeType: 'hot' }
  ];

  /* =====================================================
     2. STATE (Variabel Global)
     ===================================================== */
  let cart = []; // Array keranjang belanja
  let currentFilter = 'all'; // Filter kategori aktif
  let searchKeyword = ''; // Kata kunci pencarian

  /* =====================================================
     3. FUNGSI SIMPAN RIWAYAT (Latihan 2)
     ===================================================== */
  function simpanRiwayat(total, qty, pemesan) {
    const riwayat = JSON.parse(localStorage.getItem('riwayat')) || [];
    riwayat.push({ 
      tanggal: new Date().toISOString(), 
      total, 
      qty,
      pemesan 
    });
    localStorage.setItem('riwayat', JSON.stringify(riwayat));
  }

  /* =====================================================
     4. FUNGSI RENDER PRODUK
     ===================================================== */
  function renderProduk() {
    const $grid =$('#produkGrid');
    $grid.empty();

    // Filter data berdasarkan kategori & pencarian
    const filtered = produkData.filter(function(p) {
      const matchKategori = currentFilter === 'all' || p.kategori === currentFilter;
      const matchSearch = p.nama.toLowerCase().includes(searchKeyword.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchKategori && matchSearch;
    });

    // Jika tidak ada hasil
    if (filtered.length === 0) {
      $grid.html(`
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #bbb;">
          <i class="fas fa-search" style="font-size: 3.5rem; color: #ffe4ec; margin-bottom: 20px; display: block;"></i>
          <h3 style="color: #999; font-weight: 600; margin-bottom: 8px;">Produk tidak ditemukan</h3>
          <p style="font-size: 0.9rem;">Coba kata kunci atau kategori lain</p>
        </div>
      `);
      return;
    }

    // Render setiap produk
    filtered.forEach(function(p) {
      const badgeHtml = p.badge 
        ? `<div class="produk-badge ${p.badgeType}">${p.badge}</div>` 
        : '';

      const card = `
        <div class="produk-card" data-id="${p.id}" data-kategori="${p.kategori}">
          ${badgeHtml}
          <div class="produk-img">${p.icon}</div>
          <div class="produk-info">
            <h3>${p.nama}</h3>
            <p class="desc">${p.desc}</p>
            <div class="produk-footer">
              <div class="produk-price">
                Rp ${p.harga.toLocaleString('id-ID')}
                <small>per porsi</small>
              </div>
              <button class="btn-add-cart" data-id="${p.id}" title="Tambah ke keranjang">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      $grid.append(card);
    });
  }

  /* =====================================================
     5. FUNGSI UPDATE UI KERANJANG (Latihan 1 - Diskon)
     ===================================================== */
  function updateCartUI() {
    const $cartItems =$('#cartItems');
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    let totalHarga = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);

    // Update badge keranjang
    $('#cartBadge').text(totalQty);

    // Jika keranjang kosong
    if (cart.length === 0) {
      $cartItems.html(`
        <div class="cart-empty">
          <i class="fas fa-shopping-cart"></i>
          <p>Keranjang masih kosong</p>
          <small>Yuk pilih es krim dulu!</small>
        </div>
      `);
      $('#cartTotal').html('Rp 0');
      return;
    }

    // Render item keranjang
    let html = '';
    cart.forEach(function(item) {
      html += `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-icon">${item.icon}</div>
          <div class="cart-item-info">
            <h5>${item.nama}</h5>
            <div class="price">Rp ${(item.harga * item.qty).toLocaleString('id-ID')}</div>
            <div class="qty-control">
              <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
    });
    $cartItems.html(html);

    // Logika Diskon 10% jika Total > Rp 100.000 (Latihan 1)
    if (totalHarga > 100000) {
      const diskon = totalHarga * 0.1;
      const hargaSetelahDiskon = totalHarga - diskon;
      $('#cartTotal').html(`
        <small style="text-decoration:line-through; color:#999; font-size:0.8rem; display:block;">
          Rp ${totalHarga.toLocaleString('id-ID')}
        </small>
        Rp ${hargaSetelahDiskon.toLocaleString('id-ID')}
      `);
    } else {
      $('#cartTotal').html('Rp ' + totalHarga.toLocaleString('id-ID'));
    }
  }

  /* =====================================================
     6. FUNGSI TOAST NOTIFICATION
     ===================================================== */
  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    $('#toastMsg').text(message);
    $('#toast').addClass('show');
    toastTimer = setTimeout(function() {
      $('#toast').removeClass('show');
    }, 2500);
  }

  /* =====================================================
     7. EVENT: FILTER KATEGORI (Navbar & Tombol)
     ===================================================== */
  $('.nav-link').click(function() {
    $('.nav-link').removeClass('active');$(this).addClass('active');
    currentFilter = $(this).data('filter');
    
    // Sync dengan tombol filter
    $('.filter-btn').removeClass('active');$(`.filter-btn[data-cat="${currentFilter}"]`).addClass('active');
    renderProduk();
  });

  $('.filter-btn').click(function() {
    $('.filter-btn').removeClass('active');$(this).addClass('active');
    currentFilter = $(this).data('cat');

    // Sync dengan menu navbar
    $('.nav-link').removeClass('active');$(`.nav-link[data-filter="${currentFilter}"]`).addClass('active');
    renderProduk();
  });

  /* =====================================================
     8. EVENT: PENCARIAN REAL-TIME
     ===================================================== */
  $('#searchProduk').on('input', function() {
    searchKeyword = $(this).val();
    renderProduk();
  });

  /* =====================================================
     9. EVENT: TAMBAH KE KERANJANG
     ===================================================== */
  $(document).on('click', '.btn-add-cart', function(e) {
    e.stopPropagation();
    const id = $(this).data('id');
    const produk = produkData.find(p => p.id === id);
    if (!produk) return;

    // Cek apakah produk sudah ada di keranjang
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        icon: produk.icon,
        qty: 1
      });
    }

    updateCartUI();
    showToast(`${produk.icon} ${produk.nama} ditambahkan!`);

    // Animasi tombol
    $(this).css('transform', 'rotate(90deg) scale(1.3)');
    setTimeout(() => $(this).css('transform', ''), 300);

    // Animasi badge
    $('#cartBadge').css('transform', 'scale(1.4)');
    setTimeout(() => $('#cartBadge').css('transform', 'scale(1)'), 200);
  });

  /* =====================================================
     10. EVENT: KONTROL QTY & HAPUS ITEM
     ===================================================== */
  $(document).on('click', '.qty-btn', function() {
    const action = $(this).data('action');
    const id = $(this).data('id');
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (action === 'plus') {
      item.qty += 1;
    } else if (action === 'minus') {
      item.qty -= 1;
      if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
      }
    }
    updateCartUI();
  });

  $(document).on('click', '.cart-item-remove', function() {
    const id = $(this).data('id');
    const item = cart.find(i => i.id === id);
    if (item) {
      showToast(`${item.icon} ${item.nama} dihapus dari keranjang`);
      cart = cart.filter(i => i.id !== id);
      updateCartUI();
    }
  });

  /* =====================================================
     11. EVENT: BUKA/TUTUP SIDEBAR KERANJANG
     ===================================================== */
  $('#cartBtn').click(function() {
    $('#cartSidebar').addClass('open');
    $('#cartOverlay').fadeIn(300);
  });

  $('#cartClose, #cartOverlay').click(function() {
    $('#cartSidebar').removeClass('open');
    $('#cartOverlay').fadeOut(300);
  });

  /* =====================================================
     12. EVENT: CHECKOUT & MODAL FORM (LATIHAN 3)
     ===================================================== */
  // A. Klik tombol Checkout -> Buka Modal
  $('#btnCheckout').click(function() {
    if (cart.length === 0) {
      showToast('⚠️ Keranjang masih kosong!');
      return;
    }
    $('#checkoutModal, #checkoutModalOverlay').fadeIn(300).addClass('open');
  });

  // B. Tutup Modal Pemesan
  $('#modalClose, #checkoutModalOverlay').click(function() {
    $('#checkoutModal, #checkoutModalOverlay').fadeOut(300).removeClass('open');
  });

  // C. Submit Form Pemesan dengan Validasi
  $('#formCheckout').on('submit', function(e) {
    e.preventDefault();

    const nama = $('#namaPemesan').val().trim();
    const noHp = $('#noHpPemesan').val().trim();
    const alamat = $('#alamatPemesan').val().trim();

    if (!nama || !noHp || !alamat) {
      showToast('⚠️️ Mohon isi semua data pemesan!');
      return;
    }

    // Hitung Total Akhir setelah diskon jika > 100rb
    let totalHarga = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    if (totalHarga > 100000) {
      totalHarga -= (totalHarga * 0.1);
    }
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

    const $btn =$('#btnKonfirmasiCheckout');
    $btn.html('<i class="fas fa-spinner fa-spin"></i> Memproses...').prop('disabled', true);

    setTimeout(function() {
      // Simpan riwayat transaksi ke localStorage (Latihan 2)
      simpanRiwayat(totalHarga, totalQty, { nama, noHp, alamat });

      // Reset Form & Keranjang
      $('#formCheckout')[0].reset();
      $btn.html('<i class="fas fa-paper-plane"></i> Konfirmasi & Bayar').prop('disabled', false);
      cart = [];
      updateCartUI();

      // Tutup Modal & Cart Sidebar
      $('#checkoutModal, #checkoutModalOverlay').fadeOut(300).removeClass('open');
      $('#cartSidebar').removeClass('open');
      $('#cartOverlay').fadeOut(300);

      showToast(`🎉 Pembelian berhasil, ${nama}! Pesanan sedang diproses.`);
    }, 1500);
  });

  /* =====================================================
     13. EVENT: HAMBURGER MENU (Mobile)
     ===================================================== */
  $('#hamburger').click(function() {
    $('#navMenu').toggleClass('show');
    const icon = $(this).find('i');
    if ($('#navMenu').hasClass('show')) {
      icon.removeClass('fa-bars').addClass('fa-times');
    } else {
      icon.removeClass('fa-times').addClass('fa-bars');
    }
  });

  $('.nav-link').click(function() {
    if (window.innerWidth <= 768) {
      $('#navMenu').removeClass('show');
      $('#hamburger').find('i').removeClass('fa-times').addClass('fa-bars');
    }
  });

  /* =====================================================
     14. INISIALISASI APLIKASI
     ===================================================== */
  renderProduk();
  updateCartUI();
  console.log('%c🍦 Warung Ice Cream Siap!', 'color:#ff6b9d;font-size:16px;font-weight:bold;');
});
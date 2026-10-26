// Nonaktifkan animasi otomatis jika sistem pengguna meminta reduced motion
jQuery.fx.off = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

$(function () {
    // 1. DROPDOWN NAVBAR (Event: mouseenter/mouseleave, Effect: slideDown/slideUp)
    $('.dropdown')
        .on('mouseenter', function () {
            $(this).find('.dropdown-menu').stop(true, true).slideDown(200);
        })
        .on('mouseleave', function () {
            $(this).find('.dropdown-menu').stop(true, true).slideUp(200);
        });

    // INTERAKSI DROPDOWN MENU KETIKA DIKLIK -> GANTI TAB KOLEKSI PRODUK
    $('.dropdown-menu a').on('click', function () {
        const targetTab = $(this).data('tab-target');
        if (targetTab) {
            $('.tab[data-target="' + targetTab + '"]').trigger('click');
        }
    });

    // 2. TAB GALERI PRODUK INTERAKTIF (Event: click, Effect: fadeIn)
    $('.tab-panel').hide().first().show();
    $('.tab').on('click', function () {
        const target = $(this).data('target');
        $('.tab').removeClass('active');
        $(this).addClass('active');
        $('.tab-panel').hide();
        $(target).fadeIn(300);
    });

    // 3. EFEK MELAYANG KARTU PRODUK (Effect: animate)
    $('.product-card')
        .css('position', 'relative')
        .on('mouseenter', function () {
            $(this).stop().animate({ top: '-8px' }, 150);
        })
        .on('mouseleave', function () {
            $(this).stop().animate({ top: '0px' }, 150);
        });

    // 4. FORM PESANAN CEPT (Event: focus/blur + Toast Notification)
    $('#formPesan .field')
        .on('focus', function () {
            $(this).addClass('is-focus').removeClass('is-error');
            $(this).siblings('.hint').stop(true, true).slideDown(150);
        })
        .on('blur', function () {
            $(this).removeClass('is-focus');
            $(this).siblings('.hint').stop(true, true).slideUp(150);
            if ($(this).hasClass('wajib')) {
                $(this).toggleClass('is-error', $(this).val().trim() === '');
            }
        });

    function tampilkanToast(pesan, tipe) {
        $('#toast')
            .stop(true, true)
            .removeClass('success error')
            .addClass(tipe)
            .text(pesan)
            .fadeIn(250)
            .delay(2500)
            .fadeOut(400);
    }

    $('#formPesan').on('submit', function (e) {
        e.preventDefault();
        const nama = $('#nama').val().trim();
        const produk = $('#pilihMenu').val();

        if (nama === '' || produk === '') {
            $('.wajib').each(function () {
                $(this).toggleClass('is-error', $(this).val().trim() === '');
            });
            tampilkanToast('Lengkapi nama dan pilihan tas kamu dulu ya!', 'error');
            return;
        }

        tampilkanToast('Pesanan ' + produk + ' atas nama ' + nama + ' berhasil dikirim!', 'success');
        this.reset();
    });

    // 5. TOMBOL BACK TO TOP (Event: scroll, Effect: fadeIn/fadeOut & animate)
    const $btnTop = $('#backToTop');
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {
            $btnTop.fadeIn(200);
        } else {
            $btnTop.fadeOut(200);
        }
    });

    $btnTop.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 500);
    });

    // 6. CUSTOM METHOD & VALIDASI FORM MEMBER (jQuery Validation Plugin)
    $.validator.addMethod('nomorHp', function (value, element) {
        return this.optional(element) || /^[0-9]{10,12}$/.test(value);
    }, 'Nomor WhatsApp harus 10 sampai 12 digit angka');

    $.validator.addMethod('hurufAngka', function (value, element) {
        return this.optional(element) || (/[A-Za-z]/.test(value) && /[0-9]/.test(value));
    }, 'Password harus kombinasi huruf dan angka');

    const validator = $('#formMember').validate({
        rules: {
            nama: { required: true, minlength: 3 },
            email: { required: true, email: true },
            hp: { required: true, nomorHp: true },
            usia: { required: true, digits: true, min: 17 },
            kategori: { required: true },
            password: { required: true, minlength: 8, hurufAngka: true },
            konfirmasi: { required: true, equalTo: '#mPassword' }
        },
        messages: {
            nama: { required: 'Nama lengkap wajib diisi', minlength: 'Nama minimal 3 karakter' },
            email: { required: 'Email wajib diisi', email: 'Format email belum valid' },
            hp: { required: 'Nomor WhatsApp wajib diisi' },
            usia: { required: 'Usia wajib diisi', digits: 'Usia harus berupa angka', min: 'Usia minimal 17 tahun' },
            kategori: { required: 'Pilih salah satu kategori favoritmu' },
            password: { required: 'Password wajib diisi', minlength: 'Password minimal 8 karakter' },
            konfirmasi: { required: 'Konfirmasi password wajib diisi', equalTo: 'Password konfirmasi tidak cocok' }
        },
        errorElement: 'div',
        errorClass: 'pesan-error',
        highlight: function (el) {
            $(el).addClass('is-error').removeClass('is-valid');
        },
        unhighlight: function (el) {
            $(el).removeClass('is-error').addClass('is-valid');
        },
        submitHandler: function (form) {
            const nama = $('#mNama').val().trim();
            tampilkanToast('Selamat datang, ' + nama + '! Akun VIP kamu berhasil dibuat.', 'success');
            $('#sukses').stop(true, true).slideDown(300).delay(3500).slideUp(300);
            form.reset();
            validator.resetForm();
            $('#formMember input, #formMember select').removeClass('is-error is-valid');
        }
    });

    // SMOOTH SCROLL NAVBAR
    $('a[href^="#"]').on('click', function (e) {
        const href = $(this).attr('href');
        if (href.length < 2) return;
        const $tujuan = $(href);
        if ($tujuan.length === 0) return;
        e.preventDefault();
        $('html, body').animate({ scrollTop: $tujuan.offset().top - 60 }, 500);
    });
});
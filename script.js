(function () {
  'use strict';

  // ===== GOOGLE SCRIPT URL =====
  var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwyzw1-ejmO4LHGyRVIIXXWOBf7gxl7-URidpLKa5kOYKMBI0NlsvK2uWVnUoXjEA_LVg/exec';

  /* ── PRODUCT SLIDER SWIPE ── */
  (function initProductSlider() {
    const mainImage = document.getElementById("main-image");
    const thumbs = document.querySelectorAll(".thumb");
    const psView = document.getElementById("ps-view");
    const images = ["/images/1.webp", "/images/2.png", "/images/3.png", "/images/4.png", "/images/5.png", "/images/6.png"];
    let currentIndex = 0;

    function updateMainImage(index) {
      if (index < 0) index = 0;
      if (index >= images.length) index = images.length - 1;
      currentIndex = index;
      mainImage.src = images[currentIndex];
      thumbs.forEach((item, i) => {
        if (i === currentIndex) {
          item.style.border = "2.5px solid var(--pink)";
          item.style.opacity = "1";
          item.classList.add("active");
        } else {
          item.style.border = "2.5px solid transparent";
          item.style.opacity = ".5";
          item.classList.remove("active");
        }
      });
    }

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        updateMainImage(parseInt(thumb.dataset.index));
      });
    });

    let startX = 0, isDragging = false;
    psView.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; isDragging = true; }, { passive: true });
    psView.addEventListener("touchend", (e) => {
      if (!isDragging) return; isDragging = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) updateMainImage(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    }, { passive: true });
    psView.addEventListener("mousedown", (e) => { startX = e.clientX; isDragging = true; });
    psView.addEventListener("mouseup", (e) => {
      if (!isDragging) return; isDragging = false;
      const diff = startX - e.clientX;
      if (Math.abs(diff) > 50) updateMainImage(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    });
    psView.addEventListener("mouseleave", () => { isDragging = false; });
  })();

  /* ── COUNTDOWN ── */
  function initCountdown() {
    var el = document.getElementById('countdown');
    if (!el) return;
    var t = 8 * 3600;
    setInterval(function () {
      t = t > 0 ? t - 1 : 8 * 3600;
      var h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60;
      el.textContent = (h<10?'0':'')+h+':'+(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
    }, 1000);
  }

  /* ── PACKAGE SELECTOR ── */
  var selectedPkg = 1;
  window.selectPkg = function (n) {
    selectedPkg = n;
    document.querySelectorAll('.pkg-row').forEach(function (el) { el.classList.remove('selected'); });
    var sel = document.querySelector('.pkg-row[data-pkg="' + n + '"]');
    if (sel) sel.classList.add('selected');
  };

  /* ── FAQ TOGGLE ── */
  window.toggleFaq = function (btn) {
    var body = btn.nextElementSibling;
    var chevron = btn.querySelector('.faq-chevron');
    var open = body.style.display === 'block';
    body.style.display = open ? 'none' : 'block';
    if (chevron) chevron.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
  };

  /* ── VIDEO MODAL ── */
  window.openVideo = function (src) {
    var modal = document.getElementById('video-modal');
    var vid = document.getElementById('modal-video');
    vid.src = src;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    vid.play().catch(function(){});
  };
  window.closeVideo = function () {
    var modal = document.getElementById('video-modal');
    var vid = document.getElementById('modal-video');
    vid.pause(); vid.src = '';
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };
  var vModal = document.getElementById('video-modal');
  if (vModal) vModal.addEventListener('click', function(e) { if (e.target === this) window.closeVideo(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { window.closeVideo(); closeSuccessModal(); } });

  /* ── VIDEO SLIDER DRAG ── */
  function initVideoSlider() {
    var s = document.getElementById('video-slider');
    if (!s) return;
    var down = false, sx, sl;
    s.addEventListener('mousedown',  function(e) { down=true; s.style.cursor='grabbing'; sx=e.pageX-s.offsetLeft; sl=s.scrollLeft; });
    s.addEventListener('mouseleave', function()  { down=false; s.style.cursor='grab'; });
    s.addEventListener('mouseup',    function()  { down=false; s.style.cursor='grab'; });
    s.addEventListener('mousemove',  function(e) { if(!down) return; e.preventDefault(); s.scrollLeft=sl-(e.pageX-s.offsetLeft-sx)*2; });
  }

  /* ── SCROLL TO CHECKOUT ── */
  window.scrollToCheckout = function () {
    var el = document.getElementById('checkout-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ── SUCCESS MODAL ── */
  function showSuccessModal(name) {
    var modal = document.getElementById('success-modal');
    var msg = document.getElementById('success-msg');
    if (msg) msg.innerHTML = 'شكراً <strong>' + (name || '') + '</strong>! تم تسجيل طلبك بنجاح.<br/>سيتواصل معك فريقنا قريباً لتأكيد التوصيل. 🎉';
    if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    setTimeout(function() { closeSuccessModal(); }, 9000);
  }
  window.closeSuccessModal = function () {
    var modal = document.getElementById('success-modal');
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
  };
  var sModal = document.getElementById('success-modal');
  if (sModal) sModal.addEventListener('click', function(e) { if (e.target === this) window.closeSuccessModal(); });

  /* ── TOAST ── */
  function showToast(message, bg) {
    bg = bg || '#22c55e';
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:'+bg+';color:#fff;padding:13px 26px;border-radius:12px;font-size:14px;font-weight:500;z-index:10001;box-shadow:0 8px 24px rgba(0,0,0,.2);animation:kFadeIn 0.3s ease;font-family:Cairo,sans-serif;';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 4000);
  }

  /* ── FIELD VALIDATION ── */
  function showFieldError(input, msg) {
    clearFieldError(input);
    input.style.borderColor = '#ef4444';
    var err = document.createElement('span');
    err.className = 'field-err';
    err.style.cssText = 'color:#ef4444;font-size:12px;margin-top:4px;display:block;font-family:Cairo,sans-serif;';
    err.textContent = msg;
    input.after(err);
  }
  function clearFieldError(input) {
    input.style.borderColor = 'rgba(233,30,140,.4)';
    var prev = input.parentElement && input.parentElement.querySelector('.field-err');
    if (prev) prev.remove();
  }

  /* ── PACKAGE DATA ── */
  function getSelectedPackage() {
    var map = {
      1: { name: 'مكمل زيادة الوزن × 1 (الطلب العادي)', price: '299 درهم' },
      2: { name: 'مكمل زيادة الوزن × 2 — وفري 150 درهم', price: '459 درهم' },
      3: { name: 'مكمل زيادة الوزن × 3 — وفري 850 درهم', price: '589 درهم' },
    };
    return map[selectedPkg] || map[1];
  }

  /* ── ORDER FORM ── */
  function initOrderForm() {
    var buyBtn = document.getElementById('buy-btn');
    if (!buyBtn) return;

    var fName    = document.getElementById('field-name');
    var fAddress = document.getElementById('field-address');
    var fCity    = document.getElementById('field-city');
    var fPhone   = document.getElementById('field-phone');

    [fName, fAddress, fCity, fPhone].forEach(function(inp) {
      if (inp) inp.addEventListener('input', function() { clearFieldError(inp); });
    });

    function validate() {
      var valid = true;
      if (!fName || !fName.value.trim())       { showFieldError(fName,    'يرجى إدخال اسمك الكامل'); valid = false; }
      if (!fAddress || !fAddress.value.trim()) { showFieldError(fAddress, 'يرجى إدخال عنوانك');      valid = false; }
      if (!fCity || !fCity.value.trim())       { showFieldError(fCity,    'يرجى إدخال مدينتك');      valid = false; }
      var tel = fPhone && fPhone.value.trim();
      if (!tel)                                  { showFieldError(fPhone, 'يرجى إدخال رقم هاتفك'); valid = false; }
      else if (!/^[0-9+\s\-]{8,15}$/.test(tel)) { showFieldError(fPhone, 'رقم الهاتف غير صحيح');  valid = false; }
      return valid;
    }

    buyBtn.addEventListener('click', function() {
      if (!validate()) {
        var firstErr = document.querySelector('.field-err');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      var pkg = getSelectedPackage();
      var orderData = {
        timestamp: new Date().toISOString(),
        prenom:    fName.value.trim(),
        address:   fAddress.value.trim(),
        ville:     fCity.value.trim(),
        telephone: fPhone.value.trim(),
        offer:     pkg.name,
        price:     pkg.price,
        status:    'Nouvelle commande'
      };

      var originalHTML = buyBtn.innerHTML;
      buyBtn.disabled = true;
      buyBtn.textContent = 'جارٍ المعالجة…';

      // Send as GET with URL params (works with no-cors)
      var params = new URLSearchParams(orderData);
      var url = GOOGLE_SCRIPT_URL + '?' + params.toString();

      fetch(url, { method: 'GET', mode: 'no-cors' })
        .then(function() {
          showSuccessModal(orderData.prenom);
          fName.value = ''; fAddress.value = ''; fCity.value = ''; fPhone.value = '';
        })
        .catch(function() {
          showToast('خطأ في الاتصال. يرجى المحاولة مجدداً.', '#ef4444');
        })
        .finally(function() {
          buyBtn.disabled = false;
          buyBtn.innerHTML = originalHTML;
        });
    });
  }

  /* ── BEFORE / AFTER SLIDERS ── */
  function initBeforeAfterSlider() {
    var sliders = [
      {
        wrap:    document.getElementById('baSlider1'),
        after:   document.querySelector('#baSlider1 .ba-after'),
        divider: document.getElementById('baDivider1'),
        handle:  document.getElementById('baHandle1'),
      },
      {
        wrap:    document.getElementById('baSlider2'),
        after:   document.querySelector('#baSlider2 .ba-after'),
        divider: document.getElementById('baDivider2'),
        handle:  document.getElementById('baHandle2'),
      }
    ];

    sliders.forEach(function(sl) {
      if (!sl.wrap || !sl.after || !sl.divider || !sl.handle) return;

      var active = false;

      function setPos(pct) {
        pct = Math.min(Math.max(pct, 2), 98);
        sl.after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
        sl.divider.style.left   = pct + '%';
        sl.handle.style.left    = pct + '%';
      }

      function fromEvent(e) {
        var r = sl.wrap.getBoundingClientRect();
        var clientX = e.touches ? e.touches[0].clientX : e.clientX;
        return ((clientX - r.left) / r.width) * 100;
      }

      sl.wrap.addEventListener('mousedown', function(e) {
        e.preventDefault();
        active = true;
        setPos(fromEvent(e));
      });
      window.addEventListener('mousemove', function(e) {
        if (active) setPos(fromEvent(e));
      });
      window.addEventListener('mouseup', function() { active = false; });
      sl.wrap.addEventListener('touchstart', function(e) {
        active = true;
        setPos(fromEvent(e));
      }, { passive: true });
      window.addEventListener('touchmove', function(e) {
        if (active) setPos(fromEvent(e));
      }, { passive: true });
      window.addEventListener('touchend', function() { active = false; });

      setPos(50);
    });
  }

  /* ── BOOT ── */
  function init() {
    initCountdown();
    initVideoSlider();
    initOrderForm();
    initBeforeAfterSlider();
    selectPkg(1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
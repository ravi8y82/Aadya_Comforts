(() => {
  const hotelNumber = '919945884259';
  const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Aadya%20Comforts%2C%20W99G%2BM4M%2C%20Arsikere%20%E2%80%93%20Mysuru%20Rd%2C%20Channarayapatna%2C%20Karnataka%20573116';
  const directMessage = `Hello Aadya Comforts 👋\n\nI would like to enquire about a room.\n\nPlease share the available rooms and price.\n\nThank you.`;
  const floatingMessage = `Hello Aadya Comforts 👋\n\nI would like to enquire about a stay.\n\nPlease share availability and price.`;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.primary-nav');
  const modal = document.querySelector('#availability-modal');
  const form = document.querySelector('#availability-form');
  const error = document.querySelector('#form-error');
  const checkIn = document.querySelector('#check-in');
  const checkOut = document.querySelector('#check-out');
  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxCaption = document.querySelector('#lightbox-caption');
  const gallery = [
    { src: 'images/hero-page.jpeg', alt: 'Exterior view of Aadya Comforts', caption: 'Exterior view' },
    { src: 'images/interier-page.jpeg', alt: 'Interior seating area at Aadya Comforts', caption: 'Interior seating area' }
  ];
  let galleryIndex = 0;
  let lastFocused;

  document.querySelectorAll('a[href*="google.com/maps"]').forEach(link => { link.href = directionsUrl; });
  document.querySelectorAll('a[href="#location"]').forEach(link => { if (link.textContent.toLowerCase().includes('directions')) link.href = directionsUrl; });

  const openWhatsApp = message => { window.location.href = `https://wa.me/${hotelNumber}?text=${encodeURIComponent(message)}`; };
  document.querySelectorAll('.js-whatsapp').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    openWhatsApp(link.dataset.message === 'floating' ? floatingMessage : directMessage);
  }));

  const setMenu = open => { navigation.classList.toggle('open', open); menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); };
  menuToggle.addEventListener('click', () => setMenu(!navigation.classList.contains('open')));
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30), { passive: true });

  const setModal = open => { modal.classList.toggle('open', open); modal.setAttribute('aria-hidden', String(!open)); document.body.classList.toggle('modal-open', open); if (open) { lastFocused = document.activeElement; checkIn.focus(); } else if (lastFocused) lastFocused.focus(); };
  document.querySelectorAll('[data-open-availability]').forEach(button => button.addEventListener('click', () => setModal(true)));
  document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', () => setModal(false)));
  checkIn.addEventListener('change', () => { checkOut.min = checkIn.value; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const guests = document.querySelector('#guests').value;
    if (!checkIn.value || !checkOut.value || !guests || Number(guests) < 1) { error.textContent = 'Please complete the required fields.'; return; }
    if (checkOut.value <= checkIn.value) { error.textContent = 'Check-out must be after check-in.'; return; }
    const preference = document.querySelector('#preference').value.trim() || 'No preference';
    const message = `Hello Aadya Comforts 👋\n\nI would like to enquire about a stay.\n\nCheck-in: ${checkIn.value}\nCheck-out: ${checkOut.value}\nGuests: ${guests}\nRoom preference: ${preference}\n\nPlease let me know the available options and price.\n\nThank you.`;
    setModal(false); openWhatsApp(message);
  });

  const renderLightbox = () => { const item = gallery[galleryIndex]; lightboxImage.src = item.src; lightboxImage.alt = item.alt; lightboxCaption.textContent = item.caption; };
  const setLightbox = open => { lightbox.classList.toggle('open', open); lightbox.setAttribute('aria-hidden', String(!open)); if (open) { lastFocused = document.activeElement; renderLightbox(); document.querySelector('[data-close-lightbox]').focus(); } else if (lastFocused) lastFocused.focus(); };
  document.querySelectorAll('[data-gallery-index]').forEach(button => button.addEventListener('click', () => { galleryIndex = Number(button.dataset.galleryIndex); setLightbox(true); }));
  document.querySelector('[data-close-lightbox]').addEventListener('click', () => setLightbox(false));
  document.querySelector('[data-gallery-prev]').addEventListener('click', () => { galleryIndex = (galleryIndex + gallery.length - 1) % gallery.length; renderLightbox(); });
  document.querySelector('[data-gallery-next]').addEventListener('click', () => { galleryIndex = (galleryIndex + 1) % gallery.length; renderLightbox(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { setModal(false); setLightbox(false); setMenu(false); } if (lightbox.classList.contains('open') && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) { galleryIndex = (galleryIndex + (event.key === 'ArrowRight' ? 1 : gallery.length - 1)) % gallery.length; renderLightbox(); } });

  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
})();

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Hamburger menu ──
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Scroll reveal ──
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));

  // ── Copy to clipboard (share cards) ──
  window.copyText = (el) => {
    const text = el.getAttribute('data-copy');
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      const original = el.querySelector('p').textContent;
      el.querySelector('p').textContent = 'Copiado!';
      setTimeout(() => { el.querySelector('p').textContent = original; }, 2000);
    });
  };

  window.copyLink = () => {
    navigator.clipboard.writeText('https://form.typeform.com/to/qH5MLd8m').then(() => {
      const card = document.querySelector('[onclick="copyLink()"] p');
      const original = card.textContent;
      card.textContent = 'Link copiado!';
      setTimeout(() => { card.textContent = original; }, 2000);
    });
  };

  // ── Volunteer form ──
  // Sem backend: compõe um e-mail para contato@ (já roteado para o Gmail via Cloudflare).
  // Para trocar por um serviço (Formspree / Web3Forms), aponte o action do form para o
  // endpoint e remova este handler.
  const volunteerForm = document.querySelector('#volunteer-form');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(volunteerForm);
      const nome = (data.get('nome') || '').trim();
      const email = (data.get('email') || '').trim();
      const linkedin = (data.get('linkedin') || '').trim();
      const ajuda = (data.get('ajuda') || '').trim();
      const motivo = (data.get('motivo') || '').trim();

      const subject = `Novo voluntário: ${nome}`;
      const body = [
        `Nome: ${nome}`,
        `Email: ${email}`,
        `LinkedIn: ${linkedin || '—'}`,
        '',
        'O que posso fazer para ajudar?',
        ajuda,
        '',
        'Por que quer ser um voluntário?',
        motivo,
      ].join('\n');

      window.location.href =
        `mailto:contato@pesquisadesigndeservico.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const btn = volunteerForm.querySelector('button[type="submit"]');
      if (btn) {
        const original = btn.innerHTML;
        btn.textContent = 'Abrindo seu e-mail…';
        setTimeout(() => { btn.innerHTML = original; }, 4000);
      }
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

});

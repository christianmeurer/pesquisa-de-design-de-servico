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
    const open = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
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
  // Flash a status message on a node and restore it, guarding against a
  // double-click capturing the temporary text as the "original".
  const flash = (node, msg) => {
    if (!node) return;
    if (node._restore) clearTimeout(node._restore);
    if (node._orig === undefined) node._orig = node.textContent;
    node.textContent = msg;
    node._restore = setTimeout(() => {
      node.textContent = node._orig;
      node._orig = undefined;
      node._restore = null;
    }, 2000);
  };
  const writeClipboard = (text) =>
    (navigator.clipboard && navigator.clipboard.writeText)
      ? navigator.clipboard.writeText(text)
      : Promise.reject();

  window.copyText = (el) => {
    const text = el.getAttribute('data-copy');
    if (!text) return;
    const p = el.querySelector('p');
    writeClipboard(text)
      .then(() => flash(p, 'Copiado!'))
      .catch(() => flash(p, 'Não foi possível copiar — copie manualmente'));
  };

  window.copyLink = () => {
    const p = document.querySelector('[onclick="copyLink()"] p');
    writeClipboard('https://form.typeform.com/to/qH5MLd8m')
      .then(() => flash(p, 'Link copiado!'))
      .catch(() => flash(p, 'Não foi possível copiar'));
  };

  // Keyboard support for the role="button" share cards (Enter / Space)
  document.querySelectorAll('.share-card[role="button"]').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (card.getAttribute('onclick') === 'copyLink()') window.copyLink();
        else window.copyText(card);
      }
    });
  });

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
  // Offset derives from the live navbar height so headings land just below the
  // fixed bar at every breakpoint; honors reduced-motion.
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = (navbar ? navbar.offsetHeight : 76) + 12;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: prefersReduced.matches ? 'auto' : 'smooth' });
      }
    });
  });

});

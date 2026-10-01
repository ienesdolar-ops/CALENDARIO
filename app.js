/**
 * ============================================================
 *  APP.JS — Lógica do simulador de perfil Instagram
 * ============================================================
 *  Este arquivo gerencia:
 *  - Renderização da grade de posts (3 colunas)
 *  - Modal do post com carrossel, curtidas, comentários
 *  - Navegação entre posts no modal
 *  - Visão calendário com filtros
 *  - Tema claro/escuro
 *  - Interações: curtir, salvar, duplo-clique, teclado
 * ============================================================
 */

(function () {
  'use strict';

  // ─── Estado global ───────────────────────────────────────────
  const state = {
    currentView: 'instagram',    // 'instagram' | 'calendar'
    currentTab: 'posts',         // 'posts' | 'reels' | 'tagged'
    currentPostIndex: -1,        // Índice do post aberto no modal
    currentSlide: 0,             // Slide atual do carrossel
    liked: new Set(),            // IDs de posts curtidos
    saved: new Set(),            // IDs de posts salvos
    calendarYear: 2026,
    calendarMonth: 9,            // 0-indexed (9 = outubro)
    filteredPosts: [],           // Posts filtrados para exibição
    reelsPlaying: false,
  };

  // ─── Referências DOM ─────────────────────────────────────────
  const dom = {
    postGrid: document.getElementById('post-grid'),
    postModal: document.getElementById('post-modal'),
    modalContent: document.getElementById('modal-content'),
    modalMedia: document.getElementById('modal-media'),
    modalComments: document.getElementById('modal-comments'),
    modalCaption: document.getElementById('modal-caption'),
    modalLikes: document.getElementById('modal-likes'),
    modalDate: document.getElementById('modal-date'),
    modalPostStatus: document.getElementById('modal-post-status'),
    modalClose: document.getElementById('modal-close'),
    modalPrev: document.getElementById('modal-prev'),
    modalNext: document.getElementById('modal-next'),
    carouselContainer: document.getElementById('carousel-container'),
    carouselPrev: document.getElementById('carousel-prev'),
    carouselNext: document.getElementById('carousel-next'),
    carouselDots: document.getElementById('carousel-dots'),
    reelsPlayOverlay: document.getElementById('reels-play-overlay'),
    dblClickHeart: document.getElementById('dbl-click-heart'),
    btnLike: document.getElementById('btn-like'),
    btnSave: document.getElementById('btn-save'),
    btnCommentFocus: document.getElementById('btn-comment-focus'),
    btnShare: document.getElementById('btn-share'),
    commentInput: document.getElementById('comment-input'),
    btnPublishComment: document.getElementById('btn-publish-comment'),
    themeToggle: document.getElementById('theme-toggle'),
    btnViewInstagram: document.getElementById('btn-view-instagram'),
    btnViewCalendar: document.getElementById('btn-view-calendar'),
    instagramView: document.getElementById('instagram-view'),
    calendarView: document.getElementById('calendar-view'),
    calendarGrid: document.getElementById('calendar-grid'),
    calMonthYear: document.getElementById('cal-month-year'),
    calPrev: document.getElementById('cal-prev'),
    calNext: document.getElementById('cal-next'),
    filterStatus: document.getElementById('filter-status'),
    filterTipo: document.getElementById('filter-tipo'),
    filterPilar: document.getElementById('filter-pilar'),
  };

  // ─── Utilidades ──────────────────────────────────────────────

  /** Formata número com ponto de milhar (pt-BR) */
  function formatNumber(n) {
    return n.toLocaleString('pt-BR');
  }

  /** Formata data "YYYY-MM-DD" → "3 DE OUTUBRO DE 2026" */
  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).toUpperCase();
  }

  /** Formata data para exibição relativa/curta */
  function formatDateShort(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    const now = new Date();
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    if (diff < 7) return diff + ' dias atrás';
    if (diff < 30) return Math.floor(diff / 7) + ' semanas atrás';
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  }

  /** Retorna classe CSS baseada no status */
  function statusClass(status) {
    return 'status-' + status.replace(/ /g, '-');
  }

  /** Nome legível do status */
  function statusLabel(status) {
    const map = {
      'rascunho': '📝 Rascunho',
      'em aprovação': '⏳ Em aprovação',
      'aprovado': '✅ Aprovado',
      'publicado': '🟢 Publicado',
    };
    return map[status] || status;
  }

  /** Retorna os posts filtrados pela aba e filtros ativos */
  function getFilteredPosts() {
    let filtered = [...posts];

    // Filtrar por aba
    if (state.currentTab === 'reels') {
      filtered = filtered.filter(p => p.tipo === 'reels');
    } else if (state.currentTab === 'tagged') {
      filtered = []; // Sem posts marcados no momento
    }

    return filtered;
  }

  /** Retorna os posts filtrados para o calendário */
  function getCalendarFilteredPosts() {
    let filtered = [...posts];

    const statusFilter = dom.filterStatus.value;
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    const tipoFilter = dom.filterTipo.value;
    if (tipoFilter !== 'todos') {
      filtered = filtered.filter(p => p.tipo === tipoFilter);
    }

    const pilarFilter = dom.filterPilar.value;
    if (pilarFilter !== 'todos') {
      filtered = filtered.filter(p => p.pilar === pilarFilter);
    }

    return filtered;
  }

  // ─── Renderização da grade ───────────────────────────────────

  function renderGrid() {
    state.filteredPosts = getFilteredPosts();
    dom.postGrid.innerHTML = '';

    if (state.filteredPosts.length === 0) {
      dom.postGrid.innerHTML = `
        <div class="empty-feed">
          <div class="empty-feed-icon">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="3.2"/>
              <path d="M9 2L7.17 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3.17L15 2H9z"/>
            </svg>
          </div>
          <h2 class="empty-feed-title">Ainda não há publicações</h2>
          <p class="empty-feed-desc">Quando você adicionar posts no arquivo <strong>posts.js</strong>, eles aparecerão aqui na grade e no calendário para aprovação.</p>
        </div>
      `;
      return;
    }

    state.filteredPosts.forEach((post, index) => {
      const item = document.createElement('div');
      item.className = 'grid-item';
      item.setAttribute('data-index', index);

      // Imagem de capa (primeira mídia)
      const img = document.createElement('img');
      img.src = post.midias[0];
      img.alt = 'Post ' + post.id;
      img.loading = 'lazy';
      item.appendChild(img);

      // Ícone de tipo (carrossel ou reels)
      if (post.tipo === 'carrossel') {
        const icon = document.createElement('div');
        icon.className = 'grid-item-type-icon';
        icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M2 6h2v12H2V6zm4-2h2v16H6V4zm4-2h12v20H10V2zm2 2v16h8V4h-8z"/></svg>';
        item.appendChild(icon);
      } else if (post.tipo === 'reels') {
        const icon = document.createElement('div');
        icon.className = 'grid-item-type-icon';
        icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>';
        item.appendChild(icon);
      }

      // Overlay com curtidas e comentários
      const overlay = document.createElement('div');
      overlay.className = 'grid-item-overlay';
      overlay.innerHTML = `
        <span class="overlay-stat">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          ${formatNumber(post.curtidas)}
        </span>
        <span class="overlay-stat">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ${formatNumber(post.comentarios.length)}
        </span>
      `;
      item.appendChild(overlay);

      // Clicar abre o modal
      item.addEventListener('click', () => openModal(index));

      dom.postGrid.appendChild(item);
    });
  }

  // ─── Modal do post ───────────────────────────────────────────

  function openModal(index) {
    if (index < 0 || index >= state.filteredPosts.length) return;

    state.currentPostIndex = index;
    state.currentSlide = 0;
    state.reelsPlaying = false;

    const post = state.filteredPosts[index];

    // Renderizar mídia (carrossel)
    renderModalMedia(post);

    // Renderizar legenda e comentários
    renderModalComments(post);

    // Status
    dom.modalPostStatus.textContent = statusLabel(post.status);
    dom.modalPostStatus.className = 'modal-post-status ' + statusClass(post.status);

    // Curtidas
    dom.modalLikes.textContent = formatNumber(post.curtidas) + ' curtidas';

    // Data
    dom.modalDate.textContent = formatDate(post.data);

    // Estado de curtir/salvar
    updateLikeState(post);
    updateSaveState(post);

    // Navegação entre posts
    dom.modalPrev.style.display = index > 0 ? '' : 'none';
    dom.modalNext.style.display = index < state.filteredPosts.length - 1 ? '' : 'none';

    // Exibir modal
    dom.postModal.style.display = '';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    dom.postModal.style.display = 'none';
    document.body.style.overflow = '';
    state.currentPostIndex = -1;
    state.reelsPlaying = false;
  }

  function renderModalMedia(post) {
    const container = dom.carouselContainer;
    container.innerHTML = '';
    container.style.transform = 'translateX(0)';
    state.currentSlide = 0;

    post.midias.forEach((src) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Post ' + post.id;
      slide.appendChild(img);
      container.appendChild(slide);
    });

    // Setas e dots do carrossel
    const isCarousel = post.midias.length > 1;
    dom.carouselPrev.style.display = 'none';
    dom.carouselNext.style.display = isCarousel ? '' : 'none';

    // Dots
    dom.carouselDots.innerHTML = '';
    if (isCarousel) {
      post.midias.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i, post));
        dom.carouselDots.appendChild(dot);
      });
    }

    // Reels play overlay
    dom.reelsPlayOverlay.style.display = post.tipo === 'reels' ? '' : 'none';
    dom.reelsPlayOverlay.classList.remove('playing');
  }

  function goToSlide(index, post) {
    if (!post) post = state.filteredPosts[state.currentPostIndex];
    if (index < 0 || index >= post.midias.length) return;

    state.currentSlide = index;
    dom.carouselContainer.style.transform = `translateX(-${index * 100}%)`;

    // Atualizar setas
    dom.carouselPrev.style.display = index > 0 ? '' : 'none';
    dom.carouselNext.style.display = index < post.midias.length - 1 ? '' : 'none';

    // Atualizar dots
    const dots = dom.carouselDots.children;
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.toggle('active', i === index);
    }
  }

  function renderModalComments(post) {
    dom.modalComments.innerHTML = '';

    // Legenda como primeiro comentário
    const captionEl = document.createElement('div');
    captionEl.className = 'comment comment-caption';
    captionEl.innerHTML = `
      <img src="assets/profile.png" alt="" class="comment-avatar">
      <div class="comment-body">
        <span class="comment-text"><strong>inspirarbalcamboriu</strong> ${escapeHtml(post.legenda)}</span>
        <div class="comment-meta">
          <span>${formatDateShort(post.data)}</span>
        </div>
      </div>
    `;
    dom.modalComments.appendChild(captionEl);

    // Hashtags
    if (post.hashtags) {
      const hashEl = document.createElement('div');
      hashEl.className = 'comment';
      hashEl.innerHTML = `
        <div style="width:32px;flex-shrink:0"></div>
        <div class="comment-body">
          <span class="comment-text" style="color:var(--text-link);font-size:13px">${escapeHtml(post.hashtags)}</span>
        </div>
      `;
      dom.modalComments.appendChild(hashEl);
    }

    // Comentários
    post.comentarios.forEach(c => {
      const commentEl = document.createElement('div');
      commentEl.className = 'comment';
      commentEl.innerHTML = `
        <div class="comment-avatar" style="display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--text-secondary);background:var(--bg-tertiary)">${c.usuario.charAt(0).toUpperCase()}</div>
        <div class="comment-body">
          <span class="comment-text"><strong>${escapeHtml(c.usuario)}</strong> ${escapeHtml(c.texto)}</span>
          <div class="comment-meta">
            <span>${formatDateShort(post.data)}</span>
            <span style="cursor:pointer">Curtir</span>
            <span style="cursor:pointer">Responder</span>
          </div>
        </div>
      `;
      dom.modalComments.appendChild(commentEl);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ─── Like / Save ─────────────────────────────────────────────

  function toggleLike() {
    if (state.currentPostIndex < 0) return;
    const post = state.filteredPosts[state.currentPostIndex];
    if (state.liked.has(post.id)) {
      state.liked.delete(post.id);
      post.curtidas = Math.max(0, post.curtidas - 1);
    } else {
      state.liked.add(post.id);
      post.curtidas++;
    }
    updateLikeState(post);
    dom.modalLikes.textContent = formatNumber(post.curtidas) + ' curtidas';
  }

  function doLike() {
    if (state.currentPostIndex < 0) return;
    const post = state.filteredPosts[state.currentPostIndex];
    if (!state.liked.has(post.id)) {
      state.liked.add(post.id);
      post.curtidas++;
      updateLikeState(post);
      dom.modalLikes.textContent = formatNumber(post.curtidas) + ' curtidas';
    }
    // Animação de coração
    dom.dblClickHeart.classList.remove('animate');
    // Force reflow
    void dom.dblClickHeart.offsetWidth;
    dom.dblClickHeart.classList.add('animate');
    setTimeout(() => dom.dblClickHeart.classList.remove('animate'), 900);
  }

  function updateLikeState(post) {
    const isLiked = state.liked.has(post.id);
    dom.btnLike.classList.toggle('liked', isLiked);
  }

  function toggleSave() {
    if (state.currentPostIndex < 0) return;
    const post = state.filteredPosts[state.currentPostIndex];
    if (state.saved.has(post.id)) {
      state.saved.delete(post.id);
    } else {
      state.saved.add(post.id);
    }
    updateSaveState(post);
  }

  function updateSaveState(post) {
    const isSaved = state.saved.has(post.id);
    dom.btnSave.classList.toggle('saved', isSaved);
  }

  // ─── Duplo clique na imagem ──────────────────────────────────

  let lastClickTime = 0;
  dom.modalMedia.addEventListener('click', (e) => {
    // Não interferir com setas, dots ou play
    if (e.target.closest('.carousel-arrow') ||
        e.target.closest('.carousel-dots') ||
        e.target.closest('.reels-play-overlay')) return;

    const now = Date.now();
    if (now - lastClickTime < 300) {
      doLike();
    }
    lastClickTime = now;
  });

  // ─── Reels play/pause ────────────────────────────────────────

  dom.reelsPlayOverlay.addEventListener('click', () => {
    state.reelsPlaying = !state.reelsPlaying;
    dom.reelsPlayOverlay.classList.toggle('playing', state.reelsPlaying);
  });

  // ─── Carrossel ───────────────────────────────────────────────

  dom.carouselPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(state.currentSlide - 1);
  });

  dom.carouselNext.addEventListener('click', (e) => {
    e.stopPropagation();
    goToSlide(state.currentSlide + 1);
  });

  // ─── Navegação entre posts (modal) ───────────────────────────

  dom.modalPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.currentPostIndex > 0) {
      openModal(state.currentPostIndex - 1);
    }
  });

  dom.modalNext.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.currentPostIndex < state.filteredPosts.length - 1) {
      openModal(state.currentPostIndex + 1);
    }
  });

  // ─── Fechar modal ────────────────────────────────────────────

  dom.modalClose.addEventListener('click', closeModal);

  dom.postModal.addEventListener('click', (e) => {
    if (e.target === dom.postModal) closeModal();
  });

  // ─── Teclado ─────────────────────────────────────────────────

  document.addEventListener('keydown', (e) => {
    if (dom.postModal.style.display === 'none') return;

    switch (e.key) {
      case 'Escape':
        closeModal();
        break;
      case 'ArrowLeft': {
        if (e.target.tagName === 'INPUT') return;
        e.preventDefault();
        const post = state.filteredPosts[state.currentPostIndex];
        if (post && post.midias.length > 1 && state.currentSlide > 0) {
          // Navegar para slide anterior no carrossel
          goToSlide(state.currentSlide - 1);
        } else if (state.currentPostIndex > 0) {
          // Ir para o post anterior
          openModal(state.currentPostIndex - 1);
        }
        break;
      }
      case 'ArrowRight': {
        if (e.target.tagName === 'INPUT') return;
        e.preventDefault();
        const post = state.filteredPosts[state.currentPostIndex];
        if (post && post.midias.length > 1 && state.currentSlide < post.midias.length - 1) {
          // Navegar para próximo slide no carrossel
          goToSlide(state.currentSlide + 1);
        } else if (state.currentPostIndex < state.filteredPosts.length - 1) {
          // Ir para o próximo post
          openModal(state.currentPostIndex + 1);
        }
        break;
      }
      case 'ArrowUp':
        if (e.target.tagName === 'INPUT') return;
        e.preventDefault();
        if (state.currentPostIndex > 0) {
          openModal(state.currentPostIndex - 1);
        }
        break;
      case 'ArrowDown':
        if (e.target.tagName === 'INPUT') return;
        e.preventDefault();
        if (state.currentPostIndex < state.filteredPosts.length - 1) {
          openModal(state.currentPostIndex + 1);
        }
        break;
    }
  });

  // ─── Ações do post (curtir, salvar, comentar) ─────────────────

  dom.btnLike.addEventListener('click', toggleLike);
  dom.btnSave.addEventListener('click', toggleSave);

  dom.btnCommentFocus.addEventListener('click', () => {
    dom.commentInput.focus();
  });

  dom.commentInput.addEventListener('input', () => {
    dom.btnPublishComment.disabled = dom.commentInput.value.trim() === '';
  });

  dom.btnPublishComment.addEventListener('click', () => {
    const text = dom.commentInput.value.trim();
    if (!text || state.currentPostIndex < 0) return;

    const post = state.filteredPosts[state.currentPostIndex];
    const newComment = { usuario: 'voce', texto: text };
    post.comentarios.push(newComment);
    dom.commentInput.value = '';
    dom.btnPublishComment.disabled = true;

    // Re-renderizar comentários
    renderModalComments(post);

    // Scroll para o final
    dom.modalComments.scrollTop = dom.modalComments.scrollHeight;
  });

  dom.commentInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !dom.btnPublishComment.disabled) {
      dom.btnPublishComment.click();
    }
  });

  // ─── Botão seguir ────────────────────────────────────────────

  const btnFollow = document.querySelector('.btn-follow');
  if (btnFollow) {
    btnFollow.addEventListener('click', () => {
      btnFollow.classList.toggle('following');
      btnFollow.textContent = btnFollow.classList.contains('following') ? 'Seguindo' : 'Seguir';
    });
  }

  // ─── Abas ────────────────────────────────────────────────────

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentTab = tab.dataset.tab;
      renderGrid();
    });
  });

  // ─── Alternância de visão: Instagram ↔ Calendário ─────────

  dom.btnViewInstagram.addEventListener('click', () => {
    state.currentView = 'instagram';
    dom.btnViewInstagram.classList.add('active');
    dom.btnViewCalendar.classList.remove('active');
    dom.instagramView.style.display = '';
    dom.postGrid.style.display = '';
    dom.calendarView.style.display = 'none';
  });

  dom.btnViewCalendar.addEventListener('click', () => {
    state.currentView = 'calendar';
    dom.btnViewCalendar.classList.add('active');
    dom.btnViewInstagram.classList.remove('active');
    dom.instagramView.style.display = 'none';
    dom.postGrid.style.display = 'none';
    dom.calendarView.style.display = '';
    renderCalendar();
  });

  // ─── Calendário ──────────────────────────────────────────────

  const MONTH_NAMES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  function renderCalendar() {
    const year = state.calendarYear;
    const month = state.calendarMonth;
    const filteredPosts = getCalendarFilteredPosts();

    dom.calMonthYear.textContent = MONTH_NAMES[month] + ' ' + year;

    // Construir grid do calendário
    dom.calendarGrid.innerHTML = '';

    // Cabeçalhos dos dias
    DAY_NAMES.forEach(day => {
      const cell = document.createElement('div');
      cell.className = 'cal-header-cell';
      cell.textContent = day;
      dom.calendarGrid.appendChild(cell);
    });

    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1).getDay(); // 0=Dom
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const today = new Date();
    const todayStr = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');

    // Indexar posts por data
    const postsByDate = {};
    filteredPosts.forEach(post => {
      if (!postsByDate[post.data]) postsByDate[post.data] = [];
      postsByDate[post.data].push(post);
    });

    // Dias do mês anterior
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const cell = createDayCell(day, true, null, []);
      dom.calendarGrid.appendChild(cell);
    }

    // Dias do mês atual
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = year + '-' +
        String(month + 1).padStart(2, '0') + '-' +
        String(d).padStart(2, '0');
      const isToday = dateStr === todayStr;
      const dayPosts = postsByDate[dateStr] || [];
      const cell = createDayCell(d, false, isToday, dayPosts);
      dom.calendarGrid.appendChild(cell);
    }

    // Dias do próximo mês (completar linhas)
    const totalCells = dom.calendarGrid.children.length - 7; // subtract header cells
    const remainder = totalCells % 7;
    const remaining = remainder === 0 ? 0 : 7 - remainder;
    for (let d = 1; d <= remaining; d++) {
      const cell = createDayCell(d, true, false, []);
      dom.calendarGrid.appendChild(cell);
    }
  }

  function createDayCell(day, isOtherMonth, isToday, dayPosts) {
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell';
    if (isOtherMonth) cell.classList.add('other-month');
    if (isToday) cell.classList.add('today');

    const dayNum = document.createElement('div');
    dayNum.className = 'cal-day-number';
    dayNum.textContent = day;
    cell.appendChild(dayNum);

    dayPosts.forEach(post => {
      const item = document.createElement('div');
      item.className = 'cal-post-item';
      item.title = post.legenda.substring(0, 80) + '...';
      item.innerHTML = `
        <img src="${post.midias[0]}" alt="" class="cal-post-thumb">
        <span class="cal-post-label">${tipoEmoji(post.tipo)} ${post.pilar}</span>
        <span class="cal-post-status-dot ${statusClass(post.status)}"></span>
      `;

      item.addEventListener('click', () => {
        // Encontrar índice no array completo para abrir no modal
        const fullIndex = posts.indexOf(post);
        state.filteredPosts = posts;
        openModal(fullIndex);
      });

      cell.appendChild(item);
    });

    return cell;
  }

  function tipoEmoji(tipo) {
    const map = { imagem: '🖼️', carrossel: '📑', reels: '🎬' };
    return map[tipo] || '';
  }

  // Navegação do calendário
  dom.calPrev.addEventListener('click', () => {
    state.calendarMonth--;
    if (state.calendarMonth < 0) {
      state.calendarMonth = 11;
      state.calendarYear--;
    }
    renderCalendar();
  });

  dom.calNext.addEventListener('click', () => {
    state.calendarMonth++;
    if (state.calendarMonth > 11) {
      state.calendarMonth = 0;
      state.calendarYear++;
    }
    renderCalendar();
  });

  // Filtros do calendário
  dom.filterStatus.addEventListener('change', renderCalendar);
  dom.filterTipo.addEventListener('change', renderCalendar);
  dom.filterPilar.addEventListener('change', renderCalendar);

  // ─── Tema claro/escuro ───────────────────────────────────────

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ig-theme', theme);

    const sunIcon = dom.themeToggle.querySelector('.icon-sun');
    const moonIcon = dom.themeToggle.querySelector('.icon-moon');
    if (theme === 'dark') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = '';
    } else {
      sunIcon.style.display = '';
      moonIcon.style.display = 'none';
    }
  }

  dom.themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Inicializar tema salvo ou preferência do sistema
  function initTheme() {
    const saved = localStorage.getItem('ig-theme');
    if (saved) {
      setTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  // ─── Inicialização ──────────────────────────────────────────

  function init() {
    initTheme();
    renderGrid();

    // Detectar mês dos posts para o calendário ou usar mês atual
    if (posts.length > 0) {
      const firstDate = new Date(posts[0].data + 'T12:00:00');
      state.calendarYear = firstDate.getFullYear();
      state.calendarMonth = firstDate.getMonth();
    } else {
      const now = new Date();
      state.calendarYear = now.getFullYear();
      state.calendarMonth = now.getMonth();
    }
  }

  init();

})();

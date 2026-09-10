/**
 * KJ Net – Shared layout renderer
 * Call Layout.init(pageTitle, activeNav) at the top of each page script.
 */
const Layout = (() => {
  function init(pageTitle, activeNav) {
    const user = Auth.requireLogin();
    if (!user) return;

    document.title = pageTitle + ' – KJ Net';
    renderSidebar(user, activeNav);
    renderTopbar(pageTitle);
    startClock();
  }

  function renderSidebar(user, active) {
    const initial = user.full_name.charAt(0).toUpperCase();
    const role    = user.role;

    const adminLinks = role === 'admin' ? `
      <div class="nav-section">Admin</div>
      <a href="users.html"    class="nav-link ${active==='users'?'active':''}">
        ${icon('user-cog')} User Accounts
      </a>
      <a href="settings.html" class="nav-link ${active==='settings'?'active':''}">
        ${icon('settings')} Settings
      </a>
      <a href="backup.html"   class="nav-link ${active==='backup'?'active':''}">
        ${icon('backup')} Backup & Restore
      </a>
    ` : role === 'manager' ? `
      <div class="nav-section">Admin</div>
      <a href="backup.html" class="nav-link ${active==='backup'?'active':''}">
        ${icon('backup')} Backup & Restore
      </a>
    ` : '';

    const sidebar = `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <h1>KJ Net</h1>
        <span>Cafe Management System</span>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section">Main</div>
        <a href="dashboard.html"    class="nav-link ${active==='dashboard'?'active':''}">   ${icon('grid')}    Dashboard</a>
        <a href="computers.html"    class="nav-link ${active==='computers'?'active':''}">   ${icon('monitor')} Computers</a>
        <a href="services.html"     class="nav-link ${active==='services'?'active':''}">    ${icon('printer')} Services</a>
        <div class="nav-section">Records</div>
        <a href="customers.html"    class="nav-link ${active==='customers'?'active':''}">   ${icon('users')}   Customers</a>
        <a href="transactions.html" class="nav-link ${active==='transactions'?'active':''}"> ${icon('file')}   Transactions</a>
        <a href="reports.html"      class="nav-link ${active==='reports'?'active':''}">     ${icon('bar')}     Sales Reports</a>
        ${adminLinks}
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-avatar">${initial}</div>
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">${escHtml(user.full_name)}</div>
            <div class="sidebar-user-role">${role}</div>
          </div>
        </div>
        <a href="#" class="sidebar-logout" onclick="Auth.logout()">
          ${icon('logout')} Sign out
        </a>
      </div>
    </aside>`;

    document.getElementById('sidebar-mount').innerHTML = sidebar;
  }

  function renderTopbar(title) {
    document.getElementById('topbar-title').textContent = title;
  }

  function startClock() {
    function tick() {
      const el = document.getElementById('topbar-clock');
      if (!el) return;
      const now  = new Date();
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      el.textContent = days[now.getDay()] + ', ' +
        now.toLocaleDateString('en-PH',{month:'short',day:'numeric',year:'numeric'}) + '  ' +
        now.toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    }
    tick();
    setInterval(tick, 1000);
  }

  // SVG icon helper
  function icon(name) {
    const icons = {
      grid:    '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
      monitor: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
      printer: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
      users:   '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
      file:    '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
      bar:     '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
      'user-cog': '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      settings: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
      backup:   '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>',
      logout:   '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
    };
    return icons[name] || '';
  }

  function escHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // Modal helpers (global)
  window.openModal  = id => document.getElementById(id).classList.add('open');
  window.closeModal = id => document.getElementById(id).classList.remove('open');

  // Auto-dismiss alerts
  function autoDismiss() {
    document.querySelectorAll('[data-auto-dismiss]').forEach(el => {
      setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .5s'; }, 3500);
      setTimeout(() => el.remove(), 4000);
    });
  }

  // Toast notification
  function toast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3200);
  }

  // Close modals on overlay click
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('open');
    }
  });

  return { init, icon, escHtml, autoDismiss, toast };
})();

/**
 * KJ Net – LocalStorage Database
 * All data is stored in localStorage under namespaced keys.
 */
const DB = (() => {
  const KEYS = {
    users:        'kjnet_users',
    customers:    'kjnet_customers',
    computers:    'kjnet_computers',
    sessions:     'kjnet_sessions',
    services:     'kjnet_services',
    transactions: 'kjnet_transactions',
    svc_rates:    'kjnet_svc_rates',
    session_user: 'kjnet_session_user',
  };

  // ── Generic helpers ────────────────────────────────────────────
  const get  = key => JSON.parse(localStorage.getItem(key) || '[]');
  const set  = (key, val) => localStorage.setItem(key, JSON.stringify(val));
  const getObj = key => JSON.parse(localStorage.getItem(key) || 'null');
  const setObj = (key, val) => localStorage.setItem(key, JSON.stringify(val));
  const nextId = arr => arr.length ? Math.max(...arr.map(r => r.id)) + 1 : 1;
  const now    = () => new Date().toISOString();
  const genRef = () => 'KJ' + Math.random().toString(36).substr(2,8).toUpperCase();

  // ── Seed defaults if empty ──────────────────────────────────────
  function seed() {
    if (!localStorage.getItem(KEYS.users)) {
      set(KEYS.users, [
        { id:1, username:'admin',   password:'admin123',   full_name:'Administrator', role:'admin',   created_at: now() },
        { id:2, username:'staff',   password:'staff123',   full_name:'Staff Member',  role:'staff',   created_at: now() },
        { id:3, username:'manager', password:'manager123', full_name:'Manager',       role:'manager', created_at: now() },
      ]);
    }
    if (!localStorage.getItem(KEYS.computers)) {
      set(KEYS.computers, [
        { id:1,  name:'PC-01', status:'available', rate_per_hour:30, specs:'Intel i5, 8GB RAM, GTX 1060', created_at: now() },
        { id:2,  name:'PC-02', status:'available', rate_per_hour:30, specs:'Intel i5, 8GB RAM, GTX 1060', created_at: now() },
        { id:3,  name:'PC-03', status:'available', rate_per_hour:30, specs:'Intel i5, 8GB RAM',           created_at: now() },
        { id:4,  name:'PC-04', status:'available', rate_per_hour:30, specs:'Intel i5, 8GB RAM',           created_at: now() },
        { id:5,  name:'PC-05', status:'available', rate_per_hour:30, specs:'Intel i3, 4GB RAM',           created_at: now() },
        { id:6,  name:'PC-06', status:'available', rate_per_hour:30, specs:'Intel i3, 4GB RAM',           created_at: now() },
        { id:7,  name:'PC-07', status:'available', rate_per_hour:30, specs:'Intel i3, 4GB RAM',           created_at: now() },
        { id:8,  name:'PC-08', status:'available', rate_per_hour:25, specs:'Intel i3, 4GB RAM',           created_at: now() },
        { id:9,  name:'PC-09', status:'available', rate_per_hour:25, specs:'Core 2 Duo, 4GB RAM',         created_at: now() },
        { id:10, name:'PC-10', status:'available', rate_per_hour:25, specs:'Core 2 Duo, 4GB RAM',         created_at: now() },
      ]);
    }
    if (!localStorage.getItem(KEYS.svc_rates)) {
      set(KEYS.svc_rates, {
        print:     { price: 5,  label: 'per page' },
        scan:      { price: 5,  label: 'per page' },
        photocopy: { price: 3,  label: 'per page' },
        typing:    { price: 10, label: 'per page' },
      });
    }
    if (!localStorage.getItem(KEYS.customers))    set(KEYS.customers, []);
    if (!localStorage.getItem(KEYS.sessions))     set(KEYS.sessions, []);
    if (!localStorage.getItem(KEYS.services))     set(KEYS.services, []);
    if (!localStorage.getItem(KEYS.transactions)) set(KEYS.transactions, []);
  }

  // ── Session (auth) ──────────────────────────────────────────────
  const getSession   = () => getObj(KEYS.session_user);
  const setSession   = u  => setObj(KEYS.session_user, u);
  const clearSession = () => localStorage.removeItem(KEYS.session_user);

  // ── Users ───────────────────────────────────────────────────────
  const getUsers    = () => get(KEYS.users);
  const saveUsers   = v  => set(KEYS.users, v);
  const findUser    = (username) => getUsers().find(u => u.username === username);
  const addUser     = (u) => { const arr = getUsers(); u.id = nextId(arr); u.created_at = now(); arr.push(u); saveUsers(arr); return u; };
  const updateUser  = (id, patch) => { const arr = getUsers().map(u => u.id===id ? {...u,...patch} : u); saveUsers(arr); };
  const deleteUser  = (id) => saveUsers(getUsers().filter(u => u.id !== id));

  // ── Customers ───────────────────────────────────────────────────
  const getCustomers   = () => get(KEYS.customers);
  const saveCustomers  = v  => set(KEYS.customers, v);
  const addCustomer    = (c) => { const arr = getCustomers(); c.id = nextId(arr); c.created_at = now(); arr.push(c); saveCustomers(arr); return c; };
  const updateCustomer = (id, patch) => { const arr = getCustomers().map(c => c.id===id ? {...c,...patch} : c); saveCustomers(arr); };
  const deleteCustomer = (id) => saveCustomers(getCustomers().filter(c => c.id !== id));

  // ── Computers ───────────────────────────────────────────────────
  const getComputers   = () => get(KEYS.computers);
  const saveComputers  = v  => set(KEYS.computers, v);
  const addComputer    = (c) => { const arr = getComputers(); c.id = nextId(arr); c.created_at = now(); arr.push(c); saveComputers(arr); return c; };
  const updateComputer = (id, patch) => { const arr = getComputers().map(c => c.id===id ? {...c,...patch} : c); saveComputers(arr); };
  const deleteComputer = (id) => saveComputers(getComputers().filter(c => c.id !== id));

  // ── Sessions ────────────────────────────────────────────────────
  const getSessions   = () => get(KEYS.sessions);
  const saveSessions  = v  => set(KEYS.sessions, v);
  const getActiveSession = (pcId) => getSessions().find(s => s.computer_id === pcId && s.status === 'active');
  const addSession    = (s) => { const arr = getSessions(); s.id = nextId(arr); s.created_at = now(); arr.push(s); saveSessions(arr); return s; };
  const updateSession = (id, patch) => { const arr = getSessions().map(s => s.id===id ? {...s,...patch} : s); saveSessions(arr); };

  // ── Services ────────────────────────────────────────────────────
  const getServices   = () => get(KEYS.services);
  const saveServices  = v  => set(KEYS.services, v);
  const addService    = (s) => { const arr = getServices(); s.id = nextId(arr); s.created_at = now(); arr.push(s); saveServices(arr); return s; };
  const deleteService = (id) => saveServices(getServices().filter(s => s.id !== id));
  const getServicesForSession = (sid) => getServices().filter(s => s.session_id === sid);
  const getServicesTotalForSession = (sid) => getServicesForSession(sid).reduce((a,s) => a + s.total, 0);

  // ── Transactions ────────────────────────────────────────────────
  const getTransactions   = () => get(KEYS.transactions);
  const saveTransactions  = v  => set(KEYS.transactions, v);
  const addTransaction    = (t) => { const arr = getTransactions(); t.id = nextId(arr); t.reference = genRef(); t.created_at = now(); arr.push(t); saveTransactions(arr); return t; };
  const deleteTransaction = (id) => saveTransactions(getTransactions().filter(t => t.id !== id));

  // ── Service Rates ───────────────────────────────────────────────
  const getRates    = () => getObj(KEYS.svc_rates) || {};
  const saveRates   = v  => setObj(KEYS.svc_rates, v);

  // ── Backup / Restore ─────────────────────────────────────────────
  function exportBackup() {
    const data = {};
    Object.keys(KEYS).forEach(k => { data[k] = localStorage.getItem(KEYS[k]); });
    return JSON.stringify({ version: '1.0', date: now(), data }, null, 2);
  }

  function importBackup(jsonStr) {
    const parsed = JSON.parse(jsonStr);
    if (!parsed.data) throw new Error('Invalid backup file.');
    Object.keys(KEYS).forEach(k => {
      if (parsed.data[k] !== undefined && parsed.data[k] !== null) {
        localStorage.setItem(KEYS[k], parsed.data[k]);
      }
    });
  }

  // ── Utilities ────────────────────────────────────────────────────
  function formatMoney(n) {
    return '₱' + parseFloat(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function formatDuration(mins) {
    if (mins < 60) return mins + ' min';
    const h = Math.floor(mins / 60), m = mins % 60;
    return h + 'h ' + (m > 0 ? m + 'm' : '');
  }

  function formatDateTime(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('en-PH', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
  }

  function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' });
  }

  function formatTime(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('en-PH', { hour:'2-digit', minute:'2-digit' });
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function isoToDateStr(iso) {
    return iso ? iso.slice(0, 10) : '';
  }

  // Initialize
  seed();

  return {
    // Auth
    getSession, setSession, clearSession,
    // Users
    getUsers, findUser, addUser, updateUser, deleteUser,
    // Customers
    getCustomers, addCustomer, updateCustomer, deleteCustomer,
    // Computers
    getComputers, addComputer, updateComputer, deleteComputer,
    // Sessions
    getSessions, getActiveSession, addSession, updateSession,
    // Services
    getServices, addService, deleteService, getServicesForSession, getServicesTotalForSession,
    // Transactions
    getTransactions, addTransaction, deleteTransaction,
    // Rates
    getRates, saveRates,
    // Backup
    exportBackup, importBackup,
    // Utils
    formatMoney, formatDuration, formatDateTime, formatDate, formatTime, todayStr, isoToDateStr,
  };
})();

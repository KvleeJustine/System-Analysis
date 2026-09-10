/**
 * KJ Net – Auth helpers
 */
const Auth = (() => {
  function login(username, password) {
    const user = DB.findUser(username);
    if (user && user.password === password) {
      DB.setSession({ id: user.id, username: user.username, full_name: user.full_name, role: user.role });
      return user;
    }
    return null;
  }

  function logout() {
    DB.clearSession();
    window.location.href = 'index.html';
  }

  function requireLogin() {
    if (!DB.getSession()) {
      window.location.href = 'index.html';
      return null;
    }
    return DB.getSession();
  }

  function currentUser() {
    return DB.getSession();
  }

  return { login, logout, requireLogin, currentUser };
})();

const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
  window.location.href = '/login.html';
}

function logout() {
  localStorage.clear();
  window.location.href = '/login.html';
}

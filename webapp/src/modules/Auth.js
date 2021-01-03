class Auth {
  static signin(user) {
    localStorage.setItem('logged_in', true);
  }

  static isUserAuthenticated() {
    return localStorage.getItem('logged_in');
  }

  static signout() {
    localStorage.setItem('logged_in', false);
  }

}

export default Auth;
import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000/api/';

class AuthService {
  login(user) {
    return axios.post(API_URL + 'login', {
      email: user.email,
      password: user.password
    }).then(res => {
      var { response } = res.data
      if (response.token) {
        localStorage.setItem('user', JSON.stringify(response));
      }
      return response;
    })
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(API_URL + 'register', {
      name: user.name,
      email: user.email,
      password: user.password
    }).then(res => {
      var { response } = res.data
      if (response.token) {
        localStorage.setItem('user', JSON.stringify(response));
      }
      return response;
    })
  }
}

export default new AuthService();
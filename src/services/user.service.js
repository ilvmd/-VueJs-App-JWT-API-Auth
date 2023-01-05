import axios from 'axios';
import { authHeader, authHeader2 } from './auth-header';

const API_URL = 'http://127.0.0.1:8000/api/';

class UserService {
  getListOfCategories() {
    return axios.get(API_URL + 'category', { headers: authHeader2() });
  }

  getListOfMovies() {
    return axios.get(API_URL + 'movies', { headers: authHeader2() });
  }

  getListOfMoviesByCategory(id) {
    return axios.get(API_URL + 'moviesByCategory/' + id, { headers: authHeader2() });
  }

  getListOfMoviesByFilter(data) {
    return axios.get(API_URL + 'filter-movies', { params: data, headers: { "Content-Type": "application/json", ...authHeader2() } });
  }

  getMovieById(id) {
    return axios.get(API_URL + 'movies/' + id, { headers: authHeader2() });
  }

  createMovie(data) {
    return axios({
      method: 'post',
      url: API_URL + 'movies/',
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
        ...authHeader2()
      }
    });
  }

  updateMovie(id, data) {
    return axios({
      method: 'post',
      url: API_URL + 'movies/' + id,
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
        ...authHeader2()
      }
    });
  }

  deleteMovie(id) {
    return axios.delete(API_URL + 'movies/' + id, { headers: authHeader2() });
  }

}

export default new UserService();
<template>
  <div class="container mt-5">

    <router-link to="/create" class="btn btn-sm btn-primary mb-5">
      <font-awesome-icon icon="plus" /> Create
    </router-link>

    <Form @submit="searchMovie">

      <div class="row align-items-center">
        <div class="col-md-3">
          <label for="category">Categories</label><br>
          <Field name="category" as="select" class="form-control mb-3">
            <option value="">choose category</option>
            <option v-for="option in this.categories" :key="option.id" :value="option.id">{{ option.title }}</option>
          </Field>
        </div>
        <div class="col-md-4">
          <label for="txtSearch">title</label><br>
          <Field type="text" name="title" id="txtSearch" class="form-control mb-3" />
        </div>
        <div class="col-md-3">
          <label for="txtSearch">rate</label><br>
          <Field name="rate" as="select" class="form-control mb-3">
            <option value="">choose rate</option>
            <option value="1">1 star</option>
            <option value="2">2 star</option>
            <option value="3">3 star</option>
            <option value="4">4 star</option>
            <option value="5">5 star</option>
          </Field>
        </div>
        <div class="col-md-1">
          <button type="submit" class="btn btn-sm btn-primary mt-2">search</button>
        </div>
      </div>
    </Form>

    <hr>



    <div class="row position-relative">

      <div v-show="loading" class="loading">
        <span class="spinner-border spinner-border-sm"></span>
      </div>


      <div v-for="movie in movies" :key="movie.id" class="col-md-3 mb-3">
        <div class="card">
          <img class="card-img-top" :src="movie.img.url" alt="">
          <div class="card-body">
            <h4 class="card-title">{{ movie.title }}</h4>
            <p class="card-text">{{ movie.description }}</p>
            <p class="card-text">rate: {{ movie.rate }}</p>
            <p class="card-text">category: {{ movie.category.title }}</p>

            <div class="input-group">
              <router-link :to="'/edit/' + movie.id" class="btn btn-sm btn-primary mr-2">
                <font-awesome-icon icon="user" /> edit
              </router-link>
              <Form @submit.prevent="deleteMovie(movie.id)">
                <button class="btn btn-sm btn-danger">delete</button>
              </Form>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

import UserService from "../services/user.service";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  name: 'Profile',
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      tempMovies: [],
      movies: [],
      categories: [],
      loading: false
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    currentUser() {
      return this.$store.state.auth.user ? this.$store.state.auth.user : {
        name: 'Guest',
        id: ''
      }
    }
  },
  methods: {
    deleteMovie(id) {
      this.loading = true;
      UserService.deleteMovie(id).then((response) => {
        UserService.getListOfMovies().then((response) => {
          this.movies = response.data.response;
          this.loading = false;
        }, (error) => { });
      }, (error) => { }
      );
    },
    handleSelectCategory(event) {
      if (!event.target.value) {
        this.movies = this.tempMovies;
        return;
      }
      UserService.getListOfMoviesByCategory(event.target.value).then((categoryResponse) => {
        console.log(categoryResponse);
        this.movies = categoryResponse.data.response
      }, (categoryError) => {

      })
    },
    searchMovie(event) {
      console.log(event);
      UserService.getListOfMoviesByFilter(event).then((response) => {
        console.log(response);
        this.movies = response.data.response
      }, (error) => {

      })
      return false
    }
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push("/login");
    }
    this.loading = true
    UserService.getListOfCategories()
      .then((categoryResponse) => {
        this.categories = categoryResponse.data.response
        this.successful = true
      }, (categoryError) => {

      })

    UserService.getListOfMovies().then(
      (response) => {
        this.loading = false
        this.movies = response.data.response;
        this.tempMovies = response.data.response;
      },
      (error) => {
        console.log(error);
      }
    );

  }
};
</script>

<style scoped>
.loading {
  position: absolute;
  top: 0;
  background: #f8d7fa;
  background: #040404;
  width: 100%;
  z-index: 111;
  height: 100%;
  opacity: 0.5;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading span {
  width: 50px;
  height: 50px;
  color: aliceblue;
}
</style>
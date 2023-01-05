<template>
  <div class="col-md-12 mt-3">
    <div v-if="successful" class="">
      <div class="position-relative">
        <img :src="movie.img.url" class="mb-3" />
        <label class="edit-img" for="select-image">
          <font-awesome-icon icon="edit" />
        </label>
      </div>

      <div v-if="errors" class="alert alert-danger">
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </div>

      <div v-if="message" class="alert mt-3" :class="successfulUpdate ? 'alert-success' : 'alert-danger'">
        {{ message }}
      </div>

      <Form @submit="editMovie" :validation-schema="schema">

        <div class="form-group">
          <Field name="image" type="file" @change="handleChange" class="d-none" id="select-image" />
          <ErrorMessage name="image" class="error-feedback" />
        </div>

        <div class="form-group">
          <label for="title">title</label>
          <Field name="title" type="text" v-model="movie.title" class="form-control mb-3" />
          <ErrorMessage name="title" class="error-feedback" />
        </div>

        <div class="form-group">
          <label for="description">description</label><br>
          <Field name="description" as="textarea" class="form-control mb-3" v-model="movie.description" />
          <ErrorMessage name="description" class="error-feedback" />
        </div>

        <div class="form-group">
          <label for="category">Categories</label><br>
          <Field name="category_id" as="select" class="form-control mb-3" v-model="movie.category_id">
            <option v-for="option in this.categories" :key="option.id" :value="option.id">{{ option.title }}</option>
          </Field>
          <ErrorMessage name="category_id" class="error-feedback" />
        </div>

        <div class="form-group">
          <button class="btn btn-success" :disabled="loading" type="submit">
            <span v-show="loading" class="spinner-border spinner-border-sm"></span>
            update
          </button>
        </div>

      </Form>

    </div>
  </div>
</template>
  

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import UserService from "../services/user.service";
import * as yup from "yup";

export default {
  name: "Register",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      title: yup
        .string()
        .required("title is required!")
        .min(3, "Must be at least 3 characters!")
        .max(20, "Must be maximum 20 characters!"),
      description: yup
        .string()
        .required("description is required!")
        .min(10, "Must be maximum 10 characters!")
        .max(150, "Must be maximum 150 characters!"),
      // rate: yup
      //   .number()
      //   .default(0)
      //   .min(0, "Must be at least 0 characters!")
      //   .max(5, "Must be maximum 5 characters!"),
      category_id: yup
        .number()
        .required("category is required"),
      image: yup.mixed().when('$exist', {
        is: exist => exist,
        then: yup
          .mixed()
          .test("fileSize", "The file is too large", (value) => {
            return value && value.size <= 5000000;
          })
          .test("type", "Only the following formats are accepted: .jpeg, .jpg, .png, .gif", (value) => {
            return value && ["image/jpg", "image/jpeg", "image/gif", "image/png"].includes(value.type);
          }),
        otherwise: yup.mixed(),
      })
      // .mixed()
      // .nullable()
      // // .required('VALIDATION_FIELD_REQUIRED')
      // // .test('is-correct-file', 'VALIDATION_FIELD_FILE_BIG', checkIfFilesAreTooBig)
      // // .test(
      // //   'is-big-file',
      // //   'VALIDATION_FIELD_FILE_WRONG_TYPE',
      // //   checkIfFilesAreCorrectType
      // // ),
      // .test("fileSize", "The file is too large", (value) => {
      //   return value && value.size <= 5000000;
      // })
      // .test("type", "Only the following formats are accepted: .jpeg, .jpg, .png, .gif", (value) => {
      //   return value && ["image/jpg", "image/jpeg", "image/gif", "image/png"].includes(value.type);
      // })
    });

    return {
      successful: false,
      successfulUpdate: false,
      loading: false,
      message: "",
      schema,

      movie: null,
      errors: null,
      categories: [],
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push("/login");
    }
    UserService.getMovieById(this.$route.params.id).then(
      (movieResponse) => {
        if (movieResponse.data.error) {
          this.$router.push("/profile");
        } else {

          UserService.getListOfCategories()
            .then((categoryResponse) => {
              this.movie = movieResponse.data.response;
              this.categories = categoryResponse.data.response
              this.successful = true
            }, (categoryError) => {

            })
        }

      },
      (error) => {
        console.log(error);
      }
    );

  },
  created() {
    console.log("created");
  },
  methods: {
    handleChange(event) {
      var file = event.target.files[0];
      var reader = new FileReader(file);
      reader.onloadend = (data) => this.movie.img.url = data.target.result;
      reader.readAsDataURL(file)
    },
    editMovie(event) {
      let formData = new FormData();
      this.loading = true

      for (const key in event) {
        if (Object.hasOwnProperty.call(event, key)) {
          formData.append(key, event[key])
        }
      }
      formData.append("_method", 'put')

      if (event.image != undefined) {
        console.log(event.image);
        formData.append("image", event.image, event.image.name)
      }
      else {
        formData.delete('image')
      }


      UserService.updateMovie(this.$route.params.id, formData).then((sucRes) => {
        console.log(sucRes);
        this.message = "success update ..."
        this.loading = false
        this.errors = null
        setTimeout(() => {
          this.message = ""
        }, 2000);
        this.successfulUpdate = true;
      }, (errRes) => {
        console.log(errRes.response);

        this.loading = false
        if (errRes.response.data.message) {
          if (errRes.response.data.message.indexOf('23000') != -1) {
            this.successfulUpdate = false
            this.message = "name is duplicate ..."
          }
        }
        if (errRes.response.data.error) {
          this.errors = errRes.response.data.errors
          console.log(this.errors);
        }
      })
      return false
    },
  },
};
</script>
  
<style scoped>
img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.edit-img {
  position: absolute;
  left: 10px;
  padding: 10px;
  background: #00050aa1;
  border-radius: 5px;
  top: 10px;
  color: #FFF;
  cursor: pointer;
}

.error-feedback {
  margin: 47px 0;
  background: #c10000;
  color: #FFF;
  padding: 5px;
  width: 100%;
}
</style>
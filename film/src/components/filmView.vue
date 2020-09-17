<template>
  <div class="filmContainer">
    <v-img
      @click="openDetails()"
      :src="movieDetail.Poster"
      lazy-src="../assets/movie-poster-coming-soon.png"
      id="img"
    ></v-img>
    <router-link
      :to="{ name: 'filmViewDetails', query: {id:movieDetail.imdbID}}"
      target="_blank"
    >More information.</router-link>
    <h3>Title : {{movieDetail.Title}}</h3>
    <h3>Year : {{movieDetail.Year}}</h3>
  </div>
</template>

<style lang="scss">
.filmContainer {
  width: 100%;
  margin-top: 50px;
}

.filmContainer h1 {
  margin-top: 10px;
}

#img {
  width: 60%;
  margin: auto;
}
</style>

<script>
export default {
  name: "filmView",
  components: {},
  data: function () {
    return {
      data: {},
    };
  },
  methods: {},
  props: ["movieDetail"],
};
</script>
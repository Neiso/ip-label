<template>
  <div class="filmContainer">
    <v-img
      @click="openDetails()"
      :src="movieDetail.Poster"
      lazy-src="../assets/movie-poster-coming-soon.png"
    ></v-img>
    <router-link
      :to="{ name: 'filmViewDetails', query: {id:movieDetail.imdbID}}"
      target="_blank"
    >More information.</router-link>
    <h1>Title : {{movieDetail.Title}}</h1>
    <h1>Year : {{movieDetail.Year}}</h1>
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
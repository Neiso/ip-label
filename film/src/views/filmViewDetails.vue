<template>
  <div class="filmContainer">
    <h1>Title : {{data.Title}}</h1>
    <v-img :src="data.Poster" lazy-src="../assets/movie-poster-coming-soon.png" id="poster"></v-img>
    <h1>Year : {{data.Year}}</h1>
    <h3>Actor : {{data.Actors}}</h3>
    <h3>Awards : {{data.Awards}}</h3>
    <h3>BoxOffice : {{data.BoxOffice}}</h3>
    <h3>Country : {{data.Country}}</h3>
    <h3>Director : {{data.Director}}</h3>
    <h3>Genre : {{data.Genre}}</h3>
    <h3>Plot : {{data.Plot}}</h3>
    <h3>Production : {{data.Production}}</h3>
    <h3 v-for="rating in data.Ratings" :key="rating.Source">
      Source :
      {{rating.Source}}
      <br />
      Note: {{rating.Value}}
    </h3>
    <h3>Released : {{data.Released}}</h3>
    <h3>Runtime : {{data.Runtime}}</h3>
    <h3>Writer : {{data.Writer}}</h3>
  </div>
</template>

<style lang="scss">
.filmContainer {
  width: 40%;
  margin: auto;
}

.filmContainer h1 {
  margin-bottom: 10px;
}

.filmContainer h3 {
  margin-bottom: 10px;
}

#poster {
  width: 70%;
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
  mounted: async function () {
    console.log(this.$route.query.id);
    const raw_response = await fetch(
      `http://www.omdbapi.com/?apikey=8f0a5987&i=${this.$route.query.id}`
    );
    const response = await raw_response.json();
    this.data = response;
    console.log(this.data);
  },
  props: {
    id: Object,
  },
};
</script>
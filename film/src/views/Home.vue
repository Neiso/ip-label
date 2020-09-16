<template>
  <v-app>
    <div class="Home">
      <v-col cols="12" sm="6" md="3">
        <div id="searchBar">
          <v-text-field
            id="searchField"
            cols="9"
            label="Regular"
            solo
            single-line
            clearable
            autofocus
            dense
            placeholder="Film, auteur, genre, ..."
            class="ma-4"
            hide-details="auto"
            v-model="data.title"
            @change="fetchAPIData"
            prepend-inner-icon="mdi-magnify"
            :rules="rules"
          ></v-text-field>
          <div class="search-btn">
            <v-btn medium color="blue lighten-4" @click="fetchAPIData()">Search</v-btn>
          </div>
        </div>
        <div id="pageCounter">
          <v-btn icon color="black" class="ma-0" @click="previousPage(); fetchAPIData()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-col sm="2" xs="4" cols="2" id="reduce-col">
            <v-text-field dense v-model="data.page" :value="data.page" @change="fetchAPIData()"></v-text-field>
          </v-col>
          <v-btn icon color="black" class="ma-0" @click="nextPage(); fetchAPIData()">
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
        <viewFilm v-for="item in this.data.result.Search" :key="item.imdbID" :movieDetail="item"></viewFilm>
      </v-col>
    </div>
  </v-app>
</template>

<style lang="scss">
.Home {
  display: flex;
  justify-content: center;
  align-items: center;
}

#searchBar {
  display: flex;
  align-items: center;
}

#pageCounter {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script>
import viewFilm from "../components/filmView.vue";
export default {
  name: "Home",
  components: { viewFilm },
  data: () => {
    return {
      data: {
        result: [],
        title: "",
        page: 1,
      },
      rules: [(value) => (value || "").length >= 3 || false],
    };
  },
  methods: {
    fetchAPIData: function () {
      if (!this.data.page) {
        this.data.page = 1;
      }
      if (this.data.title == null) {
        this.data.title = "";
      }
      if (this.data.title.length >= 3) {
        fetch(
          `http://www.omdbapi.com/?apikey=8f0a5987&page=${this.data.page}&s=${this.data.title}`
        )
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              alert(
                "Server returned " +
                  response.status +
                  " : " +
                  response.statusText
              );
            }
          })
          .then((response) => {
            this.data.result = response;
            console.log(this.data.result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    nextPage: function () {
      this.data.page = parseInt(this.data.page) + 1;
    },
    previousPage: function () {
      if (this.data.page > 1) {
        this.data.page = parseInt(this.data.page) - 1;
      }
    },
  },
};
</script>


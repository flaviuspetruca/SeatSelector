import axios from "axios";

// Replace YOUR_API_KEY with your actual API key from TMDB
const API_KEY = "79b6502e2fc913cf22abaf2b2c1d2ab7";
const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;

const movieList = [];

axios
  .get(API_URL)
  .then(async (response) => {
    const data = response.data;
    for (const movie of data.results) {
      const movieDetails = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`
      );
      const movieData = {
        id: movie.id,
        title: movie.title,
        description: movie.overview,
        duration: movieDetails.data.runtime
          ? `${movieDetails.data.runtime} min`
          : "",
        image: movie.poster_path
          ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
          : "",
      };
      movieList.push(movieData);
    }
    console.log(JSON.stringify(movieList));
  })
  .catch((error) => {
    console.log(error);
  });

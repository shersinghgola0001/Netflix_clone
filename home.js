// /constants
const apikey ="7543524441a260664a97044b8e2dc621";
const apiEndpoint ="https://api.themoviedb.org/3"
const imgPath = "https://image.tmdb.org/t/p/original";


const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending:`${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
}

// boots up the app
function init(){
    fetchTrendingMovies();
    fetchAndBuildAllSections();
}
function fetchTrendingMovies(){
    fetchAndbuildMovieSection(apiPaths.fetchTrending, 'Trending Now')
    .then(list => {
        const randomIndex = parseInt(Math.random() * list.length);
        buildBannerSection(list[randomIndex]);
    }).catch(err=>{
        console.error(err);
    });
}
function buildBannerSection(movie){
    const bannercontainer = document.getElementById('banner-section');
    bannercontainer.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

    const div = document.createElement('div');
    div.innerHTML = ` 
            <h2 class="banner_title">${movie.title}</h2>
            <p class="banner_info">Trending in movies | Released - ${movie.release_date}</p>
            <p class="banner_overview">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0,200).trim()+'...':movie.overview}</p>
            <div class="action-button-container">
                <button class="action-button"><img src="https://cdn.iconscout.com/icon/premium/png-256-thumb/play-5689110-4761596.png?f=avif&w=128" width="24" height="24" >&nbsp;&nbsp;Play</button>
                <button class="action-button"><img src="https://cdn.iconscout.com/icon/free/png-256/information-3351843-2791291.png?f=avif&w=128" width="24" height="24">&nbsp;&nbsp;More Info</button>
            </div>
            `;
            div.className = "banner-content container";
    bannercontainer.append(div);
}

function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        if(Array.isArray(categories) && categories.length ){
            categories.forEach(category => {
                fetchAndbuildMovieSection(apiPaths.fetchMoviesList(category.id), 
                category.name
                );
        });
        }
        // console.table(movies);
    }) 
    .catch(err => console.error(err));
}
function fetchAndbuildMovieSection(fetchUrl, categoryName){
    console.log(fetchUrl,categoryName);
   return fetch(fetchUrl)
    .then(res => res.json())
    .then(res => {
        // console.table(res.results);
        const movies = res.results;
        if(Array.isArray(movies) && movies.length){
            buildMoviesSections(movies,categoryName);
        }
        return movies;
    })
    .catch(err=>console.error(err))

}
function buildMoviesSections(list,categoryName){
    console.log(list, categoryName);
    const moviescontainer = document.getElementById('movies-container');

    const moviesListHTML = list.map(item => {
        return`

            <img class="movies-item" src="${imgPath}${item.backdrop_path}" alt="${item.title}">
           
         `;
    }).join('');

    const moviesSectionHTML = `
    <h2 class="movies-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></h2>
    <div class="movies-row">
    ${moviesListHTML}
    </div>
    `
   const div = document.createElement('div')
   div.className = "movies-section"
   div.innerHTML = moviesSectionHTML;

//    append html into movies container
   moviescontainer.append(div);
}
   
window.addEventListener('load',function() {
    init();
    window.addEventListener('scroll', function(){
        // header ui update
        const header = document.getElementById('header');
        if(window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
})
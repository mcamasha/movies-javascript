const getMovies = () => {
  try {
    return axios.get("https://api.themoviedb.org/3/movie/popular?api_key=37662c76ffc19e5cd1b95f37d77155fc&language=ru-RU&page=1");
  } catch (error) {
    console.error(error)
  }
}

const getGenres = () => {
  try {
    return axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=37662c76ffc19e5cd1b95f37d77155fc&language=ru-RU");
  } catch (error) {
    console.error(error)
  }
}

function openSearch() {
  const movies = [];
  const genres = [];
  const addMovies = async () => {
    const genreArray = getGenres()
      .then(response => {
        if (response.data.genres) {
          for (var i = 0; i < Object.entries(response.data.genres).length; i++) {
            genres.push(Object.entries(response.data.genres)[i][1]);
          }
          }
      })
      .catch(error => {
        console.log(error)
      }) 

      const movieArray = getMovies()
      .then(response => {
        if (response.data.results) {
          for (var i = 0; i < Object.entries(response.data.results).length; i++) {
            movies.push(Object.entries(response.data.results)[i][1]);
          }
          
          for (var i = 0; i < movies.length; i++) {
            for(var j = 0; j < movies[i].genre_ids.length; j++) {
              for(var k = 0; k < genres.length; k++) {
                if(genres[k].id == movies[i].genre_ids[j]) {
                  delete movies[i].genre_ids[j];
                  movies[i].genre_ids[j] = genres[k].name;
                }
              }
            }
          }

          loadTable(1, movies);
          loadPaginator(movies);
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

    addMovies();
    var pageCurrent = 1;
    var quantityMoviesOnPage = 5;

    var linkMyMovie = document.getElementById("linkMyMovie");
    var linkSearch = document.getElementById("linkSearch");
    if(!linkSearch.classList.contains("active")) {
        linkMyMovie.classList.remove("active");
        linkSearch.classList.add("active");
    }

    var mainDiv = document.getElementById("main");
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild);
    }

    var row = document.createElement("div");
    row.classList.add("row");
    var colomn1 = document.createElement("div");
    colomn1.classList.add("col-md-1", "content"); 
    var colomn10 = document.createElement("div");
    colomn10.classList.add("col-md-10", "content", "main"); 
    var form = document.createElement("form");
    form.classList.add("form-inline");
    form.innerHTML ='<div class="selects" align="left"><select name="format"><option selected="selected" disabled>Format</option><option value="Movie">Movie</option><option value="TVserials">TV Serials</option><option value="short">Short</option></select><select name="genre"><option selected="selected" disabled>Genre</option><option value="Movie">Horror</option><option value="TVserials">Comedy</option><option value="short">Triller</option></select><select name="year"><option selected="selected" disabled>Year</option><option>2011-2018</option><option>2001-2010</option><option>1991-2000</option><option>1981-1990</option><option>1971-1980</option><option>1961-1970</option></select><div class="input-append"><input type="text" class="span2" placeholder="Search movie..."> <button type="submit" class="btn">Search</button></div> </div>';

    mainDiv.appendChild(row);
    row.appendChild(colomn1);
    row.appendChild(colomn10);
    colomn10.appendChild(form);

    var rowTable = document.createElement("row");
    var table = document.createElement("table");
    table.classList.add("table-movies", "table-hover", "table-bordered");
    var thead = document.createElement("thead");
    thead.innerHTML = '<thead><tr><th></th> <th>Title</th> <th>Has video?</th> <th>Genre</th> <th>Year</th> <th>Rating</th> </tr> </thead>'
    var tbody = document.createElement('tbody');

    colomn10.appendChild(rowTable);
    rowTable.appendChild(table);
    table.appendChild(thead);
    table.appendChild(tbody);

    function loadTable(page, movies) {   
      var length;
      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }

      var firstMovie = (page - 1) * quantityMoviesOnPage + 1

      if(movies.length > (firstMovie + 5)) 
        length = 5; 
      else
        length = movies.length - firstMovie;

      // console.log("first movie = " + firstMovie);
      // console.log("page " + page);
      for(var i = firstMovie; i < (firstMovie+length); i++) {
      // for(var i = 0; i < movies.length; i++) {
        var lastTr = tr;
        var tr = document.createElement('tr');
        var tdPoster = document.createElement('td');
        var poster = document.createElement('img');
        poster.setAttribute('src', movies[i].poster_path);
        poster.setAttribute('alt', 'img');
        tdPoster.appendChild(poster);
        var tdTitle = document.createElement('td');
        tdTitle.innerHTML = movies[i].title;
        var tdFormat = document.createElement('td');
        tdFormat.innerHTML = movies[i].video;
        var tdGenre = document.createElement('td');
        tdGenre.innerHTML = movies[i].genre_ids;
        var tdYear = document.createElement('td');
        tdYear.innerHTML = movies[i].release_date.substring(0, 4);
        var tdRating = document.createElement('td');
        tdRating.innerHTML = movies[i].vote_average;

        if(i > firstMovie) {
          tbody.insertBefore(tr, lastTr);
        } else {
          tbody.appendChild(tr);
        }
            
        tr.appendChild(tdPoster);
        tr.appendChild(tdTitle);
        tr.appendChild(tdFormat);
        tr.appendChild(tdGenre);
        tr.appendChild(tdYear);
        tr.appendChild(tdRating);
      }
    }

    //paginator
    function loadPaginator(movies) {
      var paginator = document.createElement("nav");
      paginator.classList.add("nav");
      var ulPaginator = document.createElement("ul");
      ulPaginator.classList.add("pagination", "pull-right");
      var previousPage = document.createElement("li");
      previousPage.classList.add("page-item");
      var previousLink = document.createElement("a");
      previousLink.classList.add("page-link");
      previousLink.setAttribute("href", "#");
      previousLink.setAttribute("aria-label", "Previous");
      previousLink.innerHTML = '<span aria-hidden="true">&laquo;</span> <span class="sr-only">Previous</span>';

      colomn10.appendChild(paginator);
      paginator.appendChild(ulPaginator);
      ulPaginator.appendChild(previousPage);
      previousPage.appendChild(previousLink);

      for(var i = 1; i <= (movies.length / 5); i++) {
          var liLink = document.createElement("li");
          liLink.classList.add("page-item");
          var aLink = document.createElement("a");
          aLink.classList.add("page-link");
          aLink.setAttribute("href", "#");
          aLink.innerHTML = i;
          liLink.addEventListener('click',(function(i) {return function() { loadTable(i, movies); };})(i),false);

          ulPaginator.appendChild(liLink);
          liLink.appendChild(aLink);
      }

      var nextPage = document.createElement("li");
      nextPage.classList.add("page-item");
      var nextLink = document.createElement("a");
      nextLink.classList.add("page-link");
      nextLink.setAttribute("href", "#");
      nextLink.setAttribute("aria-label", "Next");
      nextLink.id = "next";
      nextLink.innerHTML = '<span aria-hidden="true">&raquo;</span> <span class="sr-only">Next</span>';

      ulPaginator.appendChild(nextPage);
      nextPage.appendChild(nextLink);
    
  }
    var footer = document.getElementById("footer");
    footer.style.marginTop = "0px";
}

function openMyMovies() {
    
    var linkMyMovie = document.getElementById("linkMyMovie");
    var linkSearch = document.getElementById("linkSearch");
    if(!linkMyMovie.classList.contains("active")) {
        linkSearch.classList.remove("active");
        linkMyMovie.classList.add("active");
    }

    //удаляем содержимое страницы
    var mainDiv = document.getElementById("main");
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild);
    }

    //title
    var rowCaption = document.createElement("div");
    rowCaption.innerHTML = '<div class="container"> </div><div class="row caption"> <div class="col-md-5"></div> <div class="col-md-2 text-center caption-text vcenter"> <h1>My Movies</h1> </div> <div class="col-md-4 filter vcenter" align="center"> <a href="#">by rating</a> | <a href="#">by date</a> <div class="col-md-1"></div> </div> </div>';

    mainDiv.appendChild(rowCaption);
    
    //movies
    var rowMovie = document.createElement("div");
    rowMovie.classList.add("row");
    var colomn1xs = document.createElement("div");
    colomn1xs.classList.add("col-xs-1"); 
    var colomn10xs = document.createElement("div");
    colomn10xs.classList.add("col-xs-10"); 
    var row = document.createElement("div");
    row.classList.add("row");

    mainDiv.appendChild(rowMovie);
    rowMovie.appendChild(colomn1xs);
    rowMovie.appendChild(colomn10xs);
    colomn10xs.appendChild(row);

    for(var i = 0; i < moviesObject.movies.length; i++) {
        var lastColomn12xs = colomn12xs;
        var colomn12xs = document.createElement("div");
        colomn12xs.classList.add("col-xs-12"); 
        var movieTable = document.createElement("table");
        movieTable.classList.add("table-each-movie");
        var trInfo = document.createElement("tr");
        var trOverview = document.createElement("tr");
        var td = document.createElement("td");
        var tdCenter = document.createElement("td");
        tdCenter.setAttribute("align", "center");
        var poster = document.createElement("img");
        poster.setAttribute("alt", "poster");
        var tdTitle = document.createElement("td");
        tdTitle.setAttribute("align", "center");
        var tdRating = document.createElement("td");
        tdRating.setAttribute("align", "right");
        var titleMovie = document.createElement("h2");
        var divRatingStar = document.createElement("div");
        divRatingStar.classList.add("rating-star"); 
        var star1 = document.createElement("span");
        star1.classList.add("fa", "fa-star");
        var star2 = document.createElement("span");
        star2.classList.add("fa", "fa-star");
        var star3 = document.createElement("span");
        star3.classList.add("fa", "fa-star");
        var star4 = document.createElement("span");
        star4.classList.add("fa", "fa-star");
        var star5 = document.createElement("span");
        star5.classList.add("fa", "fa-star"); 
        var starChecked = document.createElement("span");
        starChecked.classList.add("fa", "fa-star", "checked"); 
        var dateTime = document.createElement("div");
        dateTime.classList.add("datetime"); 
        var tdColspan3 = document.createElement("td");
        tdColspan3.setAttribute("colspan", "3");
        var overview = document.createElement("p");
        var linkDetails = document.createElement("a");
        linkDetails.setAttribute("href", "#");
        linkDetails.innerHTML = "details";
        poster.setAttribute("src", moviesObject.movies[i].poster_path);
        titleMovie.innerText = moviesObject.movies[i].title + " (" + moviesObject.movies[i].release_date.substring(0, 4) + ")";
        dateTime.innerText = moviesObject.movies[i].release_date;
        overview.innerText = moviesObject.movies[i].overview + " ";

        if(i > 0) {
            row.insertBefore(colomn12xs, lastColomn12xs);
            colomn12xs.appendChild(movieTable);
        } else {
            row.appendChild(colomn12xs);
            colomn12xs.appendChild(movieTable);
        }
        
        movieTable.appendChild(trInfo);
        movieTable.appendChild(trOverview);
        trInfo.appendChild(tdCenter);
        tdCenter.appendChild(poster);
        trInfo.appendChild(tdTitle);
        tdTitle.appendChild(titleMovie);
        trInfo.appendChild(tdRating);
        tdRating.appendChild(divRatingStar);
        divRatingStar.appendChild(star1);
        divRatingStar.appendChild(star2);
        divRatingStar.appendChild(star3);
        divRatingStar.appendChild(star4);
        divRatingStar.appendChild(star5);
        tdRating.appendChild(dateTime);
        trOverview.appendChild(tdColspan3);
        tdColspan3.appendChild(overview);
        overview.appendChild(linkDetails);
    }

    var footer = document.getElementById("footer");
    footer.style.marginTop = "30px";
}
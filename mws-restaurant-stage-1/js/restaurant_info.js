let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false,
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  name.tabIndex = 2;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  address.tabIndex = 4;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.setAttribute("alt", restaurant.name);
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;
  cuisine.tabIndex = 3;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');

  for (let key in operatingHours) {
    const row = document.createElement('div');
    row.setAttribute("role", "row");

    const day = document.createElement('span');
    day.innerHTML = key + ":"
    row.appendChild(day);
    day.setAttribute("aria-label", key);
    day.setAttribute("role", "cell");
    day.setAttribute("class", "operating days");


    const time = document.createElement('span');
    time.innerHTML = operatingHours[key];
    time.setAttribute("aria-label", "hours");
    time.setAttribute("role", "cell");
    time.setAttribute("class", "operating times");

    row.appendChild(time);
    hours.appendChild(row);
  }

const allDays = document.getElementsByClassName('days');
const allTimes = document.getElementsByClassName('times');

allDays[0].tabIndex = 6;
allTimes[0].tabIndex = 7;

for (i=1; i < allDays.length; i++) {
  allDays[i].tabIndex = allDays[i - 1].tabIndex + 2;
};

for (i=1; i < allTimes.length; i++) {
  allTimes[i].tabIndex = allTimes[i - 1].tabIndex + 2;
}

}



/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');

  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
    setTabIndex();
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');

  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.setAttribute("aria-label", "reviewier's name");
  name.setAttribute("class", "names");
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = review.date;
  date.setAttribute("aria-label", "reviewed date");
  date.setAttribute("class", "dates");
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.setAttribute("aria-label", "reviewed rating");
  rating.setAttribute("class", "ratings");
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.setAttribute("aria-label", "reviewer comments");
  comments.setAttribute("class", "comments");
  li.appendChild(comments);

  return li;

}

setTabIndex = () => {
const names = document.getElementsByClassName("names");
const dates = document.getElementsByClassName("dates");
const ratings = document.getElementsByClassName("ratings");
const comments = document.getElementsByClassName("comments");


names[0].tabIndex = 30;
dates[0].tabIndex = 31;
ratings[0].tabIndex = 32;
comments[0].tabIndex = 33;

for (i=1; i < names.length; i++) {
  names[i].tabIndex = names[i - 1].tabIndex + 5;
};

for (i=1; i < dates.length; i++) {
  dates[i].tabIndex = dates[i - 1].tabIndex + 5;
};

for (i=1; i < ratings.length; i++) {
  ratings[i].tabIndex = ratings[i - 1].tabIndex + 5;
};

for (i=1; i < comments.length; i++) {
  comments[i].tabIndex = comments[i - 1].tabIndex +  5;
};
}



/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

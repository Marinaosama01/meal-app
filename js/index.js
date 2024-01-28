

let searchBar = document.getElementById('search-bar'); 
let mealsDiv = document.getElementById('meals-div'); 
let randomButton = document.getElementById('random-image'); 
let myFavoriteMeals = document.getElementById('my-favourite-meals'); 
let rowData = document.getElementById("rowData");
let searchContainer = document.getElementById("searchContainer");
let submitBtn;
let favouriteArray = []; 
let URL; 


// Check if favoriteArray exists in localStorage, otherwise initialize it
if (!localStorage.getItem("favouriteArray")) {
  localStorage.setItem("favouriteArray", JSON.stringify(favouriteArray));
} else {
  favouriteArray = JSON.parse(localStorage.getItem("favouriteArray"));
}


// Function to fetch and display more details about a meal
async function moreDetails() {
  let id = this.id;
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  let data = await response.json();

  mealsDiv.innerHTML = '';
  
  let meals = data.meals[0];

  let div = document.createElement('div');
  div.classList.add('details-page');
  div.innerHTML = `
    <h3>${meals.strMeal}</h3>
    <img src="${meals.strMealThumb}" alt="">
    <p>${meals.strInstructions}</p>
    <h5>Cuisine Type: ${meals.strArea}</h5>
    <a href="${meals.strYoutube}"><button type="button" class='border-circle more-details' id='${meals.idMeal}'>Watch Video</button></a>`;

  mealsDiv.append(div);
}



// Function to toggle favorites
function toggleFavorites(event) {
  event.preventDefault();
  let index = favouriteArray.indexOf(this.id);
  if (index == -1) {
    favouriteArray.push(this.id);
    this.classList.add('clicked');
  } else {
    favouriteArray.splice(index, 1);
    this.classList.remove('clicked');
  }

  localStorage.setItem("favouriteArray", JSON.stringify(favouriteArray));
}



// Function to fetch and create meals based on the provided URL
async function createMeals(URL) {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    mealsDiv.innerHTML = '';
    for (let meals of data.meals) {
      const div = document.createElement('div');
      div.classList.add('images');
      div.innerHTML = `
        <img src="${meals.strMealThumb}" alt="">
        <h4>${meals.strMeal}</h4>
        <button type="button" class='border-circle more-details' id='${meals.idMeal}'>More Details</button>
        ${
          favouriteArray.includes(meals.idMeal) ? `<a href="" class='favourite clicked' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>` : `<a href="" class='favourite' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`
        }`;

      mealsDiv.append(div);
    }

    var favoriteButton = document.querySelectorAll('a');
    for (let button of favoriteButton) {
      button.addEventListener('click', toggleFavorites);
    }

    var moreDetailsbutton = document.querySelectorAll('.more-details');
    for (let button of moreDetailsbutton) {
      button.addEventListener('click', moreDetails);
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to display search results based on the input value
function displaySearchResults() {
  let keyword = searchBar.value;
  URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`;
  createMeals(URL);
}

// Function to display a random meal image
function displayRandomImage() {
  URL = `https://www.themealdb.com/api/json/v1/1/random.php`;
  createMeals(URL);
}

// Function to display favorite meals
async function displayFavoriteMeals() {
  mealsDiv.innerHTML = '';

  for (let meal of favouriteArray) {
    
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`);
    let data = await response.json();

    let meals = data.meals[0];
    

    let div = document.createElement('div');
    div.classList.add('images');
    div.innerHTML = `
      <img src="${meals.strMealThumb}" alt="">
      <h4>${meals.strMeal}</h4>
      <button type="button" class='border-circle more-details' id='${meals.idMeal}'>More Details</button>
      <a href="" class='favourite clicked' id='${meals.idMeal}'><i class="fa-sharp fa-solid fa-heart"></i></a>`;

    mealsDiv.append(div);

    var favoriteButton = document.querySelectorAll('a');
    for (let button of favoriteButton) {
      button.addEventListener('click', toggleFavorites);
    }

    var moreDetailsbutton = document.querySelectorAll('.more-details');
    for (let button of moreDetailsbutton) {
      button.addEventListener('click', moreDetails);
    }
  }
}

// Event listeners
searchBar.addEventListener('input', displaySearchResults); // Search bar input event
randomButton.addEventListener('click', displayRandomImage); // Random image button click event
myFavoriteMeals.addEventListener('click', displayFavoriteMeals); // Favorite meals button click event



// ====================================================open and close nav bar===========================================

function openSideNav() {
  $(".side-nav-menu").animate({
      left: 0
  }, 500)


  $(".open-close-icon").removeClass("fa-align-justify");
  $(".open-close-icon").addClass("fa-x");


  for (let i = 0; i < 5; i++) {
      $(".links li").eq(i).animate({
          top: 0
      }, (i + 5) * 100)
  }
}

function closeSideNav() {
  let boxWidth = $(".side-nav-menu .nav-tab").outerWidth()
  $(".side-nav-menu").animate({
      left: -boxWidth
  }, 500)

  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");


  $(".links li").animate({
      top: 300
  }, 500)
}

closeSideNav()
$(".side-nav-menu i.open-close-icon").click(() => {
  if ($(".side-nav-menu").css("left") == "0px") {
      closeSideNav()
  } else {
      openSideNav()
  }
})

// ================displaying meals 

function displayMeals(meals) {
  let cartoona = "";

  for (let i = 0; i < meals.length; i++) {
      cartoona += `
      <div class="col-md-3">
              <div onclick="getMealDetails('${meals[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                  <img class="w-100" src="${meals[i].strMealThumb}" alt="" srcset="">
                  <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                      <h3>${meals[i].strMeal}</h3>
                  </div>
              </div>
      </div>
      `
  }

  rowData.innerHTML = cartoona
}



async function getCategories() {
  rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)
  searchContainer.innerHTML = "";

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
  response = await response.json()

  displayCategories(response.categories)
  $(".inner-loading-screen").fadeOut(300)

}

function displayCategories(meals) {
  let cartoona = "";

  for (let i = 0; i < meals.length; i++) {
      cartoona += `
      <div class="col-md-3">
              <div onclick="getCategoryMeals('${meals[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                  <img class="w-100" src="${meals[i].strCategoryThumb}" alt="" srcset="">
                  <div class="meal-layer position-absolute text-center text-black p-2">
                      <h3>${meals[i].strCategory}</h3>
                      <p>${meals[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                  </div>
              </div>
      </div>
      `
  }

  rowData.innerHTML = cartoona
}


async function getArea() {
  rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)

  searchContainer.innerHTML = "";

  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
  respone = await respone.json()
  console.log(respone.meals);

  displayArea(respone.meals)
  $(".inner-loading-screen").fadeOut(300)

}


function displayArea(arr) {
  let cartoona = "";

  for (let i = 0; i < arr.length; i++) {
      cartoona += `
      <div class="col-md-3">
              <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                      <i class="fa-solid fa-house-laptop fa-4x"></i>
                      <h3>${arr[i].strArea}</h3>
              </div>
      </div>
      `
  }

  rowData.innerHTML = cartoona
}







async function getCategoryMeals(category) {
  rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
  response = await response.json()


  displayMeals(response.meals.slice(0, 20))
  $(".inner-loading-screen").fadeOut(300)

}



async function getAreaMeals(area) {
  rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
  response = await response.json()


  displayMeals(response.meals.slice(0, 20))
  $(".inner-loading-screen").fadeOut(300)

}



async function getIngredients() {
  rowData.innerHTML = ""
  searchContainer.innerHTML = "";
  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
  respone = await respone.json()
  console.log(respone.meals);

  displayIngredients(respone.meals.slice(0, 20))
 
}


function displayIngredients(arr) {
  let cartoona = "";

  for (let i = 0; i < arr.length; i++) {
      cartoona += `
      <div class="col-md-3">
              <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                      <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                      <h3>${arr[i].strIngredient}</h3>
                      <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
              </div>
      </div>
      `
  }

  rowData.innerHTML = cartoona
}
async function getIngredientsMeals(ingredients) {
  rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
  response = await response.json()


  displayMeals(response.meals.slice(0, 20))


}

async function getMealDetails(mealID) {
  closeSideNav()
  rowData.innerHTML = ""
  $(".inner-loading-screen").fadeIn(300)

  searchContainer.innerHTML = "";
  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  respone = await respone.json();

  displayMealDetails(respone.meals[0])
  $(".inner-loading-screen").fadeOut(300)

}


//========================contact us form ===========


function Contacts() {
  rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
  <div class="container w-75 text-center">
      <div class="row g-4">
          <div class="col-md-6">
              <input id="nInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Special characters and numbers not allowed
              </div>
          </div>
          <div class="col-md-6">
              <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
              <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Email not valid *exemple@yyy.zzz
              </div>
          </div>
          <div class="col-md-6">
              <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
              <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid Phone Number
              </div>
          </div>
          <div class="col-md-6">
              <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
              <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid age
              </div>
          </div>
          <div class="col-md-6">
              <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid password *Minimum eight characters, at least one letter and one number:*
              </div>
          </div>
          <div class="col-md-6">
              <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
              <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid repassword 
              </div>
          </div>
      </div>
      <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
  </div>
</div> `
  submitBtn = document.getElementById("submitBtn")


  document.getElementById("nInput").addEventListener("focus", () => {
      nameTouch = true
  })

  document.getElementById("emailInput").addEventListener("focus", () => {
      emailTouch = true
  })

  document.getElementById("phoneInput").addEventListener("focus", () => {
      phoneTouch = true
  })

  document.getElementById("ageInput").addEventListener("focus", () => {
      ageTouch = true
  })

  document.getElementById("passwordInput").addEventListener("focus", () => {
      passwordTouch = true
  })

  document.getElementById("repasswordInput").addEventListener("focus", () => {
      repasswordTouch = true
  })
}


function inputsValidation() {
  if (nameTouch) {
      if (nameValidation()) {
          document.getElementById("nameAlert").classList.replace("d-block", "d-none")

      } else {
          document.getElementById("nameAlert").classList.replace("d-none", "d-block")

      }
  }
  if (emailTouch) {

      if (emailValidation()) {
          document.getElementById("emailAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("emailAlert").classList.replace("d-none", "d-block")

      }
  }

  if (phoneTouch) {
      if (phoneValidation()) {
          document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

      }
  }

  if (ageTouch) {
      if (ageValidation()) {
          document.getElementById("ageAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("ageAlert").classList.replace("d-none", "d-block")

      }
  }

  if (passwordTouch) {
      if (passwordValidation()) {
          document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

      }
  }
  if (repasswordTouch) {
      if (repasswordValidation()) {
          document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

      }
  }


}

function nameValidation() {
  return (/^[a-zA-Z ]+$/.test(document.getElementById("nInput").value))
}

function emailValidation() {
  return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
  return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
  return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
  return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
  return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}
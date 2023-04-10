const addProductNav = document.querySelector("#addProduct");
const wishListCount = document.querySelector(".wishListCount");

let productItemDiv = document.getElementsByClassName("product-item")[0];
// Check Is Login
let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

if (isLoggedIn) {
  var usersData = JSON.parse(localStorage.getItem("userData"));
  var loginUser = JSON.parse(localStorage.getItem("user"));
  var loginUserData = usersData[loginUser["email"]];
  var getProduct = loginUserData;
  var favouriteProducts = localStorage.getItem("favouriteProducts") || [];
  if (favouriteProducts.length === 0) {
    favouriteProducts = [];
  } else {
    favouriteProducts = JSON.parse(favouriteProducts);
  }
  wishListCount.textContent = favouriteProducts.length;
} else {
  getProduct = JSON.parse(localStorage.getItem("product")) || [];
}

// login - logout
const login = document.getElementsByClassName("login")[0];
const logout = document.getElementsByClassName("logout")[0];
const loginBtn = document.querySelector(".loginBtn");
const emailId = document.querySelector(".emailId");
const password = document.querySelector(".password");

loginBtn.addEventListener("click", () => {
  let emailVal = emailId.value;
  let passwordVal = password.value;

  const user = {
    email: emailVal,
    password: passwordVal,
  };

  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("isLoggedIn", true);

  let url = window.location.href;
  let urlValSplit = url.split("/");
  urlValSplit.splice(3, 1, "index.html");
  window.location = urlValSplit.join("/");
});

logout.addEventListener("click", () => {
  localStorage.setItem("isLoggedIn", false);
  localStorage.setItem("user", "");

  location.reload();
});

// Check LoggedIn
if (isLoggedIn) {
  login.style.display = "none";
  logout.style.display = "block";
  addProductNav.style.display = "block";
} else {
  login.style.display = "block";
  logout.style.display = "none";
  addProductNav.style.display = "none";

  let url = window.location.href;
  let urlValSplit = url.split("/");
  urlValSplit.splice(3, 1, "product.html");
  window.location.href = urlValSplit.join("/");
}

// add Product
function addProduct(product) {
  let desc =
    product.productDesc.slice(0, 60) +
    (product.productDesc.length > 60 ? "..." : "");
  let name =
    product.productName.slice(0, 60) +
    (product.productName.length > 60 ? "..." : "");
  let divElm = document.createElement("div");

  divElm.classList.add("card", "mb-3", "mx-2");
  divElm.style.width = "18rem";

  divElm.innerHTML += `<div class="cardImage">
                              <img src=${
                                product.productImage
                              } class="card-img-top object-fit-cover" alt=${
    product.productName
  }>
                            </div>
                          <div class="card-body">
                              <h6 class="card-title">${name}</h6>
                              <div class="d-flex w-100 opacity-75 ">
                                <p class="card-text flex-grow-1">ID : ${
                                  product.productId
                                }</p>
                                <p class="card-text">Price : ${
                                  product.productPrice
                                }₹</p>
                              </div>
                                <p class="card-text opacity-75 fs-6 productDesc ${
                                  isLoggedIn ? "" : "h-25"
                                }">${desc}</p>
                              <div class="buyNow"> 
                                  <a class="btn btn-primary mx-1 editBtnFavourite" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editBtn(${
                                    product.productId
                                  })">Buy Now</a>
                                  <a class="btn btn-danger mx-1 deleteBtnFavourite" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="removeFavourite(${
                                    product.productId
                                  })">Remove</a>
                                  </div>
                          </div>`;

  productItemDiv.appendChild(divElm);
}

if (favouriteProducts.length === 0) {
  productItemDiv.innerHTML = `<div class="w-100 text-center">
    <img src="assets/empty-cart.webp" class="emptyCartImage">
    <h3 class="text-center w-100 favouriteh3"> Favourite Product List is Empty!</h3>
    <p class="favouritePara">Please add your favourite product.</p>
    <a href="/product.html" class="btn btn-primary">Return to shop</a>
    </div>`;
} else {
  // Product Load
  function loadContent() {
    productItemDiv.innerHTML = "";
    favouriteProducts.forEach((product) => {
      addProduct(product);
    });
  }
  document.addEventListener("load", loadContent());
}

// Remove Favourite
function removeFavourite(id) {
  let index = getProduct.findIndex((product) => product.productId == id);
  getProduct[index]["isFavourite"] = false;
  usersData[loginUser["email"]] = getProduct;

  let newFavourite = favouriteProducts.filter(
    (product) => product.productId != id
  );

  localStorage.setItem("userData", JSON.stringify(usersData));
  localStorage.setItem("favouriteProducts", JSON.stringify(newFavourite));

  loadContent();
  location.reload();
}

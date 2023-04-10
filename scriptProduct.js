let productItemDiv = document.getElementsByClassName("product-item")[0];
let addEditProduct = document.querySelector(".addEditProduct");
let alertBox = document.querySelector(".alertBox");

const addProductNav = document.querySelector("#addProduct");
const sortBy = document.querySelector("#sortBy");
const ascDescOrder = document.querySelector("#ascDescOrder");
const wishListCount = document.querySelector(".wishListCount");
const wishList = document.querySelector(".wishList");

// Check Is Login
let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
var getProduct;
if (isLoggedIn) {
  var usersData = JSON.parse(localStorage.getItem("userData"));
  var loginUser = JSON.parse(localStorage.getItem("user"));
  var loginUserData = usersData[loginUser["email"]];
  getProduct = loginUserData;
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
                            } class="card-img-top" alt=${product.productName}>
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
                            <div class="editDeleteBtn ${
                              isLoggedIn ? "d-block" : "d-none"
                            }"> 
                                <a class="btn btn-primary mx-1 editBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editBtn(${
                                  product.productId
                                })">Edit</a>
                                <a class="btn btn-primary mx-1 bg-danger border-0" onclick="deleteBtn(${
                                  product.productId
                                })">Delete</a>
                                <div class="isFavourite">${
                                  product.isFavourite
                                    ? `<img id="favouriteImage" src="assets/favourite.png" alt="favourite" onclick="removeFavourite(${product.productId})">`
                                    : `<img id="starImage" src="assets/star.png" alt="star" onclick="addFavourite(${product.productId})">`
                                }</div>
                                </div>
                        </div>`;

  productItemDiv.appendChild(divElm);
}

// Add Favourite
function addFavourite(id) {
  let index = getProduct.findIndex((product) => product.productId == id);
  let addFavouriteProduct = getProduct[index];
  getProduct[index]["isFavourite"] = true;
  usersData[loginUser["email"]] = getProduct;
  favouriteProducts.push(addFavouriteProduct);
  localStorage.setItem("favouriteProducts", JSON.stringify(favouriteProducts));
  localStorage.setItem("userData", JSON.stringify(usersData));
  loadContent();
  location.reload();
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

// Sort Product
function sortProduct(value) {
  let sortValue = sortBy.value;
  let orderValue = ascDescOrder.value;
  console.log(orderValue);

  if (sortValue) {
    if (sortValue === "productName") {
      getProduct.sort((a, b) => a.productName.localeCompare(b.productName));
      loadContent();
    }
    getProduct.sort((a, b) => a[sortValue] - b[sortValue]);
    loadContent();
  }

  if (orderValue == "asc") {
    getProduct.sort((a, b) => a[sortValue] - b[sortValue]);
    loadContent();
  }
  if (orderValue == "desc") {
    if (sortValue === "productName") {
      getProduct.sort((a, b) => b.productName.localeCompare(a.productName));
      loadContent();
    }
    getProduct.sort((a, b) => b[sortValue] - a[sortValue]);
    loadContent();
  }
}

sortBy.addEventListener("change", () => {
  sortProduct();
});

ascDescOrder.addEventListener("change", () => {
  sortProduct();
});

// Notification Alert
function notification(content, type, icon) {
  alertBox.style.top = "4%";
  alertBox.innerHTML = "";
  alertBox.innerHTML = `<div class="alert alert-${type} shadow-lg" role="alert"><i class="bi ${icon}"></i> ${content}</div>`;
  setTimeout(() => {
    alertBox.style.top = "-9%";
  }, 3000);
}

// Search Product
searchInput.addEventListener("input", (e) => {
  let search = e.target.value;
  let searchProduct = [];

  for (i = 0; i < getProduct.length; i++) {
    // console.log(getProduct[i].productName.toLowerCase().includes(search.toLowerCase()));
    if (
      getProduct[i].productName.toLowerCase().includes(search.toLowerCase())
    ) {
      searchProduct.push(getProduct[i]);
    }
  }

  productItemDiv.innerHTML = "";
  for (let index = 0; index < searchProduct.length; index++) {
    addProduct(searchProduct[index]);
  }
});

searchInput.addEventListener("focus", () => {
  let current_btn = document.querySelector(".pagenumbers");
  current_btn.style.display = "none";
});

searchInput.addEventListener("focusout", () => {
  let current_btn = document.querySelector(".pagenumbers");
  current_btn.style.display = "block";
});

// Product Load
function loadContent() {
  productItemDiv.innerHTML = "";
  getProduct.forEach((product) => {
    addProduct(product);
  });
}
document.addEventListener("load", loadContent());

// Edit Button
function editBtn(id) {
  // console.log(getProduct);
  let data = getProduct.filter((product) => {
    return product.productId == id;
  });
  // let oldData = data[0]
  let {
    productId: pid,
    productName: pname,
    productPrice: price,
    productDesc: pdesc,
    productImage: pimage,
  } = data[0];

  productIdModal.value = pid;
  productNameModal.value = pname;
  productPriceModal.value = price;
  productDescModal.value = pdesc;
  imageShowModal.src = pimage;

  // Edit Product Button
  addEditProduct.addEventListener("click", () => {
    // console.log("clicked");
    let newData = {
      productId: productIdModal.value,
      productName: productNameModal.value,
      productPrice: productPriceModal.value,
      productDesc: productDescModal.value,
      productImage: imageShowModal.src,
    };
    // console.log(newData.productId);

    let index = getProduct.findIndex(
      (product) => product.productId === newData.productId
    );
    // index = newData;
    // console.log(getProduct[index]);

    getProduct[index].productId = newData.productId;
    getProduct[index].productName = newData.productName;
    getProduct[index].productPrice = newData.productPrice;
    getProduct[index].productDesc = newData.productDesc;
    getProduct[index].productImage = newData.productImage;

    localStorage.setItem("product", JSON.stringify(getProduct));

    notification(
      "Product Updated Successfully",
      "success",
      "bi-arrow-clockwise"
    );

    loadContent();
  });
}

// Delete Button
async function deleteBtn(id) {
  let product = getProduct.filter((product) => product.productId != id);

  const isDelete = await swal({
    title: "Are You Sure?",
    text: "Do you want to delete this item!",
    icon: "error",
    buttons: ["Cancel", "Delete!"],
    dangerMode: true,
  });

  if (isDelete) {
    getProduct = [];
    getProduct = getProduct.concat(product);
    usersData[loginUser["email"]] = getProduct;
    localStorage.setItem("userData", JSON.stringify(usersData));
    notification("Product Deleted Successfully", "danger", "bi-trash3-fill");
    loadContent();
    location.reload();
  }
}

// pagination
const pagination_element = document.getElementById("pagination");

let current_page = 1;
let rows = 8;

function DisplayList(items, wrapper, rows_per_page, page) {
  wrapper.innerHTML = "";
  page--;

  let start = rows_per_page * page;
  let end = start + rows_per_page;
  let paginatedItems = items.slice(start, end);
  for (let i = 0; i < paginatedItems.length; i++) {
    let item = paginatedItems[i];
    addProduct(item);
  }
}

function SetUpPagination(items, wrapper, rows_per_page) {
  wrapper.innerHTML = "";

  let page_count = Math.ceil(items.length / rows_per_page);

  for (let i = 1; i < page_count + 1; i++) {
    let btn = PaginationButton(i, items);
    wrapper.appendChild(btn);
  }
}

function PaginationButton(page, items) {
  let button = document.createElement("button");
  button.innerText = page;

  if (current_page == page) button.classList.add("active");

  button.addEventListener("click", () => {
    current_page = page;

    DisplayList(items, productItemDiv, rows, current_page);

    let current_btn = document.querySelector(".pagenumbers button.active");
    current_btn.classList.remove("active");

    button.classList.add("active");
  });

  return button;
}

DisplayList(getProduct, productItemDiv, rows, current_page);
SetUpPagination(getProduct, pagination_element, rows);

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
  localStorage.setItem("favouriteProducts", []);

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
  wishList.style.display = "none";
}

const productForm = document.getElementById("productForm");
const productItemDiv = document.getElementsByClassName("product-item")[0];
const btnSubmit = document.querySelector(".btnSubmit");
const input = document.querySelectorAll("input");
const alertBox = document.querySelector(".alertBox");
const imageShow = document.querySelector("#imageShow");
const addEditProduct = document.querySelector(".addEditProduct");
const searchInput = document.querySelector("#searchInput");
const addProductNav = document.querySelector("#addProduct");

const productId = document.getElementById("productId");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productDesc = document.getElementById("productDesc");

const image = document.getElementById("image");
const productIdModal = document.getElementById("productIdModal");
const productNameModal = document.getElementById("productNameModal");
const productPriceModal = document.getElementById("productPriceModal");
const productDescModal = document.getElementById("productDescModal");
const imageModal = document.getElementById("imageModal");
const imageShowModal = document.querySelector("#imageShowModal");

imageShow.src = "assets/default.jpg";

const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

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
} else {
  getProduct = JSON.parse(localStorage.getItem("product")) || [];
}
let inputImg;
function handleFileSelect(evt) {
  var files = evt.target.files;
  for (var i = 0, f; (f = files[i]); i++) {
    if (!f.type.match("image.*")) {
      continue;
    }
    var reader = new FileReader();
    reader.onload = (function (theFile) {
      return function (e) {
        imageShow.src = e.target.result;
        inputImg = e.target.result;
      };
    })(f);
    reader.readAsDataURL(f);
  }
}
document
  .getElementById("image")
  .addEventListener("change", handleFileSelect, false);

let inputImgModal;
function handleFileSelectModal(evt) {
  var files = evt.target.files;
  for (var i = 0, f; (f = files[i]); i++) {
    if (!f.type.match("image.*")) {
      continue;
    }
    var reader = new FileReader();
    reader.onload = (function (theFile) {
      return function (e) {
        imageShowModal.src = e.target.result;
        inputImgModal = e.target.result;
      };
    })(f);
    reader.readAsDataURL(f);
  }
}
document
  .getElementById("imageModal")
  .addEventListener("change", handleFileSelectModal, false);

// Notification Alert
function notification(content, type, icon) {
  alertBox.style.top = "4%";
  alertBox.innerHTML = "";
  alertBox.innerHTML = `<div class="alert alert-${type} shadow-lg" role="alert"><i class="bi ${icon}"></i> ${content}</div>`;
  setTimeout(() => {
    alertBox.style.top = "-9%";
  }, 3000);
}

// Edit Button
function editBtn(id) {
  let data = getProduct.filter((product) => {
    return product.productId == id;
  });
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
    let newData = {
      productId: productIdModal.value,
      productName: productNameModal.value,
      productPrice: productPriceModal.value,
      productDesc: productDescModal.value,
      productImage: imageShowModal.src,
    };

    let index = getProduct.findIndex(
      (product) => product.productId === newData.productId
    );

    getProduct[index].productId = newData.productId;
    getProduct[index].productName = newData.productName;
    getProduct[index].productPrice = newData.productPrice;
    getProduct[index].productDesc = newData.productDesc;
    getProduct[index].productImage = newData.productImage;

    localStorage.setItem("userData", JSON.stringify(usersData));

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
    title: "Delete!",
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
  }
}

// add Product
function addProduct(product) {
  let desc =
    product.productDesc.slice(0, 60) +
    (product.productDesc.length > 60 ? "..." : "");
  console.log(desc);
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
                            <h6 class="card-title">${product.productName}</h6>
                            <div class="d-flex w-100 opacity-75 ">
                              <p class="card-text flex-grow-1">ID : ${
                                product.productId
                              }</p>
                              <p class="card-text">Price : ${
                                product.productPrice
                              }₹</p>
                            </div>
                              <p class="card-text opacity-75 fs-6 productDesc">${desc}</p>
                            <div class="editDeleteBtn ${
                              isLoggedIn ? "d-block" : "d-none"
                            }">
                                <a class="btn btn-primary mx-1 editBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editBtn(${
                                  product.productId
                                })">Edit</a>
                                <a class="btn btn-primary mx-1 bg-danger border-0" onclick="deleteBtn(${
                                  product.productId
                                })">Delete</a>
                            </div>
                        </div>`;

  productItemDiv.prepend(divElm);

  loadContent();
}

// Product Load
function loadContent() {
  productItemDiv.innerHTML = "";
  let lastItems = getProduct.slice(-4);

  lastItems.forEach((product) => {
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
                            <p class="card-text opacity-75 fs-6 productDesc">${desc}</p>
                          <div class="editDeleteBtn ${
                            isLoggedIn ? "d-block" : "d-none"
                          }">
                              <a class="btn btn-primary mx-1 editBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editBtn(${
                                product.productId
                              })">Edit</a>
                              <a class="btn btn-primary mx-1 bg-danger border-0" onclick="deleteBtn(${
                                product.productId
                              })">Delete</a>
                          </div>
                      </div>`;

    productItemDiv.prepend(divElm);
  });
}
document.addEventListener("load", loadContent());

// Product Form Submit
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let product = {
    productId: productId.value,
    productName: productName.value,
    productPrice: productPrice.value,
    productDesc: productDesc.value,
    productImage: inputImg ? inputImg : "/assets/default.jpg",
  };

  let findProduct = getProduct.filter(
    (productItem) => productItem.productId === product.productId
  );

  if (findProduct[0]) {
    const isUpdated = await swal({
      title: "Product Id already exist!",
      text: "Should you update that product!",
      icon: "warning",
      buttons: true,
    });

    if (isUpdated) {
      let index = getProduct.findIndex(
        (productItem) => productItem.productId === productId.value
      );
      console.log("updated index", index);
      getProduct[index].productId = productId.value;
      getProduct[index].productName = productName.value;
      getProduct[index].productPrice = productPrice.value;
      getProduct[index].productDesc = productDesc.value;
      getProduct[index].productImage = inputImg
        ? inputImg
        : "/assets/default.jpg";

      localStorage.setItem("userData", JSON.stringify(usersData));
      loadContent();
      swal("Your Product is Updated!", {
        icon: "success",
      });
    } else {
      swal("Your Product is not yet updated!");
    }

    productId.value = "";
    productName.value = "";
    productPrice.value = "";
    productDesc.value = "";
    image.value = "";
    imageShow.src = "/assets/default.jpg";
  } else {
    console.log("Not in Array");
    console.log("Added ", product);
    getProduct.push(product);
    localStorage.setItem("userData", JSON.stringify(usersData));

    addProduct(product);

    productId.value = "";
    productName.value = "";
    productPrice.value = "";
    productDesc.value = "";
    image.value = "";
    imageShow.src = "/assets/default.jpg";

    notification("Product Add Successfully", "success", "bi-database-fill-add");
  }
});

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

  location.reload();
});

logout.addEventListener("click", () => {
  localStorage.setItem("isLoggedIn", false);
  localStorage.setItem("user", "");

  location.reload();
});

// Check Is Login
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

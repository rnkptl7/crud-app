// console.log("Hello");
let productForm = document.getElementById("productForm");
let productItemDiv = document.getElementsByClassName("product-item")[0];
let btnSubmit = document.querySelector(".btnSubmit");
let input = document.querySelectorAll("input");
let alertBox = document.querySelector(".alertBox");
let imageShow = document.querySelector("#imageShow");
let addEditProduct = document.querySelector(".addEditProduct");
let searchInput = document.querySelector("#searchInput");
// console.log(searchInput);

let productId = document.getElementById("productId");
let productName = document.getElementById("productName");
let productPrice = document.getElementById("productPrice");
let productDesc = document.getElementById("productDesc");
let image = document.getElementById("image");

let productIdModal = document.getElementById("productIdModal");
let productNameModal = document.getElementById("productNameModal");
let productPriceModal = document.getElementById("productPriceModal");
let productDescModal = document.getElementById("productDescModal");
let imageModal = document.getElementById("imageModal");
let imageShowModal = document.querySelector("#imageShowModal");


let inputImg;
function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function (theFile) {
        return function (e) {
            console.log(e.target.result);
            imageShow.src = e.target.result;
            inputImg = e.target.result;
          };
      })(f);
      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
}
document.getElementById('image').addEventListener('change', handleFileSelect, false);

let inputImgModal
function handleFileSelectModal(evt) {
  var files = evt.target.files; // FileList object
    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function (theFile) {
        return function (e) {
            imageShowModal.src = e.target.result;
            inputImgModal = e.target.result;
          };
      })(f);
      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
}
document.getElementById('imageModal').addEventListener('change', handleFileSelectModal, false);

// Notification Alert
function notification(content, type) {
  alertBox.style.top = "6%";
    alertBox.innerHTML = "";
    alertBox.innerHTML = `<div class="alert alert-${type} shadow-lg" role="alert">${content} <i class="bi bi-x-lg"></i></div>`;
    setTimeout(() => {
      alertBox.style.top = "-6%";
  }, 3000)
}

var getProduct = JSON.parse(localStorage.getItem('product')) || [];
// console.log(getProduct);

// Edit Button
function editBtn(id) {
  // console.log(getProduct);
  let data = getProduct.filter((product) => { return product.productId == id })
  // let oldData = data[0]
  let { productId:pid, productName:pname, productPrice:price, productDesc:pdesc, productImage:pimage } = data[0];
  
  productIdModal.value = pid;
  productNameModal.value = pname;
  productPriceModal.value = price
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
      productImage: imageShowModal.src
    }
    // console.log(newData.productId);

    let index = getProduct.findIndex(product => product.productId === newData.productId);
    // index = newData;
    // console.log(getProduct[index]);

    getProduct[index].productId = newData.productId;
    getProduct[index].productName = newData.productName;
    getProduct[index].productPrice = newData.productPrice;
    getProduct[index].productDesc = newData.productDesc;
    getProduct[index].productImage = newData.productImage;

    localStorage.setItem('product', JSON.stringify(getProduct));

    notification("Product Updated Successfully", "success");

    loadContent();
  })
}

// Delete Button
function deleteBtn(id) {
  // console.log(getProduct);
  let product = getProduct.filter(product => product.productId != id);
  // delete getProduct[index];
  getProduct = [];
  getProduct = getProduct.concat(product)
  // console.log(getProduct);
  localStorage.setItem('product', JSON.stringify(getProduct));
  notification("Product Deleted Successfully", "danger")
  loadContent();
}

// add Product
function addProduct(product) {
  // console.log(product);
    let divElm = document.createElement("div");
    divElm.classList.add("card", "mb-3", "mx-2");
    divElm.style.width = "18rem";

    divElm.innerHTML += `<div class="h-50">
                          <img src=${product.productImage} class="card-img-top h-100 object-fit-cover" alt=${product.productName}>
                        </div>
                      <div class="card-body">
                          <h5 class="card-title">${product.productName}</h5>
                          <div class="d-flex w-75 opacity-75">
                            <p class="card-text flex-grow-1">ID : ${product.productId}</p>
                            <p class="card-text">Price : ${product.productPrice}₹</p>
                          </div>
                            <p class="card-text opacity-75">${product.productDesc}</p>
                          <div class="d-flex">
                              <a class="btn btn-primary mx-1 editBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="editBtn(${product.productId})">Edit</a>
                              <a class="btn btn-primary mx-1 bg-danger border-0" onclick="deleteBtn(${product.productId})">Delete</a>
                          </div>
                      </div>`;
                      
  productItemDiv.appendChild(divElm);
}

  // let editBtns = document.querySelectorAll(".editBtn");
  // editBtns.forEach((btn) => {
  //   btn.addEventListener("click", (product) => {
  //     console.log(product.target.value);
  // })
  // })


// Search Product
searchInput.addEventListener("input", (e) => {
  let search = e.target.value;
  let searchProduct = [];

  for (i = 0; i < getProduct.length; i++){
    // console.log(getProduct[i].productName.toLowerCase().includes(search.toLowerCase()));
    if (getProduct[i].productName.toLowerCase().includes(search.toLowerCase())) {
      searchProduct.push(getProduct[i])
    }
  }

  productItemDiv.innerHTML = "";
  for (let index = 0; index < searchProduct.length; index++) {
    addProduct(searchProduct[index]);
  }
})


// Product Load
function loadContent() {
  // console.log("load");
  // console.log(getProduct.length === 0);
    productItemDiv.innerHTML = "";
    getProduct.forEach(product => {
      addProduct(product);
    });
}                      
document.addEventListener("load", loadContent());

// Product Form Submit
productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Submit");

    let product = {
        productId: productId.value,
        productName: productName.value,
        productPrice: productPrice.value,
        productDesc: productDesc.value,
        productImage: inputImg
    }

    getProduct.push(product);
    localStorage.setItem('product', JSON.stringify(getProduct));
    // console.log(product.image);
  
    addProduct(product);

    productId.value = ""
    productName.value = ""
    productPrice.value = ""
    productDesc.value = ""
    image.value = ""
    imageShow.src = ""
    
    notification("Product Add Successfully", "success")
})


                          
// function s() {
//   console.log("click"); 
//   // Button Disabled
//   if (input[0] == "") {
//     btnSubmit.disabled=true;
//   } else {
//     btnSubmit.disabled=false;
//   }
// }

// function clickFun(id) {
//   console.log("asfkhifub", id);
// }

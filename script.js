// console.log("Hello");
let productForm = document.getElementById("productForm");
let productItemDiv = document.getElementsByClassName("product-item")[0];

let productId = document.getElementById("productId");
let productName = document.getElementById("productName");
let productPrice = document.getElementById("productPrice");
let productDesc = document.getElementById("productDesc");
let image = document.getElementById("image");
// console.log(productItemDiv);

// let existingEntries = JSON.parse(localStorage.getItem("product"))||[];
// console.log(existingEntries);

productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Submit");
    // let productArray = [];
    // console.log(productId.value, productName.value, productPrice.value, productDesc.value);

   var getProduct =  JSON.parse(localStorage.getItem('product')) || [];

    let product = {
        productId: productId.value,
        productName: productName.value,
        productPrice: productPrice.value,
        productDesc : productDesc.value
    }

    // abc = [get];

    getProduct.push(product);

   localStorage.setItem('product', JSON.stringify(getProduct));

//    console.log(JSON.stringify(abc));
   console.log(getProduct);

    // productArray.push(JSON.stringify(product));


    // localStorage.setItem("product", JSON.stringify(existingEntries));
})

// console.log(existingEntries);
const cl=console.log;

const productForm = document.getElementById('productForm')
const titleControl = document.getElementById('titleControl')
const priceControl = document.getElementById('priceControl')
const brandControl = document.getElementById('brandControl')
const categoryControl = document.getElementById('categoryControl')
const addproductbtn = document.getElementById('addproductbtn')
const updateproductbtn = document.getElementById('updateproductbtn')
const productContainer = document.getElementById('productContainer')
const spinner = document.getElementById('spinner')

const BASE_URL = `https://crud-6b7ce-default-rtdb.firebaseio.com`
const PRODUCT_URL = `${BASE_URL}/products.json`;

function snackbar(msg,icon){
    Swal .fire({
        title:msg,
        icon:icon,
        timer:3000
    })
}

function showSpinner(){
    spinner.classList.remove('d-none')
}
function hideSpinner(){
    spinner.classList.add('d-none')
}

const state={
    productArr:[],
    editId:null,
}

//read

function oncreateproductList(arr){
    let result = ``;
    arr.forEach((ele)=>{
        result +=` <tr id="${ele.id}">
                            <td>${ele.brand}</td>
                            <td>${ele.category}</td>
                            <td>${ele.price}</td>
                            <td>${ele.title}</td>
                            <td onclick="editProduct(this)" class="text-center">
                                <button class="btn btn-sm text-info" role="button">Edit</button>
                            </td>
                            <td onclick="deleteProduct(this)" class="text-center">
                              <button class="btn btn-sm text-danger" role="button">Delete</button>
                            </td>
                        </tr>`

            productContainer.innerHTML = result;
    })
    
}

function fetchProduct(){
    showSpinner()
    let xhr = new XMLHttpRequest()
    xhr.open("GET", PRODUCT_URL)
    xhr.send(null)
    xhr.onload = function(){
        if(xhr.status === 200){
            let res = JSON.parse(xhr.response)
            hideSpinner()
            for(const key in res){
                res[key].id = key
                state.productArr.push(res[key])
            }
            oncreateproductList(state.productArr)
        }
    }
}
fetchProduct()

//create

function onAddproduct(eve){
    eve.preventDefault()
    showSpinner()
    let productObj={
        brand:brandControl.value,
        category:categoryControl.value,
        price:priceControl.value,
        title:titleControl.value,
    }
    let xhr = new XMLHttpRequest()
    xhr.open("POST", PRODUCT_URL)
    xhr.send(JSON.stringify(productObj))
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)
            productObj.id = res.name;
            let tr = document.createElement('tr')
            tr.id = productObj.id;
            tr.innerHTML = `<td>${productObj.brand}</td>
                            <td>${productObj.category}</td>
                            <td>${productObj.price}</td>
                            <td>${productObj.title}</td>
                            <td onclick="editProduct(this)" class="text-center">
                                <button class="btn btn-sm text-info" role="button">Edit</button>
                            </td>
                            <td onclick="deleteProduct(this)" class="text-center">
                              <button class="btn btn-sm text-danger" role="button">Delete</button>
                            </td>
                        </tr>`

                        productForm.reset()
                        productContainer.append(tr)
        }else{
            snackbar(`something went wrong !!!`)
        }
        hideSpinner()
    }
    xhr.onerror =  function(){
        hideSpinner()
    }
}

//delete

function deleteProduct(ele){
    let remove_Id = ele.closest('tr').id;
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed){
    showSpinner()
    let REMOVE_URL = `${BASE_URL}/products/${remove_Id}.json`
    let xhr = new XMLHttpRequest()
    xhr.open("DELETE", REMOVE_URL)
    xhr.send(null)
    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)
            ele.closest('tr').remove()
        }
        hideSpinner()
    }
  }
});
xhr.onerror = function(){
    hideSpinner()
}
}

//edit 

function editProduct(ele){
    let editId = ele.closest('tr').id;
    state.editId = editId;
    let EDIT_URL = `${BASE_URL}/products/${editId}.json`;
    showSpinner()
    let xhr = new XMLHttpRequest()
    xhr.open("GET", EDIT_URL)
    xhr.send(null)
    xhr.onload = function(){
        hideSpinner()
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)
           brandControl.value = res.brand;
           categoryControl.value = res.category;
           priceControl.value = res.price;
           titleControl.value = res.title;
            addproductbtn.classList.add('d-none')
            updateproductbtn.classList.remove('d-none')
        }
    }
    xhr.onerror = function(){
        hideSpinner()
    }
}

function onUpdateproduct(){
    let updateId = state.editId;
    let UPDATE_URL = `${BASE_URL}/products/${updateId}.json`;
    let updateObj={
        brand:brandControl.value,
        category:categoryControl.value,
        price:priceControl.value,
        title:titleControl.value,
    }
    showSpinner()
    let xhr = new XMLHttpRequest()
    xhr.open("PATCH", UPDATE_URL)
    xhr.send(JSON.stringify(updateObj))
    xhr.onload = function(){
        hideSpinner()
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response);
            cl(res)
            let getIndex = state.productArr.findIndex(h=>h.id === updateId)
            state.productArr[getIndex]=updateObj
            let tr = document.getElementById(updateId)
            cl(tr)
            tr.innerHTML = `<td>${updateObj.brand}</td>
                            <td>${updateObj.category}</td>
                            <td>${updateObj.price}</td>
                            <td>${updateObj.title}</td>
                            <td onclick="editProduct(this)" class="text-center">
                                <button class="btn btn-sm text-info" role="button">Edit</button>
                            </td>
                            <td onclick="deleteProduct(this)" class="text-center">
                                <button class="btn btn-sm text-danger" role="button">Delete</button>
                            </td>`
            productForm.reset()
            state.editId = null;
            addproductbtn.classList.remove('d-none')
           updateproductbtn.classList.add('d-none')
        }
    }
    xhr.onerror = function(){
        hideSpinner()
    }
}


productForm.addEventListener('submit', onAddproduct)
 updateproductbtn.addEventListener('click',onUpdateproduct)

function $(query) { return Array.from(document.querySelectorAll(query)); }


let products = localStorage.bzProducts ? JSON.parse(localStorage.bzProducts) : [];

let editMode = "create"
let temp; // we use this variable for access too update chain


let total = $("#total")[0];



//* calculate the total
$("#inputs > div input").forEach(function (inp) {

    inp.addEventListener("input", function () {
        total.textContent = +$("#price")[0].value + +$("#taxes")[0].value - ( +$("#discount")[0].value + +$("#ads")[0].value );
        if (+total.textContent > 0){
            total.parentNode.classList.add("success");
        } else {
            total.parentNode.classList.remove("success");
        }
    });

});


//* set Event for main button
$("#mainButton")[0].onclick = function(){

    let isValid = true;
    for (const inp of [$("#name")[0], $("#price")[0], $("#category")[0]]) {

        if (!inp.value.trim()) {

            isValid = false
            inp.focus();
            break;

        }

    }

    if (isValid) {

        if (editMode === "create"){

            if(+$("#count")[0].value > 100) return alert("count is too big");

            if(+$("#count")[0].value > 1) {

                for (let i=0;i<+$("#count")[0].value;i++){

                    const pro = {
                        name: $("#name")[0].value.trim(),   
                        price: +$("#price")[0].value,   
                        discount: +$("#discount")[0].value,   
                        taxes: +$("#taxes")[0].value,   
                        ads: +$("#ads")[0].value, 
                        category: $("#category")[0].value.trim(),
                        total: +$("#total")[0].innerText,
                    };

                    pro.__proto__.constructor = function Product(){}; //! this line is not required
                    products.push(pro);

                }

            } else {

                const pro = {
                    name: $("#name")[0].value.trim(),   
                    price: +$("#price")[0].value,   
                    discount: +$("#discount")[0].value,   
                    taxes: +$("#taxes")[0].value,   
                    ads: +$("#ads")[0].value, 
                    category: $("#category")[0].value.trim(),
                    total: +$("#total")[0].innerText,
                };

                pro.__proto__.constructor = function Product(){};
                products.push(pro);

            }

            clearInputs();
            showProducts();

        } else {

            const product = products[temp];
            product.name = $("#name")[0].value.trim();
            product.price = +$("#price")[0].value;
            product.discount = +$("#discount")[0].value;
            product.taxes = +$("#taxes")[0].value;
            product.ads = +$("#ads")[0].value;
            product.category = $("#category")[0].value.trim();
            product.total = +$("#total")[0].innerText;

            showProducts();
            $("#count")[0].style.display = "block";
            
            editMode = "create";

            $("#mainButton")[0].innerText = "Add product";
            $("#mainButton")[0].style.backgroundColor = "#6600ff";

            clearInputs();

        }

    }


}


$("#deleteAll")[0].onclick = function() {

    if(editMode=="create"){
        products.splice(0);
        showProducts();
    }

}



function clearInputs(){

    $("#inputs input").forEach(inp => {

        inp.value = "";

    })
    total.innerText = "0";
     total.parentNode.classList.remove("success");

}


function showProducts(){


    let htmlContent = "";
    $("#table tbody")[0].innerHTML = "";
    for (let i=0;i<products.length;i++) {

        const product = products[i]
        htmlContent += `
            <tr>

                <td>${i+1}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td>${product.discount}</td>
                <td>${product.taxes}</td>
                <td>${product.ads}</td>
                <td>${product.total}</td>
                <td><button class="update" onclick="updateProduct(${i}, this.parentNode.parentNode)">Update</button></td>
                <td><button class="delete" onclick="deleteProduct(${i})">Delete</button></td>

            </tr>
        `

    }

    $("#table tbody")[0].innerHTML = htmlContent;

    $("#deleteAll")[0].innerText = `Delete All(${products.length})`;

    localStorage.bzProducts = JSON.stringify(products);

}

function updateProduct(productId, htmlRow) {

    const product = products[productId];

    //* fill inputs using product details
    $("#name")[0].value = product.name;
    $("#price")[0].value = product.price;
    $("#discount")[0].value = product.discount;
    $("#taxes")[0].value = product.taxes;
    $("#ads")[0].value = product.ads;
    $("#category")[0].value = product.category;
    total.innerText = product.total;
    product.total>0 ? total.parentNode.classList.add("success") : total.parentNode.classList.remove("success");

    //* change style and text of main button
    $("#mainButton")[0].innerText = "Update product";
    $("#mainButton")[0].style.backgroundColor = "#007e11";

    //* hide the count input
    $("#count")[0].style.display = "none";

    //* change edit mode to update
    editMode = "update";

    //* set poroduct id to value of temp variable
    temp = productId;

    //* set deleteAll button to disabled
    $("#deleteAll")[0].classList.add("disabled");

    //* add class "selected" to htmlElement for change his styles and styles of buttons inside him
    htmlRow.classList.add("selected");
    htmlRow.lastElementChild.firstElementChild.classList.add("disabled");
    console.log(Array.from(htmlRow.childNodes).at(-2).firstElementChild);
    Array.from(htmlRow.children).at(-2).firstElementChild.classList.add("disabled");

    //* scroll To up
    scroll({
        left: 0,
        top: 0,
        behavior: "smooth"
    });

}


function deleteProduct(productId) {

    if (!$("#table tbody tr")[productId].classList.contains("selected")){
        products.splice(productId, 1);
        showProducts();
    }
    
}


function search(searchMood) {


        let htmlContent = "";
        $("#table tbody")[0].innerHTML = "";
        for (let i=0;i<products.length;i++) {

            const product = products[i]
            if (product[searchMood].toLowerCase().includes($("#search")[0].value.trim().toLowerCase())) {

                htmlContent += `
                    <tr>

                        <td>${i+1}</td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>${product.price}</td>
                        <td>${product.discount}</td>
                        <td>${product.taxes}</td>
                        <td>${product.ads}</td>
                        <td>${product.total}</td>
                        <td><button class="update" onclick="updateProduct(${i})">Update</button></td>
                        <td><button class="delete" onclick="deleteProduct(${i})">Delete</button></td>

                    </tr>
                `
            }

        }

        $("#table tbody")[0].innerHTML = htmlContent;

}

//* show/hide scroll to up button
document.addEventListener("scroll", function() {
    if (scrollY > 400) {
        $("#scrollToUp")[0].classList.remove("hide");
    } else {
        $("#scrollToUp")[0].classList.add("hide");
    }
});


onload = showProducts;
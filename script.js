let modalQTD = 1,
    modalKey = 0,
    cart = [];

const retornaIten= (el) =>document.querySelector(el);
const retornaItens = (el) =>document.querySelectorAll(el);

//listagem das pizzas
pizzaJson.map((item, index) => {
    const pizzaItem = retornaIten(".models .pizza-item").cloneNode(true)
    
    pizzaItem.setAttribute("data-key", index)
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

    pizzaItem.querySelector("a").addEventListener("click", (e) =>{
        e.preventDefault();
        
        let key = e.target.closest(".pizza-item").getAttribute("data-key");
        modalQTD = 1;
        modalKey = key;

        retornaIten(".pizzaBig img").src = pizzaJson[key].img;
        retornaIten(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
        retornaIten(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
        retornaIten(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
        retornaIten(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        retornaIten(".pizzaInfo--size.selected").classList.remove("selected");

        retornaItens(".pizzaInfo--size").forEach((size,tamanho) =>{
            if(tamanho == 2){
                size.classList.add("selected");
            }
            size.querySelector("span").innerHTML = pizzaJson[key].sizes[tamanho];
        });

        retornaIten(".pizzaInfo--qt").innerHTML = modalQTD;
        
        retornaIten(".pizzaWindowArea").style.opacity = 1;
        retornaIten(".pizzaWindowArea").style.display = "flex";
    });
    
    retornaIten(".pizza-area").append(pizzaItem);
});

//Eventos do Modal

function closedModal () {
    retornaIten(".pizzaWindowArea").style.opacity = 0;
    retornaIten(".pizzaWindowArea").style.display = "none";
};

retornaItens(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item) =>{
    item.addEventListener("click", closedModal);
});

retornaIten(".pizzaInfo--qtmenos").addEventListener("click", () =>{
    if(modalQTD >1){
        modalQTD--;
        retornaIten(".pizzaInfo--qt").innerHTML = modalQTD;
    }
});

retornaIten(".pizzaInfo--qtmais").addEventListener("click", () =>{
    modalQTD++;
    retornaIten(".pizzaInfo--qt").innerHTML = modalQTD;
});

retornaItens(".pizzaInfo--size").forEach((size,tamanho) =>{
    size.addEventListener("click", (e) =>{
        retornaIten(".pizzaInfo--size.selected").classList.remove("selected");
        size.classList.add("selected")
    })
});

retornaIten(".pizzaInfo--addButton").addEventListener("click", () => {
    let size = parseInt(retornaIten(".pizzaInfo--size.selected").getAttribute("data-key")),
        identifier = pizzaJson[modalKey].id + "&" + size,
        key = cart.findIndex((item) =>item.identifier == identifier);

    if(key > -1){
        cart[key].qt += modalQTD;

    }else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt:modalQTD
        });
    }

    uptadeCart();
    closedModal();
});

retornaIten(".menu-openner").addEventListener("click", ()=>{
    if(cart.length > 0){
        retornaIten("aside").style.left = "0";
    }
});

retornaIten(".menu-closer").addEventListener("click",() => {
    retornaIten("aside").style.left = "100vw";
})

function uptadeCart () {
    retornaIten(".menu-openner span").innerHTML = cart.length;

    if(cart.length > 0){
        retornaIten("aside").classList.add("show");
        retornaIten(".cart").innerHTML = "";

        let subTotal = 0,
            sale = 0,
            total = 0;

        for (let index in cart) {
            let pizzaItem = pizzaJson.find((pizza) => pizza.id == cart[index].id),
                cartItem = retornaIten(".models .cart--item").cloneNode(true),
                pizzaSizeName;

                subTotal += pizzaItem.price * cart[index].qt;

                switch(cart[index].size){
                    case 0:
                        pizzaSizeName = "P";
                        break;
                    case 1:
                        pizzaSizeName = "M";
                        break;
                    case 2:
                        pizzaSizeName = "G";
                        break; 

                }
                let pizaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector("img").src = pizzaItem.img;
            cartItem.querySelector(".cart--item-nome").innerHTML = pizaName;
            cartItem.querySelector(".cart--item--qt").innerHTML = cart[index].qt;

            cartItem.querySelector(".cart--item-qtmenos").addEventListener("click",() =>{
                if(cart[index].qt > 1){
                    cart[index].qt--;
                }else{
                    cart.splice(index, 1);
                }
                uptadeCart();
            });
            cartItem.querySelector(".cart--item-qtmais").addEventListener("click",() =>{
                cart[index].qt++;
                uptadeCart();
            });

            retornaIten(".cart").append(cartItem);
        }

        sale = subTotal * 0.1;
        total = subTotal - sale;

        retornaIten(".subtotal span:last-child").innerHTML = `R$ ${subTotal.toFixed(2)}`;
        retornaIten(".desconto span:last-child").innerHTML = `R$ ${sale.toFixed(2)}`;
        retornaIten(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;

    }else{
        retornaIten("aside").classList.remove("show");
        retornaIten("aside").style.left = "100vw";
    }
}

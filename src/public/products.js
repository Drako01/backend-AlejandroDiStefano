const socket = io();

let productForm = document.querySelector('form#product-form');

productForm.addEventListener('submit', evt => {
	evt.preventDefault();

	let newProduct = {
		title: productForm.title.value,
		category: productForm.category.value,
		thumbnail: '/img/' + productForm.thumbnail.value.replace(/^.*\\/, ''),
		size: productForm.size.value,
		code: productForm.code.value,
		description: productForm.description.value,
		price: productForm.price.value
	};


	socket.emit('product-list', { product: newProduct });
	
	let productListElement = document.querySelector('div#product-list.d-flex.flex-wrap.justify-content-center');


	socket.on('product', (newProduct) => { });

	let productCards = `<div class="card" style="width: 18rem;">
        <img class="card-img-top" src="${newProduct.thumbnail}" alt="Card image cap">
        <div class="card-body">
            <h4 class="card-title">${newProduct.title}</h4>
            <p class="card-text">${newProduct.description} </p>
            <h5 class="card-text" style="margin-bottom: 1rem;">$${newProduct.price}.- </h5>
            <button type="submit" class="btn btn-success" style="margin-bottom: 1rem;">Comprar</button><br> 
			<button type="submit" class="btn btn-danger">Eliminar</button>                            
        </div>
    </div>`;

	productListElement.innerHTML += productCards;
	productForm.reset();
});



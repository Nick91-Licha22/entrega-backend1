const socket = io();

const productForm = document.getElementById('productForm');
const productsContainer = document.getElementById('productsContainer');

const createProductCard = (product) => {
    return `
     <div class="col" id="product-card-${product.id}">
         <div class="card h-100 shadow-sm border-info">
             <div class="card-body">
                 <h5 class="card-title">${product.title}</h5>
                     <h6 class="card-subtitle mb-2 text-muted">ID: ${product.id} | Código: ${product.code}</h6>
                         <p class="card-text">${product.description}</p>
                         <p class="card-text"><strong>Precio: $${product.price}</strong> | Stock: ${product.stock}</p>
                     <p class="card-text"><small class="text-success">Categoría: ${product.category}</small></p>
                 <button class="btn btn-danger btn-sm w-100" onclick="deleteProduct('${product.id}')">Eliminar Producto</button>
             </div>
         </div>
     </div>
 `;
};

productForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const productData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        code: document.getElementById('code').value,
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Error al agregar: ${errorData.error}`);
            return;
        }

        productForm.reset();

    } catch (error) {
        console.error('Error de red:', error);
    }
});

window.deleteProduct = async function (productId) {

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Error al eliminar: ${errorData.error}`);
            return;
        }

    } catch (error) {
        console.error('Error de red:', error);
    }
}

socket.on('productAdded', (product) => {
    productsContainer.insertAdjacentHTML('afterbegin', createProductCard(product));
});

socket.on('productDeleted', (productId) => {
    const cardToRemove = document.getElementById(`product-card-${productId}`);
    if (cardToRemove) {
        cardToRemove.remove();
    }
});
const socket = io();

const productForm = document.getElementById('productForm');
const productsContainer = document.getElementById('productsContainer');

const createProductCard = (product) => {
    return `
     <div class="col product-card-container" id="product-card-${product._id}">
         <div class="card product-card">
             <img src="/img/${product.thumbnail}" class="card-img-top" alt="${product.title}">
             <div class="card-body d-flex flex-column">
                 <h5 class="card-title">${product.title}</h5>
                 <p class="card-subtitle mb-2 text-muted small">ID: ${product._id} | Código: ${product.code}</p>
                 <p class="card-text">${product.description}</p>
                 <p class="card-text mt-auto">
                     <strong>Precio: $${product.price}</strong> | Stock: ${product.stock}
                 </p>
                 <span class="badge bg-success mb-2 align-self-start">${product.category}</span>
                 <button class="btn btn-danger btn-sm w-100" onclick="deleteProduct('${product._id}')">Eliminar Producto</button>
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
        thumbnail: document.getElementById('thumbnail').value || "product.jpg"
    };

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            Swal.fire({ icon: 'error', title: 'Error', text: errorData.message || errorData.error, confirmButtonColor: '#198754' });
            return;
        }

        Swal.fire({
            icon: 'success',
            title: '¡Producto Agregado!',
            text: 'Se actualizó el catálogo en tiempo real.',
            showConfirmButton: false,
            timer: 1500
        });

        productForm.reset();
    } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo comunicar con el servidor', confirmButtonColor: '#198754' });
    }
});

window.deleteProduct = async function (productId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No vas a poder revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#198754',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/products/${productId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
                    return;
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'El producto fue borrado con éxito.',
                    showConfirmButton: false,
                    timer: 1500
                });

            } catch (error) {
                Swal.fire('Error', 'Problema de conexión.', 'error');
            }
        }
    });
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
const addToCart = async (cartId, productId) => {
    if (!cartId || cartId === "null") {
        Swal.fire({
            icon: 'warning',
            title: '¡Alto ahí!',
            text: 'Tenés que iniciar sesión para poder comprar.',
            showCancelButton: true,
            confirmButtonText: 'Ir al Login',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#198754'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login';
            }
        });
        return;
    }

    try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Agregado!',
                text: 'El producto se sumó a tu carrito 🍊',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            const data = await response.json();
            Swal.fire('Error', data.error || 'No se pudo agregar el producto', 'error');
        }
    } catch (error) {
        console.error("Error:", error);
        Swal.fire('Error', 'Hubo un problema de conexión', 'error');
    }
};

const removeFromCart = async (cartId, productId) => {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'Se quitó el producto del carrito',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                location.reload(); 
            });
        } else {
            Swal.fire('Error', 'No se pudo eliminar', 'error');
        }
    } catch (error) {
        console.error(error);
    }
};

const updateQuantity = async (cartId, productId, action) => {
    try {
        if (action === 'add') {
            await addToCart(cartId, productId);
            setTimeout(() => location.reload(), 1500); 
        } else {
            Swal.fire('En construcción', 'La ruta para restar cantidad exacta requiere un PUT a /api/carts/:cid/products/:pid', 'info');
        }
    } catch (error) {
        console.error(error);
    }
};

const checkout = () => {
    Swal.fire({
        title: '¡A punto de pagar!',
        text: "Acá deberíamos conectar con la lógica del Ticket.",
        icon: 'info',
        confirmButtonColor: '#198754',
        confirmButtonText: 'Entendido'
    });
};
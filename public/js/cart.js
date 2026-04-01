const addToCart = async (cartId, productId) => {
    // Si el cartId es inválido, lo buscamos en el atributo data del body
    let id = (cartId && cartId !== "undefined" && cartId !== "[object Object]") 
             ? cartId 
             : document.body.dataset.cartid;

    if (!id || id === "undefined") {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No tienes un carrito asignado. Cierra sesión y vuelve a entrar para sincronizar.'
        });
    }

    try {
        const response = await fetch(`/api/carts/${id}/product/${productId}`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            Swal.fire({
                title: '¡Agregado!',
                icon: 'success',
                timer: 1000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        } else {
            Swal.fire('Error', 'No se pudo agregar el producto', 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Error de red', 'error');
    }
};

const finalizePurchase = async (cartId) => {
    Swal.fire({ title: 'Procesando...', didOpen: () => Swal.showLoading() });
    try {
        const response = await fetch(`/api/carts/${cartId}/purchase`, { method: 'POST' });
        const data = await response.json();
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Compra Exitosa',
                html: `<p>Ticket: <b>${data.payload.code}</b></p><p>Total: <b>$${data.payload.amount}</b></p>`,
            }).then(() => window.location.href = '/products');
        } else {
            Swal.fire('Error', data.error || 'Error en la compra', 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Error de servidor', 'error');
    }
};
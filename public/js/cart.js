const addToCart = async (cartId, productId) => {
    if (!cartId || cartId === "null" || cartId === "undefined") {
        return Swal.fire('Error', 'No tienes un carrito asignado. Cierra sesión y vuelve a entrar.', 'error');
    }

    try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, { method: 'POST' });
        if (response.ok) {
            Swal.fire({
                title: '¡Agregado!',
                icon: 'success',
                timer: 800,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        }
    } catch (error) {
        console.error(error);
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
                html: `<div class="text-start p-3 bg-light rounded">
                        <p><strong>Ticket:</strong> ${data.payload.code}</p>
                        <p><strong>Monto:</strong> $${data.payload.amount}</p>
                       </div>`,
                confirmButtonText: 'Volver al inicio'
            }).then(() => window.location.href = '/products');
        } else {
            Swal.fire('Error', 'No se pudo procesar la compra', 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Error de conexión', 'error');
    }
};
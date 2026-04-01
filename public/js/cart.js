const addToCart = async (cartId, productId) => {
    if (!cartId || cartId === "undefined" || cartId === "[object Object]") {
        return Swal.fire('Oops', 'No se detectó tu carrito. Por favor reingresa.', 'warning');
    }

    try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, { method: 'POST' });
        if (response.ok) {
            Swal.fire({ title: '¡Agregado!', icon: 'success', timer: 1000, showConfirmButton: false, toast: true, position: 'top-end' });
        } else {
            Swal.fire('Error', 'No tienes permiso o no hay stock', 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Error de conexión', 'error');
    }
};

const finalizePurchase = async (cartId) => {
    Swal.fire({ title: 'Procesando Compra...', didOpen: () => Swal.showLoading() });

    try {
        const response = await fetch(`/api/carts/${cartId}/purchase`, { method: 'POST' });
        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Compra Exitosa',
                html: `
                    <div style="text-align: left; padding: 10px; background: #eee; border-radius: 5px;">
                        <p><strong>Ticket:</strong> ${data.payload.code}</p>
                        <p><strong>Total:</strong> $${data.payload.amount}</p>
                        <p><strong>Email:</strong> ${data.payload.purchaser}</p>
                    </div>
                `,
                confirmButtonText: 'Genial'
            }).then(() => window.location.href = '/products');
        } else {
            Swal.fire('Error', data.error || 'Problema con el stock', 'error');
        }
    } catch (error) {
        Swal.fire('Error', 'Error en el servidor', 'error');
    }
};
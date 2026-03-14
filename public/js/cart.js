const addToCart = async (cartId, productId) => {
    try {
        const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.status === 401) {
            return Swal.fire('Iniciá Sesión', 'Debes estar logueado para agregar productos', 'warning')
                   .then(() => window.location.href = '/login');
        }

        if (res.ok) {
            Swal.fire({
                title: '¡Agregado!',
                text: 'Producto sumado al carrito',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const removeFromCart = async (cartId, productId) => {
    const res = await fetch(`/api/carts/${cartId}/products/${productId}`, { method: 'DELETE' });
    if (res.ok) location.reload();
};
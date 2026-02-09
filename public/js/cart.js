const cartId = "6965438b2f4f1388616bc9f9"; 
const addToCart = async (productId) => {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Producto agregado!',
                text: 'Se sumó correctamente a tu pedido.',
                timer: 1500,
                showConfirmButton: false,
                iconColor: '#28a745'
            });
        }
    } catch (error) {
        console.error("Error al agregar:", error);
    }
};

const updateQuantity = async (cId, productId, action) => {
    const method = action === 'add' ? 'POST' : 'DELETE';
    try {
        const response = await fetch(`/api/carts/${cId}/products/${productId}`, {
            method: method,
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) location.reload();
    } catch (error) {
        console.error("Error:", error);
    }
};

const removeFromCart = async (cId, productId) => {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Se quitará el producto del carrito",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, quitar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`/api/carts/${cId}/products/${productId}/all`, { method: 'DELETE' });
            if (response.ok) location.reload();
        } catch (error) {
            console.error("Error:", error);
        }
    }
};

const checkout = async () => {
    const totalElement = document.querySelector('.text-success.fw-bold');
    const totalAPagar = totalElement ? totalElement.innerText : "$0";

    const { value: formValues } = await Swal.fire({
        title: 'Finalizar Pedido 🛒',
        html: `
            <div style="display: flex; flex-direction: column; text-align: left; gap: 15px; font-family: 'Arial', sans-serif;">
                
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Nombre y Apellido:</label>
                    <input id="swal-nombre" class="swal2-input" style="width: 100%; margin: 0;" placeholder="Ej: Juan Pérez">
                </div>

                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Correo Electrónico:</label>
                    <input id="swal-email" type="email" class="swal2-input" style="width: 100%; margin: 0;" placeholder="juan@ejemplo.com">
                </div>

                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Teléfono:</label>
                    <input id="swal-tel" type="tel" class="swal2-input" style="width: 100%; margin: 0;" placeholder="11 1234 5678">
                </div>

                <div style="margin-top: 10px; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #28a745; text-align: center;">
                    <h4 style="margin: 0; color: #28a745; font-weight: bold;">Total a Pagar: ${totalAPagar}</h4>
                </div>

            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Aceptar Compra ✅',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        width: '500px',
        preConfirm: () => {
            const nombre = document.getElementById('swal-nombre').value;
            const email = document.getElementById('swal-email').value;
            const tel = document.getElementById('swal-tel').value;

            if (!nombre || !email || !tel) {
                Swal.showValidationMessage('Por favor, completa todos los campos');
                return false;
            }
            return { nombre, email, tel };
        }
    });

    if (formValues) {
        try {
            const response = await fetch(`/api/carts/${cartId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const orderId = Math.floor(Math.random() * 900000) + 100000;
                
                Swal.fire({
                    icon: 'success',
                    title: '¡Pago Exitoso!',
                    html: `
                        <div style="text-align: center;">
                            <p style="font-size: 1.1rem;">¡Gracias <b>${formValues.nombre}</b>!</p>
                            <p>Tu pedido ha sido procesado con éxito.</p>
                            <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px dashed #6c757d;">
                                <b>ID de Orden: #${orderId}</b><br>
                                <b>Total abonado: ${totalAPagar}</b>
                            </div>
                            <p>Enviamos los detalles a: <b>${formValues.email}</b></p>
                            <hr>
                            <p>Gracias por comprar en <b>SYN VERDULERÍA</b> 🍎</p>
                        </div>
                    `,
                    confirmButtonText: 'Finalizar',
                    confirmButtonColor: '#28a745'
                }).then(() => {
                    window.location.href = '/products';
                });
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al procesar la compra', 'error');
        }
    }
    
};
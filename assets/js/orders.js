document.addEventListener('DOMContentLoaded', () => {
    const ordersTable = document.getElementById('orders-table');
    const searchInput = document.getElementById('order-search');

    // --- Search Orders ---
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#orders-body tr');

            rows.forEach(row => {
                const orderId = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
                const client = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const product = row.querySelector('td:nth-child(3)').textContent.toLowerCase();

                if (orderId.includes(searchTerm) || client.includes(searchTerm) || product.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // --- Update Order Status ---
    if (ordersTable) {
        ordersTable.addEventListener('change', (e) => {
            if (e.target.classList.contains('status-select')) {
                const select = e.target;
                const status = select.value;
                const id = select.dataset.id;

                // Update select appearance
                select.className = `status-select ${status}`;

                // In a real app, you would send this to the server:
                console.log(`Updating order ${id} status to: ${status}`);
                
                // Show a brief notification (optional)
                const originalColor = select.style.borderColor;
                select.style.borderColor = 'var(--primary-blue)';
                setTimeout(() => {
                    select.style.borderColor = '';
                }, 500);
            }
        });
    }

    // --- View Order Details ---
    if (ordersTable) {
        ordersTable.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('.view-order');
            if (viewBtn) {
                const row = viewBtn.closest('tr');
                const id = row.dataset.id;

                const formData = new FormData();
                formData.append('action', 'get_order');
                formData.append('id', id);

                fetch('cart.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            const order = data.order;
                            alert(`Détails de la commande #ORD-${String(order.id).padStart(4, '0')}:\n\nClient: ${order.username}\nProduit: ${order.product_name}\nMontant: ${order.amount}€\nStatut: ${order.status}\nDate: ${order.created_at}`);
                        } else {
                            alert('Erreur: ' + data.message);
                        }
                    });
            }
        });
    }
});

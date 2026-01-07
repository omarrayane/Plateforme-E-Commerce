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

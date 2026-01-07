document.addEventListener('DOMContentLoaded', () => {
    const usersTable = document.getElementById('users-table');
    const searchInput = document.getElementById('search-users');

    // --- Search Users ---
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#users-body tr');

            rows.forEach(row => {
                const name = row.querySelector('.user-info span').textContent.toLowerCase();
                const email = row.querySelector('td:nth-child(2)').textContent.toLowerCase();

                if (name.includes(searchTerm) || email.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // --- Event Delegation for Actions ---
    if (usersTable) {
        usersTable.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.delete-user');
            const promoteBtn = e.target.closest('.promote-admin');
            const demoteBtn = e.target.closest('.demote-admin');

            if (deleteBtn) {
                const row = deleteBtn.closest('tr');
                const id = row.dataset.id;
                const name = row.querySelector('.user-info span').textContent;

                if (confirm(`Êtes-vous sûr de vouloir supprimer le compte de ${name} ?`)) {
                    const formData = new FormData();
                    formData.append('action', 'delete');
                    formData.append('id', id);

                    fetch('users.php', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                row.remove();
                            } else {
                                alert('Erreur: ' + data.message);
                            }
                        });
                }
            }

            if (promoteBtn) {
                const row = promoteBtn.closest('tr');
                const id = row.dataset.id;
                const name = row.querySelector('.user-info span').textContent;

                if (confirm(`Promouvoir ${name} au rang d'Administrateur ?`)) {
                    const formData = new FormData();
                    formData.append('action', 'promote');
                    formData.append('id', id);

                    fetch('users.php', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                location.reload();
                            } else {
                                alert('Erreur: ' + data.message);
                            }
                        });
                }
            }

            if (demoteBtn) {
                const row = demoteBtn.closest('tr');
                const id = row.dataset.id;
                const name = row.querySelector('.user-info span').textContent;

                if (confirm(`Rétrograder ${name} au rang d'Utilisateur ?`)) {
                    const formData = new FormData();
                    formData.append('action', 'demote');
                    formData.append('id', id);

                    fetch('users.php', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                location.reload();
                            } else {
                                alert('Erreur: ' + data.message);
                            }
                        });
                }
            }
        });
    }
});

console.log('users.js version 1.3 loading...');

window.manageUser = function (action, id, name) {
    console.log('manageUser called:', action, id, name);

    let confirmMsg = '';
    if (action === 'delete') confirmMsg = `Êtes-vous sûr de vouloir supprimer le compte de ${name} ?`;
    if (action === 'promote') confirmMsg = `Promouvoir ${name} au rang d'Administrateur ?`;
    if (action === 'demote') confirmMsg = `Rétrograder ${name} au rang d'Utilisateur ?`;

    if (!confirm(confirmMsg)) return;

    const params = new URLSearchParams();
    params.append('action', action);
    params.append('id', id);

    fetch('users.php', {
        method: 'POST',
        body: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(response => {
            console.log('Response received status:', response.status);
            return response.text(); // Get as text first to avoid JSON parse errors
        })
        .then(text => {
            console.log('Raw response:', text);
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    if (action === 'delete') {
                        // Find the row and remove it
                        const row = document.querySelector(`tr[data-id="${id}"]`);
                        if (row) row.remove();
                    } else {
                        location.reload();
                    }
                } else {
                    alert('Erreur du serveur: ' + (data.message || 'Inconnue'));
                }
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                alert('Erreur critique: Le serveur a renvoyé une réponse invalide.\n' + text.substring(0, 100));
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Erreur réseau. Vérifiez votre connexion.');
        });
};

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-users');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#users-body tr');
            rows.forEach(row => {
                const name = row.querySelector('.user-info span').textContent.toLowerCase();
                const email = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                row.style.display = (name.includes(searchTerm) || email.includes(searchTerm)) ? '' : 'none';
            });
        });
    }
<<<<<<< HEAD
=======

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
>>>>>>> f5512bca0df29e9b94d8d2b70f5d595cd7c87ec5
});

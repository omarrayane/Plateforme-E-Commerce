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

            if (deleteBtn) {
                const row = deleteBtn.closest('tr');
                const name = row.querySelector('.user-info span').textContent;
                const email = row.querySelector('td:nth-child(2)').textContent;

                if (confirm(`Êtes-vous sûr de vouloir supprimer le compte de ${name} (${email}) ?`)) {
                    row.remove();
                }
            }

            if (promoteBtn) {
                const row = promoteBtn.closest('tr');
                const name = row.querySelector('.user-info span').textContent;
                const roleBadge = row.querySelector('.status-badge');
                const actionButtons = row.querySelector('.action-buttons');

                if (confirm(`Promouvoir ${name} au rang d'Administrateur ?`)) {
                    // Update Role Badge
                    roleBadge.textContent = 'Administrateur';
                    roleBadge.classList.remove('complete');
                    roleBadge.classList.add('pending');

                    // Replace Promote with Demote
                    promoteBtn.outerHTML = `
                        <button class="btn btn-secondary btn-sm demote-admin" title="Rendre Utilisateur">
                            <i class="fas fa-user-minus"></i> Demote
                        </button>
                    `;
                }
            }

            const demoteBtn = e.target.closest('.demote-admin');
            if (demoteBtn) {
                const row = demoteBtn.closest('tr');
                const name = row.querySelector('.user-info span').textContent;
                const roleBadge = row.querySelector('.status-badge');

                if (confirm(`Rétrograder ${name} au rang d'Utilisateur ?`)) {
                    // Update Role Badge
                    roleBadge.textContent = 'Utilisateur';
                    roleBadge.classList.remove('pending');
                    roleBadge.classList.add('complete');

                    // Replace Demote with Promote
                    demoteBtn.outerHTML = `
                        <button class="btn btn-primary btn-sm promote-admin" title="Rendre Admin">
                            <i class="fas fa-user-shield"></i> Promote
                        </button>
                    `;
                }
            }
        });
    }
});

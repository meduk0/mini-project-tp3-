// API Configuration
const API_URL = 'http://localhost:3000';

// DOM Elements
const addUserForm = document.getElementById('addUserForm');
const editUserForm = document.getElementById('editUserForm');
const usersTableBody = document.getElementById('usersTableBody');
const editModal = document.getElementById('editModal');
const closeModal = document.querySelector('.close');
const cancelEdit = document.getElementById('cancelEdit');
const refreshBtn = document.getElementById('refreshBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    addUserForm.addEventListener('submit', handleAddUser);
    editUserForm.addEventListener('submit', handleEditUser);
    refreshBtn.addEventListener('click', loadUsers);
    closeModal.addEventListener('click', hideEditModal);
    cancelEdit.addEventListener('click', hideEditModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            hideEditModal();
        }
    });
}

// Load all users
async function loadUsers() {
    try {
        showLoading(true);
        hideError();

        const response = await fetch(`${API_URL}/users`);
        const result = await response.json();

        if (result.success) {
            displayUsers(result.data);
        } else {
            showError('Failed to load users');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showError('Failed to connect to server. Make sure the backend is running.');
    } finally {
        showLoading(false);
    }
}

// Display users in table
function displayUsers(users) {
    usersTableBody.innerHTML = '';

    if (users.length === 0) {
        usersTableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
          No users found. Add one above!
        </td>
      </tr>
    `;
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${user.id}</td>
      <td>${escapeHtml(user.name)}</td>
      <td>${escapeHtml(user.class || '-')}</td>
      <td>${escapeHtml(user.nationality || '-')}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-sm btn-primary" onclick="showEditModal(${user.id}, '${escapeHtml(user.name)}', '${escapeHtml(user.class || '')}', '${escapeHtml(user.nationality || '')}')">
            Edit
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
            Delete
          </button>
        </div>
      </td>
    `;
        usersTableBody.appendChild(row);
    });
}

// Add new user
async function handleAddUser(e) {
    e.preventDefault();

    const userData = {
        name: document.getElementById('addName').value.trim(),
        class: document.getElementById('addClass').value.trim(),
        nationality: document.getElementById('addNationality').value.trim()
    };

    try {
        const response = await fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (result.success) {
            addUserForm.reset();
            loadUsers();
            showSuccess('User added successfully!');
        } else {
            showError(result.error || 'Failed to add user');
        }
    } catch (error) {
        console.error('Error adding user:', error);
        showError('Failed to add user');
    }
}

// Show edit modal
function showEditModal(id, name, userClass, nationality) {
    document.getElementById('editUserId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editClass').value = userClass;
    document.getElementById('editNationality').value = nationality;
    editModal.style.display = 'block';
}

// Hide edit modal
function hideEditModal() {
    editModal.style.display = 'none';
    editUserForm.reset();
}

// Handle edit user
async function handleEditUser(e) {
    e.preventDefault();

    const id = document.getElementById('editUserId').value;
    const userData = {
        name: document.getElementById('editName').value.trim(),
        class: document.getElementById('editClass').value.trim(),
        nationality: document.getElementById('editNationality').value.trim()
    };

    try {
        const response = await fetch(`${API_URL}/modify/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (result.success) {
            hideEditModal();
            loadUsers();
            showSuccess('User updated successfully!');
        } else {
            showError(result.error || 'Failed to update user');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        showError('Failed to update user');
    }
}

// Delete user
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/remove/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            loadUsers();
            showSuccess('User deleted successfully!');
        } else {
            showError(result.error || 'Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showError('Failed to delete user');
    }
}

// Utility functions
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showSuccess(message) {
    // Create temporary success message
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #10b981;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
  `;
    successDiv.textContent = message;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

if (result.status === 'success') {
    window.location.href = '/pet-registration.html';
} else {
    alert('Login failed: ' + result.message);
} 
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-pet-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Create FormData object to handle file upload
        const formData = new FormData(form);
        
        try {
            const response = await fetch('api/add-pet.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Pet added successfully!');
                window.location.href = 'protected.html';
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the pet.');
        }
    });
}); 
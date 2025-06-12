document.addEventListener('DOMContentLoaded', function() {
    // Get pet ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');

    if (petId) {
        loadPetDetails(petId);
    } else {
        showError('No pet ID provided');
    }
});

async function loadPetDetails(petId) {
    try {
        const response = await fetch(`api/get-pet-details.php?id=${petId}`);
        const data = await response.json();
        
        if (data.success) {
            displayPetDetails(data.pet);
        } else {
            showError(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to load pet details');
    }
}

function displayPetDetails(pet) {
    const detailsContainer = document.getElementById('pet-details');
    
    const details = `
        <div class="pet-detail-card">
            <h2>${pet.name}</h2>
            <div class="pet-detail-content">
                <div class="pet-detail-section">
                    <h3>Basic Information</h3>
                    <p><strong>Age:</strong> ${pet.age} years</p>
                </div>
                
                <div class="pet-detail-section">
                    <h3>Image</h3>
                    <img src="${pet.image_path ? 'public/' + pet.image_path : 'resources/default-pet.png'}" alt="${pet.name}" class="pet-detail-image">
                </div>
                
                <div class="pet-detail-section">
                    <h3>Care Information</h3>
                    <p><strong>Brushing Frequency:</strong> ${pet.brushing_frequency || 'Not specified'} times per week</p>
                    <p><strong>Medication:</strong> ${pet.medication || 'None'}</p>
                    <p><strong>Medication Frequency:</strong> ${pet.medication_frequency || 'Not specified'} times per day</p>
                    <p><strong>Food:</strong> ${pet.food || 'Not specified'}</p>
                    <p><strong>Food Frequency:</strong> ${pet.food_frequency || 'Not specified'} times per day</p>
                </div>
            </div>
        </div>
    `;
    
    detailsContainer.innerHTML = details;
}

function showError(message) {
    const detailsContainer = document.getElementById('pet-details');
    detailsContainer.innerHTML = `<div class="error-message">${message}</div>`;
} 
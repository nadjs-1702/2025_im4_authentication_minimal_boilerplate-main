document.addEventListener('DOMContentLoaded', function() {
    loadPets();
});

async function loadPets() {
    try {
        const response = await fetch('api/get-pets.php');
        const data = await response.json();
        
        if (data.success) {
            displayPets(data.pets);
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayPets(pets) {
    const petsList = document.getElementById('pets-list');
    petsList.innerHTML = ''; // Clear existing content

    if (pets.length === 0) {
        petsList.innerHTML = '<p>No pets found. Add your first pet!</p>';
        return;
    }

    const petsGrid = document.createElement('div');
    petsGrid.className = 'pets-grid';

    pets.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.style.cursor = 'pointer';
        
        const img = document.createElement('img');
        img.src = pet.image_path ? `public/${pet.image_path}` : 'resources/default-pet.png';
        img.alt = pet.name;
        
        const name = document.createElement('p');
        name.textContent = pet.name;
        
        petCard.appendChild(img);
        petCard.appendChild(name);
        
        // Add click event to navigate to pet details
        petCard.addEventListener('click', () => {
            window.location.href = `pet-details.html?id=${pet.id}`;
        });
        
        petsGrid.appendChild(petCard);
    });

    petsList.appendChild(petsGrid);
} 
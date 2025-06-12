document.addEventListener('DOMContentLoaded', function() {
    loadPetTasks();
});

async function loadPetTasks() {
    try {
        const response = await fetch('api/get-pet-tasks.php');
        const data = await response.json();
        
        if (data.success) {
            displayPetTasks(data.pets);
        } else {
            showError(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to load pet tasks');
    }
}

function displayPetTasks(pets) {
    const tasksContainer = document.getElementById('tasks-container');
    tasksContainer.innerHTML = ''; // Clear existing content

    if (pets.length === 0) {
        tasksContainer.innerHTML = '<p>No pets found. Add your first pet!</p>';
        return;
    }

    const tasksGrid = document.createElement('div');
    tasksGrid.className = 'tasks-grid';

    pets.forEach(pet => {
        // Create brushing task button
        if (pet.brushing_frequency) {
            const taskId = `brushing-${pet.id}`;
            const brushingButton = createTaskButton(
                pet.name,
                'Brushing',
                `${pet.brushing_frequency} times per week`,
                taskId
            );
            checkTaskStatus(brushingButton, taskId);
            tasksGrid.appendChild(brushingButton);
        }

        // Create medication task button
        if (pet.medication && pet.medication_frequency) {
            const taskId = `medication-${pet.id}`;
            const medicationButton = createTaskButton(
                pet.name,
                'Medication',
                `${pet.medication} - ${pet.medication_frequency} times per day`,
                taskId
            );
            checkTaskStatus(medicationButton, taskId);
            tasksGrid.appendChild(medicationButton);
        }

        // Create food task button
        if (pet.food && pet.food_frequency) {
            const taskId = `food-${pet.id}`;
            const foodButton = createTaskButton(
                pet.name,
                'Food',
                `${pet.food} - ${pet.food_frequency} times per day`,
                taskId
            );
            checkTaskStatus(foodButton, taskId);
            tasksGrid.appendChild(foodButton);
        }
    });

    tasksContainer.appendChild(tasksGrid);
}

function createTaskButton(petName, taskType, frequency, taskId) {
    const button = document.createElement('button');
    button.className = 'task-button';
    button.dataset.taskId = taskId;
    
    const petNameElement = document.createElement('div');
    petNameElement.className = 'task-pet-name';
    petNameElement.textContent = petName;
    
    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';
    taskInfo.innerHTML = `
        <span class="task-type">${taskType}</span>
        <span class="task-frequency">${frequency}</span>
    `;
    
    button.appendChild(petNameElement);
    button.appendChild(taskInfo);

    // Add click event listener
    button.addEventListener('click', () => toggleTaskCompletion(button, taskId));
    
    return button;
}

function toggleTaskCompletion(button, taskId) {
    const now = new Date().getTime();
    const tomorrow = now + (24 * 60 * 60 * 1000); // 24 hours from now

    // Store completion status with expiration
    localStorage.setItem(taskId, tomorrow.toString());
    
    // Update button appearance
    button.classList.add('task-completed');
}

function checkTaskStatus(button, taskId) {
    const expirationTime = localStorage.getItem(taskId);
    const now = new Date().getTime();

    if (expirationTime && now < parseInt(expirationTime)) {
        button.classList.add('task-completed');
    } else if (expirationTime) {
        // Clear expired status
        localStorage.removeItem(taskId);
    }
}

function showError(message) {
    const tasksContainer = document.getElementById('tasks-container');
    tasksContainer.innerHTML = `<div class="error-message">${message}</div>`;
} 
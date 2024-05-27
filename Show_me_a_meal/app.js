document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.querySelector('.meal-button');
    const randomMeal = document.querySelector('.random-meal');
    const descriptionDisplay = document.querySelector('.how-to');
    const srcImage = document.querySelector('.meal-img');

    async function getData(e) {
        try {
            e.preventDefault();

            const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const data = await response.json();
            const meal = data.meals[0];

            const mealName = meal.strMeal;
            const mealDescription = meal.strInstructions.split('. ');
            const mealImage = meal.strMealThumb;

            randomMeal.innerHTML = mealName;
            srcImage.setAttribute("src", mealImage);

            const ul = document.createElement('ul');
            mealDescription.forEach((description, index) => {
                const li = document.createElement('li');
                li.classList.add('no-bullets');
                li.textContent = `${index + 1}. ${description}`;
                ul.appendChild(li);
            });

            descriptionDisplay.innerHTML = '';
            descriptionDisplay.appendChild(ul);

            fetchIngredients(meal);
        } catch (error) {
            console.error('Error fetching meal data:', error);
        }
    }

    async function fetchIngredients(meal) {
        try {
            const ingredients = [];
            const ul = document.getElementById('ingredients-list');
    
            for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`]; 
                if (ingredient && ingredient.trim() !== '') {
                    const combined = `${measure || ''} ${ingredient}`.trim();
                    ingredients.push(combined);
                }
            }

            console.log('Ingredients:', ingredients);
    
            ul.innerHTML = '';
    
            ingredients.forEach((combined) => {
                const li = document.createElement('li');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = combined;
                li.textContent = combined;
                li.prepend(checkbox);
                ul.appendChild(li);
            });

            const clearButton = document.getElementById('clear-selection');
            clearButton.addEventListener('click', () => {
                const checkboxes = ul.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach((checkbox) => {
                    checkbox.checked = false;
                });
            });

            const saveButton = document.getElementById('save-ingredients');
            saveButton.addEventListener('click', () => {
                const ingredientsText = ingredients.join('\n');
                const blob = new Blob([ingredientsText], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'ingredients.txt';
                link.click();
            });

            const saveAllButton = document.getElementById('save-all');
            saveAllButton.addEventListener('click', () => {
                const mealName = meal.strMeal;
                const mealDescription = meal.strInstructions.split('. ').join('\n');
                const ingredientsText = ingredients.join('\n');
                const combinedText = `Meal Name: ${mealName}\n\nIngredients:\n${ingredientsText}\n\nInstructions:\n${mealDescription}`;
                const blob = new Blob([combinedText], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'meal.txt';
                link.click();
            });

        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    }


    startBtn.addEventListener('click', getData);
});

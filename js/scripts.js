// main.js

let peopleData = [];
let selectedIndex = -1; // To keep track of the selected suggestion

async function fetchPeopleData() {
    try {
        const response = await fetch('../people.json');
        const data = await response.json();
        peopleData = data;
    } catch (error) {
        console.error('Error fetching people data:', error);
    }
}

function searchPeople(query) {
    const suggestionsContainer = document.getElementById('suggestions');

    // Clear suggestions if the query is empty
    if (query === '') {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = "none"; // Hide the suggestions container
        selectedIndex = -1; // Reset the selected index
        return;
    }

    const matchingPeople = peopleData.filter(person => {
        const fullName = `${person.name} ${person.surname}`;
        const startsWithQuery = fullName.toLowerCase().startsWith(query.toLowerCase());
        return startsWithQuery;
    });

    suggestionsContainer.innerHTML = '';

    if (matchingPeople.length === 0) {
        // If there are no matches, show the 'Bulunamadi' suggestion
        const noMatchItem = document.createElement('li');
        noMatchItem.textContent = 'Bulunamadı';
        suggestionsContainer.appendChild(noMatchItem);
    } else {
        matchingPeople.forEach((person, index) => {
            const suggestionItem = document.createElement('li');
            suggestionItem.value = `${person.id}`;
            if(person.birthday)
            {
                suggestionItem.textContent = `${person.name} ${person.surname} - ${person.birthday.substring(0,4)}`;
            }
            else
            {
                suggestionItem.textContent = `${person.name} ${person.surname} - Bilinmiyor`;    
            }
            suggestionItem.addEventListener('click', () => selectSuggestion(person.id));
            suggestionItem.addEventListener('mouseenter', () => highlightSuggestion(index));
            suggestionsContainer.appendChild(suggestionItem);
        });
    }


    suggestionsContainer.style.display = "block";
}

function selectSuggestion(id) {
    const selectedPerson = peopleData.find(person => person.id === id);
    const personDetailsBox = document.getElementById('personDetails');
    const suggestionsContainer = document.getElementById('suggestions');

    if (selectedPerson) {
        const fullName = `${selectedPerson.name} ${selectedPerson.surname} - ${selectedPerson.birthday ? selectedPerson.birthday.substring(0,4) : "Bilinmiyor"}`;
        document.getElementById('search').value = fullName;

        displayPersonDetails(id);

        // Make the personDetails box visible
        personDetailsBox.style.display = 'flex';
    } else {
        console.error('Person not found');
    }

    suggestionsContainer.style.display = "none";
    selectedIndex = -1; // Reset the selected index
}

function highlightSuggestion(index) {
    const suggestions = document.querySelectorAll('#suggestions li');
    suggestions.forEach((suggestion, i) => {
        if (i === index) {
            suggestion.classList.add('highlighted');
        } else {
            suggestion.classList.remove('highlighted');
        }
    });
}

// Handle keyboard events
document.getElementById('search').addEventListener('keydown', (event) => {
    const suggestions = document.querySelectorAll('#suggestions li');
    if (event.key === 'ArrowDown' && selectedIndex < suggestions.length - 1) {
        event.preventDefault(); // Prevent scrolling the page
        selectedIndex += 1;
    } else if (event.key === 'ArrowUp' && selectedIndex > 0) {
        event.preventDefault(); // Prevent scrolling the page
        selectedIndex -= 1;
    } else if (event.key === 'Enter' && selectedIndex !== -1) {
        event.preventDefault(); // Prevent submitting the form
        const suggestionsContainer = document.getElementById('suggestions');
        const listItems = suggestionsContainer.getElementsByTagName('li');
        selectSuggestion(listItems[selectedIndex].value);
    }
    highlightSuggestion(selectedIndex);
});

function displayPersonDetails(personId) {
    const personInfoTable = document.getElementById('personInfoTable');
    const person = peopleData.find(p => p.id === personId);
    if (person) {
        // Create a table with rows for each detail
        const tableContent = `
            <tr class="personInfo"><td>Adı:</td><td>${person.name ? person.name : "Yok"}</td></tr>
            <tr class="personInfo"><td>Soyadı:</td><td>${person.surname ? person.surname : "Yok"}</td></tr>
            <tr class="personInfo"><td>Doğum tarihi:</td><td>${person.birthday ? person.birthday : "Yok"}</td></tr>
            <tr class="personInfo"><td>${person.partners ? (person.partners.length > 1 ? 'Eşleri' : "Eşi") : "Eşi"}:</td><td>${person.partners && person.partners.length > 1 ? person.partners.join(', ') : person.partners && person.partners.length == 1 ? person.partners[0]: 'Yok'}</td></tr>
            <tr class="personInfo"><td>Anne - Baba:</td><td>${formatClickableNames(person.parents)}</td></tr>
            <tr class="personInfo"><td>Çocukları:</td><td>${formatClickableNames(person.children)}</td></tr>
        `;

        // Set the content of the table
        personInfoTable.innerHTML = tableContent;

        // Attach event listeners to the clickable links
        attachClickEvents(person.parents);
        attachClickEvents(person.children);
    } else {
        console.error('Person not found');
    }
}

// Function to format names as clickable links
function formatClickableNames(ids) {
    return ids
        ? ids.map(id => Number(id) || id == 0 ? `<a href="#" class="personLink" data-id="${id}">${getNameById(id)}</a>`: id).join(', ')
        : 'Yok';
}

// Function to attach click events to clickable links
function attachClickEvents(ids) {
    const personLinks = document.querySelectorAll('.personLink');
    personLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const clickedId = event.target.dataset.id;
            displayPersonDetails(Number(clickedId));
        });
    });
}

// Function to get the name by ID
function getNameById(id) {
    const person = peopleData.find(p => p.id === id);
    return person ? `${person.name} ${person.surname}` : 'Unknown';
}
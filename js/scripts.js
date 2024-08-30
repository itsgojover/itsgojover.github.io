// main.js

let peopleData = [];
let selectedIndex = -1; // To keep track of the selected suggestion

async function fetchPeopleData() {
    try {
        const response = await fetch('./data/people.json');
        const data = await response.json();
        peopleData = data;
    } catch (error) {
        console.error('Error fetching people data:', error);
    }
}

function searchPeople(query) {
    const suggestionsContainer = document.getElementById('suggestions');

    if (query.length >= 2) {
        const matchingPeople = peopleData.filter(person => {
            const fullName = `${person.name} ${person.surname}`;
            return fullName.toLowerCase().startsWith(query.toLowerCase());
        });

        suggestionsContainer.innerHTML = '';

        const suggestionHeader = document.createElement('li');
        suggestionHeader.value = '0';
        const nameHeader = document.createElement('div');
        nameHeader.className = 'name';
        nameHeader.textContent = `Adı - Soyadı`;

        const birthYearHeader = document.createElement('div');
        birthYearHeader.className = 'birth-year';
        birthYearHeader.textContent = "Doğum Yılı";

        const parentsHeader = document.createElement('div');
        parentsHeader.className = 'parents';
        parentsHeader.textContent = `Annesi - Babası`;

        suggestionHeader.appendChild(nameHeader);
        suggestionHeader.appendChild(birthYearHeader);
        suggestionHeader.appendChild(parentsHeader);
        suggestionsContainer.appendChild(suggestionHeader);

        if (matchingPeople.length === 0) {
            const noMatchItem = document.createElement('li');
            noMatchItem.textContent = 'Bulunamadı';
            suggestionsContainer.appendChild(noMatchItem);
        } else {
            matchingPeople.forEach((person, index) => {
                const suggestionItem = document.createElement('li');
                suggestionItem.value = `${person.id}`;

                const nameDiv = document.createElement('div');
                nameDiv.className = 'name';
                nameDiv.textContent = `${person.name} ${person.surname ? person.surname : "(Soyadı yok)"}`;

                const birthYearDiv = document.createElement('div');
                birthYearDiv.className = 'birth-year';
                birthYearDiv.textContent = person.birthday ? `${person.birthday.substring(0, 4)}` : 'Bilinmiyor';

                const parentsDiv = document.createElement('div');
                parentsDiv.className = 'parents';
                parentsDiv.textContent = `${person.parents ? getParentsNameById(person.id).join(' / ') : 'Bilinmiyor'}`;

                suggestionItem.appendChild(nameDiv);
                suggestionItem.appendChild(birthYearDiv);
                suggestionItem.appendChild(parentsDiv);

                suggestionItem.addEventListener('click', () => selectSuggestion(person.id));
                suggestionItem.addEventListener('mouseenter', () => highlightSuggestion(index + 1));
                suggestionsContainer.appendChild(suggestionItem);
            });
        }

        suggestionsContainer.style.display = "block";
    } else {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = "none"; // Hide the suggestions container
        selectedIndex = -1; // Reset the selected index
        return;
    }
}


function getParentsNameById(id) {
    const parents = peopleData.find(p => p.id === id).parents;

    return parents
        ? parents.map(id => Number(id) || id == 0 ? `${getNameById(id)}`: null).filter(n => n)
        : 'Yok';
}

function selectSuggestion(id) {
    const selectedPerson = peopleData.find(person => person.id === id);
    const suggestionsContainer = document.getElementById('suggestions');

    if (selectedPerson) {
        const fullName = `${selectedPerson.name} ${selectedPerson.surname ? selectedPerson.surname : "(Soyadı yok)"}`;
        document.getElementById('search').value = fullName;

        displayPersonDetails(id);
        
        suggestionsContainer.innerHTML = ""
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
    const suggestionsCount = suggestions.length;

    if (event.key === 'ArrowDown' && selectedIndex < suggestionsCount - 1) {
        event.preventDefault(); // Prevent scrolling the page
        selectedIndex = (selectedIndex + 1) % suggestionsCount;
    } else if (event.key === 'ArrowUp' && selectedIndex > 0) {
        event.preventDefault(); // Prevent scrolling the page
        selectedIndex = (selectedIndex - 1 + suggestionsCount) % suggestionsCount;
    } else if (event.key === 'Enter' && selectedIndex !== -1) {
        event.preventDefault(); // Prevent submitting the form
        const suggestionsContainer = document.getElementById('suggestions');
        const listItems = suggestionsContainer.getElementsByTagName('li');
        selectSuggestion(listItems[selectedIndex].value);
    }
    
    const suggestionsList = document.getElementById('suggestions');

    // Scroll to the highlighted suggestion 
    const highlightedSuggestion = suggestions[selectedIndex]; 
    const scrollTop = suggestionsList.scrollTop;
    const clientHeight = suggestionsList.clientHeight; 

    // If the highlighted item is out of view, scroll
    if (highlightedSuggestion.offsetTop + highlightedSuggestion.offsetHeight > scrollTop + clientHeight) {
        suggestionsList.scrollTop = highlightedSuggestion.offsetTop + highlightedSuggestion.offsetHeight - clientHeight;
    } else if (highlightedSuggestion.offsetTop < scrollTop) {
        suggestionsList.scrollTop = highlightedSuggestion.offsetTop; 
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
            <tr class="personInfo"><td>${person.partners ? (person.partners.length > 1 ? 'Eşleri' : "Eşi") : "Eşi"}:</td><td>${formatClickableNames(person.partners)}</td></tr>
            <tr class="personInfo"><td>Anne - Baba:</td><td>${formatClickableNames(person.parents)}</td></tr>
            <tr class="personInfo"><td>Çocukları:</td><td>${formatClickableNames(person.children)}</td></tr>
        `;

        // Set the content of the table
        personInfoTable.innerHTML = tableContent;

        // Attach event listeners to the clickable links
        attachClickEvents(person.parents);
        attachClickEvents(person.children);

        // Make the personDetails box visible
        showPersonDetails();
    } else {
        console.error('Person not found');
    }
}

// Function to show person details
function showPersonDetails() {
    const personDetailsBox = document.getElementById('personDetails');
    personDetailsBox.classList.add('show'); // Use class toggle instead of display
}

// Function to close person details
function closePersonDetails() {
    const personDetailsBox = document.getElementById('personDetails');
    personDetailsBox.classList.remove('show'); // Use class toggle
    document.getElementById('search').value = "";
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
            closePersonDetails()
            setTimeout(() => {
                const clickedId = event.target.dataset.id;
                document.getElementById('search').value = getNameById(Number(clickedId));
                displayPersonDetails(Number(clickedId));
            }, 300);
        });
    });
}

// Function to get the name by ID
function getNameById(id) {
    const person = peopleData.find(p => p.id === id);
    return person ? `${person.name} ${person.surname ? person.surname : "(Soyadı yok)"}` : 'Unknown';
}

function setCardAspectRatios() {
    const cards = document.querySelectorAll('.card');
    const aspectRatio = 8.4 / 5.2; // Desired aspect ratio

    cards.forEach(card => {
      const cardWidth = card.offsetWidth; // Get the actual card width
      card.style.height = `${cardWidth / aspectRatio}px`; // Calculate & set height
    });
  }

  // Call the function initially to set the ratios on page load
  setCardAspectRatios();

  // Call the function on window resize
  window.addEventListener('resize', setCardAspectRatios);


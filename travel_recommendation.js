// script.js

// Timezone mapping for popular destinations
const timeZoneMap = {
    "Sydney, Australia": "Australia/Sydney",
    "Queensland, Australia": "Australia/Brisbane",
    "Paris, France": "Europe/Paris",
    "Cusco Region, Peru": "America/Lima",
    "Bali, Indonesia": "Asia/Makassar",
    "Arizona, USA": "America/Phoenix",
    "Cyclades, Greece": "Europe/Athens",
    "Agra, India": "Asia/Kolkata",
    "Alberta, Canada": "America/Edmonton",
    // Add more as needed
};

async function performSearch() {
    let query = document.getElementById('searchInput').value.trim();
    
    if (!query) {
        alert("Please enter a keyword like: beach, temple, or country");
        return;
    }

    const resultsSection = document.getElementById('resultsSection');
    const resultsGrid = document.getElementById('resultsGrid');
    const resultsTitle = document.getElementById('resultsTitle');

    resultsSection.style.display = 'block';
    resultsGrid.innerHTML = '<p style="text-align:center; padding:50px;">Loading recommendations...</p>';

    try {
        const response = await fetch('travel_recommendation_api.json');
        if (!response.ok) throw new Error('Data not found');

        const data = await response.json();
        const searchTerm = query.toLowerCase();

        let filteredResults = [];

        if (searchTerm.includes('beach')) {
            filteredResults = data.recommendations.filter(item => 
                item.description.toLowerCase().includes('beach') || 
                item.name.toLowerCase().includes('beach')
            );
            resultsTitle.textContent = "🏖️ Beach Destinations";
        } 
        else if (searchTerm.includes('temple')) {
            filteredResults = data.recommendations.filter(item => 
                item.name.toLowerCase().includes('temple') || 
                item.description.toLowerCase().includes('temple')
            );
            resultsTitle.textContent = "⛩️ Temple Destinations";
        } 
        else if (searchTerm.includes('country')) {
            filteredResults = data.recommendations;
            resultsTitle.textContent = "🌍 Country Recommendations";
        } 
        else {
            filteredResults = data.recommendations.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.location.toLowerCase().includes(searchTerm)
            );
            resultsTitle.textContent = `Results for "${query}"`;
        }

        if (filteredResults.length === 0) {
            resultsGrid.innerHTML = `<p style="text-align:center; padding:60px;">No results found.</p>`;
            return;
        }

        resultsGrid.innerHTML = '';

        filteredResults.forEach(place => {
            const card = document.createElement('div');
            card.className = 'result-card';
            
            const timeZone = timeZoneMap[place.location] || "UTC";
            const currentTime = getLocalTime(timeZone);

            card.innerHTML = `
                <img src="${place.imageUrl}" alt="${place.name}">
                <div class="card-content">
                    <h3>${place.name}</h3>
                    <p class="location">${place.location}</p>
                    <p class="description">${place.description}</p>
                    <div class="time-info">
                        <small>🕒 Current Time: <strong>${currentTime}</strong></small>
                    </div>
                    <span class="category">${place.category}</span>
                </div>
            `;
            resultsGrid.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        resultsGrid.innerHTML = `<p style="color:red; text-align:center; padding:60px;">Failed to load recommendations.</p>`;
    }
}

// Function to get current time in specific timezone
function getLocalTime(timeZone) {
    try {
        const options = {
            timeZone: timeZone,
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return new Date().toLocaleTimeString('en-US', options);
    } catch (e) {
        return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }
}

// Clear Button
function resetSearch() {
    document.getElementById('searchInput').value = '';
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) resultsSection.style.display = 'none';
}
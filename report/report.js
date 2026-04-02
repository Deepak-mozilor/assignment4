const cityDropdown = document.getElementById('city-select');


async function loadCities() {
    try {
        const response = await fetch('http://127.0.0.1:8000/cities',{
            method: 'GET',
            credentials : 'include'
        });
        const cities = await response.json(); 

        cityDropdown.innerHTML = '<option value="" disabled selected>Select a city...</option>';

        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            
            option.textContent = city.charAt(0).toUpperCase() + city.slice(1);
            
            cityDropdown.appendChild(option);
        });

    } catch (error) {
        console.error("Error fetching cities for dropdown:", error);
    }
}

loadCities();


cityDropdown.addEventListener('change', async (event) => {
    const selectedCity = event.target.value;
    const reportBody = document.querySelector('.report-body');

    if (!selectedCity) return; 

    try {
        const response = await fetch('http://127.0.0.1:8000/report', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            credentials:'include',
            body: JSON.stringify({ city: selectedCity }) 
        });


        const report = await response.json();
        console.log("Success! Server responded with:", report);


        reportBody.innerHTML = '';


        report.forEach(record => {
            const div = document.createElement('div');
            div.className = 'record-card';

            div.innerHTML = `
                <h3>${record.city}</h3>
                <p>Temp: ${record.temperature}°C</p>
                <p>Feels: ${record.feels}°C</p>
                <p>Humidity: ${record.humidity}%</p>
                <p>Wind: ${record.wind} km/h</p>
                <p>Latitude: ${record.latitude}</p>
                <p>Longitude: ${record.longitude}</p>
                <p>Time: ${record.time}</p>
            `;
            reportBody.appendChild(div);
        });

    } catch (error) {
        console.error("Error sending city to backend:", error);
    }
});



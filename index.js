const tmi = require('tmi.js');
const axios = require('axios');
const dotenv = require('dotenv');
const oauth = require('./modules/oauth');

dotenv.config();

const client = new tmi.Client({
    connection: {
        cluster: 'aws',
        timeout: 2000,
        reconnect: true
    },
	options: { debug: true },
	identity: {
		username: 'marsayelinaskeri',
		password: 'oauth:?token?'
	},
	channels: [ 'marsayel' ]
});

oauth.refreshLoop(client);

client.on('message', (channel, tags, message, self) => {
	if(self) return;

	if(message.toLowerCase() === 'sa' || message.toLowerCase() === 'slm' || message.toLowerCase().startsWith('sa ') || message.toLowerCase().startsWith('slm ') || message.toLowerCase().startsWith('merhaba')  || message.toLowerCase().startsWith('selam')) {
		client.say(channel, `@${tags.username} merhaba hoş geldin`);
	}
	if(message.toLowerCase() === '!uwu') {
		client.say(channel, 'marsay1Uwuraze marsay1Uwuraze marsay1Uwuraze marsay1Uwuraze marsay1Uwuraze');
	}
    if(message.toLowerCase() == '!love') {
		client.say(channel, '.me Doğru kullanım: !love @Ahmet veya !love @Ahmet @Mehmet');
	}
    if(message.toLowerCase().startsWith('!love ')) {
		const msgTokens = message.split(' ');
        if(msgTokens.length == 2){
            let target = msgTokens[1];
            if(target.startsWith('@')){
                target = target.slice(1);
            }
            let loveRate = Math.floor(Math.random()*101);
            client.say(channel, `${tags['display-name']} <3 ${target} = %${loveRate}`);
        }
        else if(msgTokens.length == 3){
            let target1 = msgTokens[1];
            let target2 = msgTokens[2];
            if(target1.startsWith('@')){
                target1 = target1.slice(1);
            }
            if(target2.startsWith('@')){
                target2 = target2.slice(1);
            }
            let loveRate = Math.floor(Math.random()*101);
            client.say(channel, `${target1} <3 ${target2} = %${loveRate}`);
        }
        else{
            client.say(channel, '.me Doğru kullanım: !love @Ahmet veya !love @Ahmet @Mehmet');
        }
	}
    if(message.toLowerCase() === '!rank'){
        axios.get('https://api.kyroskoh.xyz/valorant/v1/mmr/EU/Marsayel/Marsu?show=combo&display=0')
            .then(function (response) {
                console.log(response.data);
                client.say(channel, response.data);
            })
            .catch(function (error) {
                console.log(error);
                client.say(channel, "Bir hatayla karşılaştım, lütfen daha sonra tekrar sor.");
            });
    }
    if(message.toLowerCase().startsWith("@marsayelinaskeri ") || message.toLowerCase().startsWith("marsayelinaskeri ")){
        if(message.includes("naber") || message.includes(" nbr") || message.includes("nasılsın")){
            client.say(channel, "İyi senden");
        }
        if(message.includes("ben") && message.includes("de") && message.includes("iyi")){
            client.say(channel, "Allah iyilik versin");
        }
    }
});
		
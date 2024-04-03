const express = require('express');
const query = require('samp-query');
const axios = require('axios');
const app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

let danbotTotal = 0;
let luciferTotal = 0;
let messagea = null;

async function sendDiscordWebhook(ip, target, port, user, lex) {
  try {
    const webhookURL = 'https://discord.com/api/webhooks/1225003664213676153/xbY_yvnKIMA2YdJ46Yn2KGUstXvNoNV-chhtDDTjaNGvqsL697IEoQ0KsEHu8bsMFeub';
    const currentTime = new Date().toISOString();
    const ipInfoResponse = await axios.get(`http://ip-api.com/json/${ip}`);
    const ipInfo = ipInfoResponse.data;
    const thumbnailURL = 'https://media.discordapp.net/attachments/1131863621937418241/1225009104825614367/imresizer-1712134141961.jpg?ex=661f91a2&is=660d1ca2&hm=88ba42aca20e9a782adc25ab78205b452902b14c3ae50e1881dc913f30e289b2&=&format=webp';
    const finalUser = (user === 'lucifer') ? 'lexsamp' : (user === 'danbot') ? 'Danxz' : user;
    const response = await axios.post(webhookURL, {
      embeds: [{
        title: '🤖 | SAMP API - GUARD NETWORK',
        description: `**Access Logs**\n**USERNAME: ${finalUser}**\n**IP: ${ip}**\n**Country: ${ipInfo.country}**\n**Region: ${ipInfo.regionName}**\n**City: ${ipInfo.city}**\n\n**To Destination**\n**SERVER NAME: ${lex}**\n**IP: ${target}**\n**PORT: ${port}**\n`,
        color: 0x03ffb4,
        timestamp: currentTime,
        thumbnail: {
          url: thumbnailURL
        },
        footer: {
          text: '© DEV.LEXSAMP | GUARD-NETWORK'
        }
      }]
    });
    console.log('Webhook sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending webhook:', error.message);
  }
}

async function sendAccount(totallex, totalbot) {
  try {
    const webhookURL = 'https://discord.com/api/webhooks/1225044993501302784/M_fr5bWBocEJOkEnIQOY3AYjyh_9J3IVjRoUY2RE82QjoDQrogitqmUM1-bp11SqYyrD';
    const currentTime = new Date().toISOString();
    const thumbnailURL = 'https://media.discordapp.net/attachments/1131863621937418241/1225009104825614367/imresizer-1712134141961.jpg?ex=661f91a2&is=660d1ca2&hm=88ba42aca20e9a782adc25ab78205b452902b14c3ae50e1881dc913f30e289b2&=&format=webp';
    
    let payload = {
      embeds: [{
        title: '👽 | SAMP API - GUARD NETWORK',
        description: `**__ACCOUNT LIST__**\n\n**• LEXSAMP**\n**TOTAL USED: ${totallex}**\n\n**• Danxz**\n**TOTAL USED: ${totalbot}**\n\n`,
        color: 0x03ffb4,
        timestamp: currentTime,
        thumbnail: {
          url: thumbnailURL
        },
        footer: {
          text: '© DEV.LEXSAMP | GUARD-NETWORK'
        }
      }]
    };
    
    if (!messagea) {
      const response = await axios.post(webhookURL, payload);
      messagea = response.data.id;
    } else {
      await axios.patch(`${webhookURL}/messages/${messagea}`, payload);
    }
    console.log('Webhook sent successfully');
  } catch (error) {
    console.error('Error sending webhook:', error.message);
  }
}

app.get('/lex/samp', function (req, res) {
    const ip = req.query.ip;
    const port = req.query.port;
    const user = req.query.user;
    
    if (!user || (user !== 'lucifer' && user !== 'danbot')) {
        return res.status(403).json({'error': 'Forbidden. Invalid or missing user parameter. Please provide a valid user!'});
    }
    
    if(user === 'danbot') {
        danbotTotal++;
    } else if(user === 'lucifer') {
        luciferTotal++;
    }
    sendAccount(luciferTotal, danbotTotal);

    const Serverip = `${ip}:${port}`;
    const users = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var options = {
        host: ip,
        port: port
    };
    query(options, function (error, response) {
        if(error) {
            res.status(404).json({'error': 'Something Went Wrong Please Check ip And port correcly or Please Try Again Later'});
        } else {
            const ServerName = response["hostname"];
            sendDiscordWebhook(users, ip, port, user, ServerName);
          
            function createStrList(arr) {
              const indexLen = Math.floor(Math.log10(arr.length - 1)) + 1;
              let nameLen = 0;
  
              for (const item of arr) {
                if (item.name.length > nameLen) nameLen = item.name.length;
              }
              return arr.map((x, i) => [`${i}${" ".repeat(indexLen - `${i}`.length)} ${x.name}${" ".repeat(nameLen - x.name.length)} ${x.score}  ${x.ping}`]).slice(0,16).join("\n");
            }
            
            let Players = (createStrList(response['players']));
            res.json({'response':{'serverip': Serverip, 'address': response["address"],'serverping': response["ping"],'hostname': response["hostname"],'gamemode': response["gamemode"],'language': response["mapname"],'passworded': response["passworded"],'maxplayers': response["maxplayers"],'isPlayerOnline': response["online"],'rule': {'lagcomp': response["rules"].lagcomp,'mapname': response["rules"].mapname,'version': response["rules"].version,'weather': response["rules"].weather,'weburl': response["rules"].weburl,'worldtime': response["rules"].worldtime},'isPlayersIngame': Players}})}
    })
})

app.get('*', function(req, res){
    res.status(404).json({'®DEV.LEX': 'Welcome to Lex Bot api'});
  });

const IPS = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 7006;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${IPS} mode on port ${PORT}`
  )
);

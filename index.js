const express = require('express')
const query = require('samp-query')
const axios = require('axios');
const app = express()

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

async function sendDiscordWebhook(ip) {
  try {
    const webhookURL = 'https://discord.com/api/webhooks/1225003664213676153/xbY_yvnKIMA2YdJ46Yn2KGUstXvNoNV-chhtDDTjaNGvqsL697IEoQ0KsEHu8bsMFeub';
    const response = await axios.post(webhookURL, {
      embeds: [{
        title: 'SAMP API | GUARD NETWORK',
        description: `IP: ${ip}`,
        color: 0x00ff00
      }]
    });
    console.log('Webhook sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending webhook:', error.message);
  }
}

app.get('/lex/samp', function (req, res) {
    const ip = req.query.ip;
    const port = req.query.port;
    const Serverip = `${ip}:${port}`;

    sendDiscordWebhook(req.ip);

    var options = {
        host: ip,
        port: port
    };
    query(options, function (error, response) {
        if(error){
            res.status(404).json({'error': 'Something Went Wrong Please Check ip And port correcly or Please Try Again Later'})}
        else{
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

const PORT = process.env.PORT || 7006;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

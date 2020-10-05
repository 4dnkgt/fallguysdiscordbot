const Discord = require('discord.js')
const client = new Discord.Client();
const config = require('./config.json');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const FallGuysAPI = require("FallGuysAPI.js");
 
const config2 = {
  lang: "en",
  debug: true
};
 
const FallGuys = new FallGuysAPI(config2);

client.once('ready', async () => {
    console.log('Ready!')
    client.user.setStatus("dnd")
    client.user.setActivity('fa.', { type: 'LISTENING' });
})

client.on('message', async message => {
    if(message.author.bot) return;
    
    if(!message.content.startsWith(config.prefix)) return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "ping") {
        const m = await message.channel.send("Ping!");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
    }

    if(command === "wiki") {
        const texttosearch = args.join(" ")
        message.channel.send(`https://fallguysultimateknockout.fandom.com/wiki/${texttosearch}`)
    }

    if(command === "shop") {
        const arguments = args.join(" ")
        const params = {
            searchMethod: "full",
            name: `${arguments}`,
            lang: "en"
          };
           
          FallGuys.CosmeticsSearch(params)
          .then(async res => {
            res.forEach(async shop => {
                const embed = new MessageEmbed()
                .setTitle('Item Lookup!')
                .setColor('4fffe8')
                .addField('Item name', shop.displayName, false)
                .addField('Rarity', shop.rawrarity, false)
                .addField('Currency', shop.shop.currency, false)
                .addField('Price', shop.shop.price, false)
                .addField('Is Featured?', shop.shop.featured, false)
                .addField('Type', shop.type, false)
                .setImage(shop.image)
                .setTimestamp();
               message.channel.send(embed);
            }).catch(err => {
            console.log(err);
          });
        })
    }

    if(command === "version") {
        FallGuys.Version()
        .then(res => {
            const embed = new MessageEmbed()
            .setTitle('Game Information')
            .setColor('4fffe8')
            .addField('Version', res.currentVersion, false)
            .addField('Manifest ID', res.manifestId, false)
            .addField('Build ID', res.buildId, false)
            .addField('Build Release', res.buildRelease, false)
            .addField('Game Size (bytes)', res.gameSize, false)
            .setTimestamp();
           message.channel.send(embed);
         }).catch(err => {
           console.log(err);
         });
        }

        if(command === "featured") {
            FallGuys.Shop("en")
            .then(async res => {
                res.forEach(async shop => {
                    const embed = new MessageEmbed()
                    .setTitle(shop.displayName)
                    .setColor('4fffe8')
                    .addField('Item name', shop.displayName, false)
                    .addField('Rarity', shop.rawrarity, false)
                    .addField('Currency', shop.shop.currency, false)
                    .addField('Price', shop.shop.price, false)
                    .addField('Type', shop.type, false)
                    .setImage(shop.image)
                    .setTimestamp();
                   message.channel.send(embed);
                }).catch(err => {
                    console.log(err);
                });
            })
        }

        if(command === "help") {
            const embed = new MessageEmbed()
                    .setTitle('**Help | Commands**')
                    .setColor('4fffe8')
                    .addField('fa.featured', 'Check the featured Items in the shop!', false)
                    .addField('fa.shop', 'Item Look up <ex: fa.shop Bulletkin> ', false)
                    .addField('fa.version', 'Check the Game version and some more useful information', false)
                    .addField('fa.wiki', 'Browse the wiki!', false)
                    .addField('fa.ping', 'Pong!', false)
                    .setTimestamp();
                   message.channel.send(embed); 
        }
});

client.login(process.env.TOKEN);
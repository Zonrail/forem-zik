  const request = require('request-promise-native');
const { GOOGLE_API_KEY } = require('./anahtarlar.json');
const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json')
const YouTube = require('simple-youtube-api');
const queue = new Map(); 
const express = require('express');
const app = express();
const http = require('http');
const prefix = ayarlar.prefix;
const youtube = new YouTube(GOOGLE_API_KEY);
const ytdl = require('ytdl-core');
const token = "TOKEN";
const fs = require('fs');
const moment = require('moment');
const Jimp = require('jimp');
require('./util/eventLoader')(client);

//7 24
    app.get("/", (request, response) => {
    console.log(`Botu Aktif Etmek İçin Burdayım!`);
    response.sendStatus(200);
    });
    app.listen(process.env.PORT);
    setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 280000);

client.on('message', async msg => {

	if (msg.author.bot) return false;
	if (!msg.content.startsWith(prefix)) return false;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);
	let command = msg.content.split(' ')[0].slice(ayarlar.prefix.length);

	if (command === 'p') {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RED')
    .setDescription(' Sesli Bir Kanalda Olman Gerek! '));
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RED')
    .setTitle(' Sesli Bir Kanalda Olman Gerek! '));
		}
    
    		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); 
				await handleVideo(video2, msg, voiceChannel, true); 
			}
		if (!permissions.has('SPEAK')) {
			 return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setColor('RED')
      .setTitle('Şarkıyı Açabilmek İçin Mikrafonumun Açık Olması Lazım! '));
        }

        return msg.channel.sendEmbed(new Discord.RichEmbed)
      .setTitle(` **Oynatma Listesi: **${playlist.title}** Adlı Şarkı Kuyruğa Eklendi!** `)
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 15);
					let index = 0;
          
				 msg.channel.sendEmbed(new Discord.RichEmbed()                  
         .setTitle(' ✧Foreigns✧ Şarkı Seçimi ')
         .setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}`)
         .setFooter('Lütfen 1 ile 15 Arasında Seçim Yapınız.')
         .setColor('0x36393E'));
          msg.delete(5000)
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 16, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						 return msg.channel.sendEmbed(new Discord.RichEmbed()
            .setColor('0x36393E')
            .setDescription('<a:onaysiz:706295727176941633> **Değer Belirtmediğiniz İçin Seçim Kapatıldı**     <a:onaysiz:706295727176941633>'));
                    }
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.sendEmbed(new Discord.RichEmbed()
          .setColor('0x36393E')
          .setDescription('<a:onaysiz:706295727176941633> **Sonuç Bulamadım.** <a:onaysiz:706295727176941633>'));
                }
            }
			return handleVideo(video, msg, voiceChannel);
      
		}
   
	} else if (command === 's') {
		if (!msg.member.voiceChannel) if (!msg.member.voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RED')
    .setDescription('<a:onaysiz:706295727176941633> **Lütfen öncelikle sesli bir kanala katılınız**. <a:onaysiz:706295727176941633>'));
		if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
     .setColor('RED')
     .setTitle('<a:alevv:674875272998289410> **Sesli Kanalda Olman Gerek!** <a:alevv:674875272998289410>'));
		serverQueue.connection.dispatcher.end('<a:alevv:674875272998289410> **Müziği Geçtim!** <a:alevv:674875272998289410>');
        return msg.channel.send('<a:alevv:674875272998289410> Geçtim ve cpu kullanımını azaltmak için odadan çıktım <a:alevv:674875272998289410>');
      	
  	return undefined;
    } else if (command === 'sıra' || command === "liste" || command === "queue") {
    let index = 0;
		if (!serverQueue) return msg.channel.send(new Discord.RichEmbed()
    .setTitle(" <a:onaysiz:706295727176941633> ** Sırada Müzik Bulunmamakta** <a:onaysiz:706295727176941633>")
    .setColor('#FF0000'));
		  return msg.channel.send(new Discord.RichEmbed()
    .setColor('#FF0000')
     .setTitle('<a:alevv:674875272998289410> Şarkı Kuyruğu <a:alevv:674875272998289410>')
    .setDescription(`${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}`))
    .addField('<a:alevv:674875272998289410> Şu anda çalınan: ' + `${serverQueue.songs[0].title} <a:alevv:674875272998289410>`);
	} else if (command === 'sp') {
		if (!msg.member.voiceChannel) if (!msg.member.voiceChannel) return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setColor('RED')
    .setDescription('<a:onaysiz:706295727176941633> **Lütfen öncelikle sesli bir kanala katılınız. <a:onaysiz:706295727176941633>**'));
		if (!serverQueue) return msg.channel.sendEmbed(new Discord.RichEmbed()
     .setColor('RED')
     .setTitle('<a:onaysiz:706295727176941633> **Hiç Bir Müzik Çalmamakta** <a:onaysiz:706295727176941633>'));                                              
		msg.channel.send(`:stop_button: **${serverQueue.songs[0].title}** Adlı Müzik Kapatıldı.`);
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('**Müzik Bitti**');
		return undefined;
  }
});
//NARKOZ
async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    console.log(video);
    const song = {
        id: video.id,
        title: video.title,
        url: `https://www.youtube.com/watch?v=${video.id}`,
    durationh: video.duration.hours,
    durationm: video.duration.minutes,
        durations: video.duration.seconds,
    views: video.views,
    };
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 4,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`<a:onaysiz:706295727176941633> **Şarkı Sisteminde Problem Var Hata Nedeni: ${error}** <a:onaysiz:706295727176941633>`);
			queue.delete(msg.guild.id);
			return msg.channel.sendEmbed(new Discord.RichEmbed()
      .setTitle(`<a:onaysiz:706295727176941633> **Şarkı Sisteminde Problem Var Hata Nedeni: ${error}** <a:onaysiz:706295727176941633>`)
      .setColor('RED'))
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		return msg.channel.sendEmbed(new Discord.RichEmbed()
    .setTitle(`<a:alevv:674875272998289410> **${song.title}**  Müzik Kuyruğa Eklendi! <a:alevv:674875272998289410>`)
    .setColor('RED'))
	}
	return undefined;
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave(5000);
        queue.delete(guild.id);
        return;
    }
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === '<a:onaysiz:706295727176941633> **Yayın Akış Yeterli Değil.** <a:onaysiz:706295727176941633>') console.log('Müzik Bitti.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));

	 serverQueue.textChannel.sendEmbed(new Discord.RichEmbed()                                   
  .addField('\n<a:siren:674892462048804864> ✧Foreigns✧ Müzik Başladı <a:siren:674892462048804864>', `<a:alevv:674875272998289410> [${song.title}](${song.url}) <a:alevv:674875272998289410>`, true)
  .setColor('RED'));
} 
const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);

};


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komutlar: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};
  
client.login(ayarlar.token);

//KODLARI DEVAM ETTİREBİLİRSİN!

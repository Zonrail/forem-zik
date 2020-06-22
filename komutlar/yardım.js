const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.RichEmbed()
.setColor('RED')
.setTitle('Komutlar')
.setTimestamp()
.addField('»  Play  Şarkı Açar', 'f!p f!play f!çal')
.addField('»  Stop  Şarkıyı Kapatır', 'f!stop f!durdur')
.addField('» Skip Sıradaki Şarkıya Geçersiniz', 'f!s f!geç f!skip')
.addField('» Ses Şarkının ses seviyesi', 'f!ses f!volume')
.addField('» Çalan Çalan şarkıyı gösterir', 'f!çalan f!current f!song f!şarkı')
.addField('»  Lyrics  Belirtilen Şarkının Sözlerini Bulursunuz', 'f!lyrics')
.addField('» queue Şarkı kuyruğunu gösterir', 'f!queue f!sıra f!liste')
.addField('» Duraklat Şarkıyı durakladır', 'f!duraklat f!pause')
.addField('» Devam Şarkıyı devam ettirir', 'f!devamet f!resume')
.addField('» ***ÖNEMLİ NOT***', 'Şarkıları seçerken f!1 f!2 diye komutlar kullanmayınız! 1 2 rakamlarını kullanınız')

message.channel.send(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: false, 
  aliases: ['müzik','muzik','komutlar'], 
  permLevel: 0 
};

exports.help = {
  name: 'müzik',
  description: 'Tüm komutları gösterir.',
  usage: 'müzik'
};
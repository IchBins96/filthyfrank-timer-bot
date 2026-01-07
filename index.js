const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = '1456949856873742437';
const END_DATE = new Date('2026-01-18T00:00:00Z');

let messageId = null;

function getTimeRemaining() {
    const now = new Date();
    const diff = END_DATE - now;
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, ended: true };
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
        ended: false
    };
}

function pad(n) { return n.toString().padStart(2, '0'); }

function createEmbed() {
    const t = getTimeRemaining();
    const timer = t.ended 
        ? '# 🏆 CONTEST ENDED 🏆' 
        : `# \`${pad(t.days)}\` DAYS  |  \`${pad(t.hours)}\` HRS  |  \`${pad(t.mins)}\` MIN  |  \`${pad(t.secs)}\` SEC`;
    return new EmbedBuilder()
        .setTitle('🏆 WinYourSkin Contest 🏆')
        .setDescription('Grind every level and push your high scores to the absolute limit. Every point counts. When the weekly timer hits zero, all highscores across all levels will be combined into one final total.\n\nThe player with the highest overall score claims victory, earns eternal bragging rights, and wins an exclusive personalized skin, custom-designed together with the champion.\n\n**No mercy. No excuses. Clean the leaderboard.** 🔥\n\n' + timer)
        .setColor(0xFC7D00)
        .setImage('https://cdn.discordapp.com/attachments/1456754946799304756/1457136694892564571/ffpodest.png');
}

async function updateTimer() {
    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        const embed = createEmbed();
        if (messageId) {
            try { 
                const msg = await channel.messages.fetch(messageId); 
                await msg.edit({ embeds: [embed] }); 
            } catch { 
                const m = await channel.send({ embeds: [embed] }); 
                messageId = m.id; 
            }
        } else { 
            const m = await channel.send({ embeds: [embed] }); 
            messageId = m.id; 
        }
    } catch (e) { console.error(e); }
}

client.once('ready', () => { 
    console.log('Bot online'); 
    updateTimer(); 
    setInterval(updateTimer, 1000); 
});

client.login(BOT_TOKEN);

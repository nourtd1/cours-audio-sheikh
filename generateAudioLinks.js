const fs = require('fs');
const path = require('path');

const audioDir = path.join(__dirname, 'public', 'audio');
const baseUrl = 'https://cdn.jsdelivr.net/gh/nourtd1/cours-audio-sheikh@main/public/audio/';

const files = fs.readdirSync(audioDir);

const data = files
  .filter(file => file.endsWith('.mp3'))
  .map((file, idx) => ({
    titre: `Cours ${idx + 1}`,
    url: baseUrl + encodeURIComponent(file).replace(/%2F/g, '/')
  }));

fs.writeFileSync('audioFiles.json', JSON.stringify(data, null, 2), 'utf8');
console.log('audioFiles.json généré avec succès !');
const fs = require('fs');

const scores = JSON.parse(fs.readFileSync('./scores.json', 'utf8'));

// 生成 CSV 头部
let csv = 'imageId,score,timestamp\n';

scores.forEach(item => {
    csv += `${item.imageId},${item.score},${item.timestamp}\n`;
});

fs.writeFileSync('scores.csv', csv, 'utf8');
console.log('Exported scores.csv');
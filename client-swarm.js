let N = process.argv[2];
const child_process = require('child_process');

for ( ;N > 0; N--) {
    console.log(`number: ${N}`);
    child_process.exec('node client.js', (error, stdout, stderr) => {
        if (error) console.error(`exec error: ${error}`);
        console.log(`----------------------------------\n${stdout}`);
    });
}
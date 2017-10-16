const net = require('net');
const fs = require('fs');
const shuffle = require('shuffle-array');
const port = 8124;
const string = 'QA';
const bad = 'DEC';
const good = 'ACK';
let currentIndex = -1;
let questions = [];

const client = new net.Socket();
client.setEncoding('utf8');

client.connect({port: port, host: '127.0.0.1'}, (err) => {
  if(err) console.error("Соединение не установлено");
  fs.readFile("qa.json", (err, text) => {
      if (err) console.error("Невозможно прочитать файл")
      else {
          questions = JSON.parse(text);
          shuffle(questions);
          client.write(string);
      }
  });
});

client.on('data', (data) => {
    if (data === bad)
        client.destroy();
    if (data === good)
        sendQuestion();
    else {
        let qst = questions[currentIndex];
        let answer = qst.good;
        console.log('\n' + qst.question);
        console.log('Answer: ' + data);
        console.log("Server's answer: " + answer);
        console.log('Result: ' + (data === answer ? 'Right answer!': 'Wrong answer!'));
        sendQuestion();
    }
});

client.on('close', function () {
    console.log('Connection closed');
});

function sendQuestion() {
    if (currentIndex < questions.length - 1) {
        let qst = questions[++currentIndex].question;
        client.write(qst);
    }
    else
        client.destroy();
}
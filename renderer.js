// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { SerialPort, ReadlineParser } = require('serialport')

const port = new SerialPort({
  path: "COM7",
  baudRate: 115200,
})

const { path } = port
console.log(`Port ${path} oppened!`)

port.write('R')

const parser = new ReadlineParser()
port.pipe(parser)
var dataRecieved = "";
parser.on('data', dataRecieved =>{  
  console.log(dataRecieved)
  var startIndex = dataRecieved.indexOf('<');
  var endIndex = dataRecieved.indexOf('>', startIndex);
  var dadosSerialTratados = dataRecieved.substring(startIndex + 2, endIndex - startIndex - 1);
  var leituraArray = dadosSerialTratados.split(',');
  console.log(leituraArray)
  document.getElementById('value1').innerText = leituraArray[0].replace('V: ','')
  document.getElementById('value2').innerText = leituraArray[1].replace('T: ','')
  document.getElementById('value3').innerText = leituraArray[2].replace('C: ','')
  document.getElementById('value4').innerText = leituraArray[3].replace('S: ','')
})


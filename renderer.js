// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { SerialPort, ReadlineParser } = require('serialport')

// const port = new SerialPort({
//  path: "COM7",
//  baudRate: 115200,
//  })

var portOpened = '';
var port = null;
SerialPort.list().then((ports) => {
  for(var i = 0; i < ports.length; i++) {
        const newDiv = document.createElement("button")
        newDiv.setAttribute("class","dropdown-item")
        newDiv.setAttribute("type","button")        
        const newContent = document.createTextNode(`${ports[i]["path"]} , ${ports[i]["manufacturer"]}`);
        newDiv.appendChild(newContent);
        // add the newly created element and its content into the DOM
        const parentDiv = document.getElementById("ports-list")
        const currentDiv = document.getElementById("list");
        parentDiv.insertBefore(newDiv, currentDiv);      
  }  
})

document.getElementById('dropdownMenu2').addEventListener('click',() => {
  const portList = document.getElementsByClassName('dropdown-item')  
  var portResults = '';
  for(var i = 0; i < portList.length; i++) {
    portResults += portList[i].innerHTML
    portList[i].setAttribute('onclick', `portSelected(${i})`)
  }
  })

function portSelected(portIndex){
  console.log(portIndex)
  const portList = document.getElementsByClassName('dropdown-item')[portIndex].innerHTML 
  console.log(portList)  
  var comPort = portList.slice(0, (portList.indexOf(',')))
  console.log(comPort)
  document.getElementById('com-port').innerHTML = comPort
}

async function serialService(){
  const portSelected = document.getElementById('com-port').innerHTML  
  if(portSelected === '') {
    return //TODO err msg
  } 
  if(!portOpened){
    port = await new SerialPort({
      path: portSelected,
      baudRate: 115200,
    }) 
    portOpened = true;
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
    /*leituraArray anatomy
    leituraArray[0] ->  V: xxxxx = Voltage being read
    leituraArray[1] ->  T: xxxxx = Time elapsed
    leituraArray[2] ->  C: xxxxx = Total charge cycles 
    leituraArray[3] ->  S: xxxxx = Charge status
    leituraArray[4] ->  CFG1: xxxxx = minimum/start voltage
    leituraArray[5] ->  CFG2: xxxxx = max/end voltage
    leituraArray[6] ->  CFG3: xxxxx = max/limit charge time
    leituraArray[7] ->  CFG4: xxxxx = system current mode
    */
    document.getElementById('value1').innerText = leituraArray[0].replace('V: ','') + " V"
    document.getElementById('value2').innerText = leituraArray[1].replace('T: ','')
    document.getElementById('value3').innerText = leituraArray[2].replace('C: ','')
    document.getElementById('value4').innerText = leituraArray[3].replace('S: ','')
    // Progress bar call  
    progressUpdate(
      leituraArray[0].replace('V: ',''),
      leituraArray[4].replace('CFG1: ',''),
      leituraArray[5].replace('CFG2: ','')
    )
    // Config display call
    cfgDisplay(
      leituraArray[4].replace('CFG1: ',''),
      leituraArray[5].replace('CFG2: ',''),
      leituraArray[6].replace('CFG3: ',''),
      leituraArray[7].replace('CFG4: ','')
    )
  })

  function cfgDisplay(minVoltageCfg, maxVoltageCfg, maxTimeCfg, systemMode){
    document.getElementById('value5').innerText = minVoltageCfg + " V"
    document.getElementById('value6').innerText = maxVoltageCfg + " V"
    document.getElementById('value7').innerText = maxTimeCfg + " Horas"
    // System mode descripton
    // System mode 0 = Default do sistema
    // System mode 1 = Modo Automatico
    // System mode 2 = Modo Tracionario
    // System mode 3 = Modo Bloqueador
    switch(systemMode){
      case "0":
        systemMode = "Contador pré carga - iniciando..."
        break;

      case "1":
        systemMode = "Automático"
        break;

      case "2":
        systemMode = "Tracionário"
        break;

      case "3":
        systemMode = "Bloqueador"
        break;

      default:
        systemMode = "erro"
      break;
    }
    document.getElementById('value8').innerText = systemMode
  }

  function progressUpdate(voltageValue, minVoltageCfg, maxVoltageCfg){
    console.log(voltageValue)
    let voltageParsed = parseFloat(voltageValue)
    let chargePercent = 0;
    let chargeRange = maxVoltageCfg - minVoltageCfg
    voltageParsed -= minVoltageCfg
    chargePercent = voltageParsed / chargeRange
    console.log(chargePercent)
    chargePercent *= 100
    chargePercent = Math.round(chargePercent)
    if(chargePercent <= 0) {
      chargePercent = 0;
    } else if(chargePercent <= 25) {
      document.getElementsByClassName('progress-bar')[0].style.backgroundColor = "#fac71e"
      document.getElementsByClassName('progress-bar')[0].style.color = "white"
    } else if(chargePercent <= 50){
      document.getElementsByClassName('progress-bar')[0].style.backgroundColor = "#f3fa1e"   
      document.getElementsByClassName('progress-bar')[0].style.color = "white"
    } else if(chargePercent <= 75){
      document.getElementsByClassName('progress-bar')[0].style.backgroundColor = "#a9fa1e"    
      document.getElementsByClassName('progress-bar')[0].style.color = "white"
    } else if(chargePercent <= 100){
      document.getElementsByClassName('progress-bar')[0].style.backgroundColor = "#43fa1e"    
      document.getElementsByClassName('progress-bar')[0].style.color = "white"
    } else if(chargePercent >= 100) {
      chargePercent = 100
      document.getElementsByClassName('progress-bar')[0].style.backgroundColor = "#1efae4"
      document.getElementsByClassName('progress-bar')[0].style.color = "white"
    }
    chargePercent += "%"   
    console.log(chargePercent)
    document.getElementsByClassName('progress-bar')[0].innerHTML = chargePercent     
    document.getElementsByClassName('progress-bar')[0].style.width = chargePercent 

  }

}    
}

document.getElementById('com-open').addEventListener('click', serialService)
// const { path } = port
// console.log(`Port ${path} oppened!`)
// console.log(port.isOpen)
// if(port.isOpen){
//   port.write('R')

//   const parser = new ReadlineParser()
//   port.pipe(parser)
//   var dataRecieved = "";
//   parser.on('data', dataRecieved =>{  
//     console.log(dataRecieved)
//     var startIndex = dataRecieved.indexOf('<');
//     var endIndex = dataRecieved.indexOf('>', startIndex);
//     var dadosSerialTratados = dataRecieved.substring(startIndex + 2, endIndex - startIndex - 1);
//     var leituraArray = dadosSerialTratados.split(',');
    
//     console.log(leituraArray)
//     /*leituraArray anatomy
//     leituraArray[0] ->  V: xxxxx = Voltage being read
//     leituraArray[1] ->  T: xxxxx = Time elapsed
//     leituraArray[2] ->  C: xxxxx = Total charge cycles 
//     leituraArray[3] ->  S: xxxxx = Charge status
//     leituraArray[4] ->  CFG1: xxxxx = minimum/start voltage
//     leituraArray[5] ->  CFG2: xxxxx = max/end voltage
//     leituraArray[6] ->  CFG3: xxxxx = max/limit charge time
//     leituraArray[7] ->  CFG4: xxxxx = system current mode
//     */
//     document.getElementById('value1').innerText = leituraArray[0].replace('V: ','') + " V"
//     document.getElementById('value2').innerText = leituraArray[1].replace('T: ','')
//     document.getElementById('value3').innerText = leituraArray[2].replace('C: ','')
//     document.getElementById('value4').innerText = leituraArray[3].replace('S: ','')
//     // Progress bar call  
//     progressUpdate(
//       leituraArray[0].replace('V: ',''),
//       leituraArray[4].replace('CFG1: ',''),
//       leituraArray[5].replace('CFG2: ','')
//     )
//     // Config display call
//     cfgDisplay(
//       leituraArray[4].replace('CFG1: ',''),
//       leituraArray[5].replace('CFG2: ',''),
//       leituraArray[6].replace('CFG3: ',''),
//       leituraArray[7].replace('CFG4: ','')
//     )
//   })

//   function cfgDisplay(minVoltageCfg, maxVoltageCfg, maxTimeCfg, systemMode){
//     document.getElementById('value5').innerText = minVoltageCfg + " V"
//     document.getElementById('value6').innerText = maxVoltageCfg + " V"
//     document.getElementById('value7').innerText = maxTimeCfg + " Horas"
//     // System mode descripton
//     // System mode 0 = Default do sistema
//     // System mode 1 = Modo Automatico
//     // System mode 2 = Modo Tracionario
//     // System mode 3 = Modo Bloqueador
//     switch(systemMode){
//       case "0":
//         systemMode = "Contador pré carga - iniciando..."
//         break;

//       case "1":
//         systemMode = "Automático"
//         break;

//       case "2":
//         systemMode = "Tracionário"
//         break;

//       case "3":
//         systemMode = "Bloqueador"
//         break;

//       default:
//         systemMode = "erro"
//       break;
//     }
//     document.getElementById('value8').innerText = systemMode
//   }

//   function progressUpdate(voltageValue, minVoltageCfg, maxVoltageCfg){
//     console.log(voltageValue)
//     let voltageParsed = parseFloat(voltageValue)
//     let chargePercent = 0;
//     let chargeRange = maxVoltageCfg - minVoltageCfg
//     voltageParsed -= minVoltageCfg
//     chargePercent = voltageParsed / chargeRange
//     console.log(chargePercent)
//     chargePercent *= 100
//     chargePercent = Math.round(chargePercent)
//     if(chargePercent <= 0) {
//       chargePercent = 0;
//     } else if(chargePercent <= 25) {
//       document.getElementsByClassName('progress-bar')[0].style.backgroundColor = "#fac71e"
//       document.getElementsByClassName('progress-bar')[0].style.color = "white"
//     } else if(chargePercent <= 50){
//       document.getElementsByClassName('progress-bar')[0].style.backgroundColor = "#f3fa1e"   
//       document.getElementsByClassName('progress-bar')[0].style.color = "white"
//     } else if(chargePercent <= 75){
//       document.getElementsByClassName('progress-bar')[0].style.backgroundColor = "#a9fa1e"    
//       document.getElementsByClassName('progress-bar')[0].style.color = "white"
//     } else if(chargePercent <= 100){
//       document.getElementsByClassName('progress-bar')[0].style.backgroundColor = "#43fa1e"    
//       document.getElementsByClassName('progress-bar')[0].style.color = "white"
//     } else if(chargePercent >= 100) {
//       chargePercent = 100
//       document.getElementsByClassName('progress-bar')[0].style.backgroundColor = "#1efae4"
//       document.getElementsByClassName('progress-bar')[0].style.color = "white"
//     }
//     chargePercent += "%"   
//     console.log(chargePercent)
//     document.getElementsByClassName('progress-bar')[0].innerHTML = chargePercent     
//     document.getElementsByClassName('progress-bar')[0].style.width = chargePercent 

//   }
// }
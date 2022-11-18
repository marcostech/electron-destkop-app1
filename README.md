# Desktop Dashboard Serial-APP: utilizando Electron JS
## Usando a biblioteca Node SerialPort para comunicação serial
## Caracteristicas: 
### Sistema roda primariamente em windows(necessário teste em outros SO's)
### Usuario pode escolher a porta COM a ser aberta e lida em tempo real
### Sistema lê os dados da placa MUF800R00 (ou Arduino)
#### Necessário respeitar codificação dos dados enviados pela serial
### TODO: função close, refresh/retry, comunicação bluetooth/wifi
### Abaixo sistema rodando 
![alt text](img1.jpeg)
![alt text](img2.jpeg)

<h1 align="center">
  <br>
  <a href="#"><img src="./buildResources/battery.png" alt="Monitor de Carga" width="200"></a>
  <br>
  Monitor de carga V0
  <br>
</h1>

<h4 align="center">Leitor Serial para uso em conjuto com sistema Arduino usando <a href="http://electronjs.org" target="_blank">ElectronJS</a>.</h4>

<p align="center">
  <a href="#key-features">Características</a> •
  <a href="#how-to-use">Como usar</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Creditos</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>

![screenshot](./buildResources/anima.gif)

## Características

* Seletor Porta Com
  - Veja no menu dropdown as portas disponiveis no computador e seu fabricante.
* Recebe e exibe o status de carga
  - Enquanto carrega, o sistema envia os dados e o monitor os recebe e exibe.
* Recebe e exibe as configuraçõe do modo de carga
  - Exibe os parâmetros chave do modo atual.
* Mantêm o fluxo de dados da serial ativo e de forma automática
* Barra de status de carga animada
* Compatível com sistemas que utilizam protocolo UART (Ex.: Arduino) 
* Compatível com sistema Windows x86 e x64, (Builds distintas)
* Cross platform ready
  - Necessário build exclusiva do ElectronJS.

## Como usar

Para usar esta aplicação é necessário obedecer ao padrão de transmissão abaixo. Uma vez que o sistema alvo esteja enviando os dados, o Monitor de carga irá receber e processar. Para ter um guia de sistema que utiliza o recurso veja o Sistema MUF800R00 [Github](https://github.com/marcostech/MUF800R00). 
Este padrão de transmissão foi escrito na linguagem utilizada na plataforma Arduino, portanto pode ser usado em seu projeto sem a adição de outras bibliotecas.
O baudrate do sistema deve ser 115200.

```bash
# Todo pacote de dados deve ser enviado desta forma, obedecendo a 
# separação por CSV ',' e por delimitadores de inico e fim de transmissão.
# inico do pacote 
# '<'
# ...
# 'Pacote'
# ...
# '>'
# 'new Line char'
# fim do pacote
    Serial.begin(115200); //Manter este baudrate
    Serial.print(F("<"));  
    Serial.print(F(","));
    Serial.print(F("V: "));
    Serial.print(/* Sua tensão de bateria */);  
    Serial.print(F(","));
    Serial.print(F("T: "));
    Serial.print(/* Seu tempo atual */);  
    Serial.print(F(","));
    Serial.print(F("C: "));
    Serial.print(/* Seu ciclo atual */);  
    Serial.print(F(","));
    Serial.print(F("S: "));
    Serial.print(/* Seu estado atual */);  
    Serial.print(F(","));
    Serial.print(F("CFG1: "));
    Serial.print(/* Sua configuração de tensão minima */);  
    Serial.print(F(","));
    Serial.print(F("CFG2: "));
    Serial.print(/* Sua configuração de tensão máxima */);  
    Serial.print(F(","));
    Serial.print(F("CFG3: "));
    Serial.print(/* Sua configuração de tempo máximo */);  
    Serial.print(F(","));
    Serial.print(F("CFG4: "));
    Serial.print(/* Sua configuração de modo atual */);  
    Serial.print(F(","));
    Serial.print(F(">"));
    Serial.println();
```

> **Note**
> Se você não estiver usando estas funções para envio de dados na porta Serial basta enviar os dados conforme está descrito no exemplo (<,...Pacote1,Pacote2,...,>'newLineChar'), prestando atenção no 'new Line char' que só deve ser enviado ao final.


## Download

You can [download](https://github.com/amitmerchant1990/electron-markdownify/releases/tag/v1.2.0) the latest installable version of Markdownify for Windows, macOS and Linux.

## Emailware

Markdownify is an [emailware](https://en.wiktionary.org/wiki/emailware). Meaning, if you liked using this app or it has helped you in any way, I'd like you send me an email at <bullredeyes@gmail.com> about anything you'd want to say about this software. I'd really appreciate it!

## Credits

This software uses the following open source packages:

- [Electron](http://electron.atom.io/)
- [Node.js](https://nodejs.org/)
- [Marked - a markdown parser](https://github.com/chjj/marked)
- [showdown](http://showdownjs.github.io/showdown/)
- [CodeMirror](http://codemirror.net/)
- Emojis are taken from [here](https://github.com/arvida/emoji-cheat-sheet.com)
- [highlight.js](https://highlightjs.org/)

## Related

[markdownify-web](https://github.com/amitmerchant1990/markdownify-web) - Web version of Markdownify

## Support

<a href="https://www.buymeacoffee.com/5Zn8Xh3l9" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

<p>Or</p> 

<a href="https://www.patreon.com/amitmerchant">
	<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## You may also like...

- [Pomolectron](https://github.com/amitmerchant1990/pomolectron) - A pomodoro app
- [Correo](https://github.com/amitmerchant1990/correo) - A menubar/taskbar Gmail App for Windows and macOS

## License

MIT

---

> [amitmerchant.com](https://www.amitmerchant.com) &nbsp;&middot;&nbsp;
> GitHub [@amitmerchant1990](https://github.com/amitmerchant1990) &nbsp;&middot;&nbsp;
> Twitter [@amit_merchant](https://twitter.com/amit_merchant)


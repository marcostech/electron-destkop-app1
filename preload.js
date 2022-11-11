// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    
    document.getElementById('value1').innerText = "0"
    document.getElementById('value2').innerText = "0"
    document.getElementById('value3').innerText = "0"
    document.getElementById('value4').innerText = "0"

})
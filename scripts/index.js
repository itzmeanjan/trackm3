const { ipcRenderer } = require('electron')
window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('initServer', (event, data) => {
        document.getElementById('serverStatus').innerHTML = data // puts server status on screen
    })
    document.getElementById('findButton').onclick = () => {
        let longitude = document.getElementById('longitude').value
        let latitude = document.getElementById('latitude').value
        let zoomLevel = document.getElementById('zoomLevel').value
        if (longitude === '' || latitude === '' || zoomLevel === '') {
            document.getElementById('longitude').value = '51.50853'
            document.getElementById('latitude').value = '-0.12574'
            document.getElementById('zoomLevel').value = '5'
        }
        else {
            map.setView([parseFloat(latitude), parseFloat(longitude)], parseFloat(zoomLevel))
        }
    }
    document.getElementById('serverStartButton').onclick = () => {
        let serverIP = document.getElementById('serverIP').value
        let serverPort = document.getElementById('serverPort').value
        if (serverIP === '' || serverPort === '') { // in case user input is not okay, revert back to basic
            document.getElementById('serverIP').value = '0.0.0.0'
            document.getElementById('serverPort').value = '8000'
        }
        else { // if user input is okay, tries to start server
            if (document.getElementById('serverStartButton').value === '1') {
                document.getElementById('serverStartButton').value = '0'
                document.getElementById('serverStartButton').setAttribute('style', 'background-color: #ff0000;')
                document.getElementById('serverStartButton').innerHTML = 'Stop'
                ipcRenderer.send(
                    'initServer', {
                        'serverIP': document.getElementById('serverIP').value,
                        'serverPort': document.getElementById('serverPort').value
                    }
                ) // lets the otherend know about this event
            }
            else {
                document.getElementById('serverStartButton').value = '1'
                document.getElementById('serverStartButton').setAttribute('style', 'background-color: #04B4AE;')
                document.getElementById('serverStartButton').innerHTML = 'Start'
                ipcRenderer.send(
                    'initServer', null
                ) // lets the otherend know about this event
            }
        }
    }
})
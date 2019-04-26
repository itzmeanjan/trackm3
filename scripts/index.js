const { ipcRenderer } = require('electron');
let peerLocation = {};
window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('initServer', (event, data) => {
        switch (data) {
            case 'started':
                document.getElementById('serverStatus').innerHTML = 'Server Listening ...';
                document.getElementById('serverStartButton').value = '0';
                document.getElementById('serverStartButton').setAttribute('style', 'background-color: #ff0000;');
                document.getElementById('serverStartButton').innerHTML = 'Stop';
                break;
            case 'notStarted':
                document.getElementById('serverStatus').innerHTML = 'Couldn\'t start Server';
                break;
            case 'stopped':
                document.getElementById('serverStatus').innerHTML = 'Server Stopped';
                document.getElementById('serverStartButton').value = '1';
                document.getElementById('serverStartButton').setAttribute('style', 'background-color: #04B4AE;');
                document.getElementById('serverStartButton').innerHTML = 'Start';
                break;

        }
        // puts server status on screen
    });
    ipcRenderer.on('peerLocation', (event, data) => {
        if (peerLocation[data.id]) {
            peerLocation[data.id].push(data.location);
        }
        else {
            peerLocation[data.id] = [data.location];
            let targetElement = document.createElement('div');
            targetElement.id = data.id;
            targetElement.style = 'width: 100%;margin-bottom: 5px;margin-left: 3px;border-radius: 15px;border-width: 0px;padding: 3px;background-color: #58FAF4;';
            targetElement.addEventListener('click', () => {
                let targetElement = document.getElementById(data.id);
                if (targetElement !== null) {
                    if (isExapanded(targetElement))
                        contractElement(targetElement);
                    else
                        peerLocation[targetElement.id].forEach((value, index, array) => {
                            let tmp = document.createElement('p');
                            tmp.innerHTML = value;
                            tmp.style = 'background-color: #A9E2F3;font-size: x-small;font-family: Arial, Helvetica, sans-serif;mergin: 1px;border-radius: 20px;';
                            targetElement.appendChild(tmp);
                        });
                    document.getElementById('clientsDiv').replaceChild(document.getElementById(targetElement.id), targetElement);
                }
            });
            let title = document.createElement('p');
            title.style = 'margin-left: 3px; font-size: small; text-align: center; font-family: Halvetica Neue;';
            title.innerHTML = data.id;
            targetElement.appendChild(title);
            targetElement.childElementCount
            document.getElementById('clientsDiv').appendChild(targetElement);
        }
    });
    ipcRenderer.on('peerStatus', (event, data) => {
        //    document.getElementById('clients').innerHTML = data.status
    });
    document.getElementById('findButton').onclick = () => {
        let longitude = document.getElementById('longitude').value;
        let latitude = document.getElementById('latitude').value;
        let zoomLevel = document.getElementById('zoomLevel').value;
        if (longitude === '' || latitude === '' || zoomLevel === '') {
            document.getElementById('longitude').value = '51.50853';
            document.getElementById('latitude').value = '-0.12574';
            document.getElementById('zoomLevel').value = '5';
        }
        else {
            map.setView([parseFloat(latitude), parseFloat(longitude)], parseFloat(zoomLevel));
        }
    };
    document.getElementById('serverStartButton').onclick = () => {
        let serverIP = document.getElementById('serverIP').value;
        let serverPort = document.getElementById('serverPort').value;
        if (serverIP === '' || serverPort === '') { // in case user input is not okay, revert back to basic
            document.getElementById('serverIP').value = '0.0.0.0';
            document.getElementById('serverPort').value = '8000';
        }
        else { // if user input is okay, tries to start server
            if (document.getElementById('serverStartButton').value === '1') {
                ipcRenderer.send(
                    'initServer', {
                        'serverIP': document.getElementById('serverIP').value,
                        'serverPort': document.getElementById('serverPort').value
                    }
                ); // lets the otherend know about this event
            }
            else {
                ipcRenderer.send(
                    'initServer', null
                ); // lets the otherend know about this event
            }
        }
    };
});

function isExapanded(element) {
    return element.childElementCount > 1; // if element has more than 1 element, it's expanded, else not expanded yet
}

function contractElement(element) {
    while (element.children.length > 1) {
        element.removeChild(element.lastElementChild)
    }
}

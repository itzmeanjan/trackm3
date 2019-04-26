const { app, BrowserWindow, ipcMain } = require('electron')
const server = require('./server')
let currentWindow
let peerLocation = {}
function windowMaker() {
    currentWindow = new BrowserWindow(
        {
            width: 800,
            height: 450,
            autoHideMenuBar: true
        }
    )
    currentWindow.loadFile('pages/index.html')
    currentWindow.on('closed', () => {
        currentWindow = null
    })
}

app.on('ready', (launchInfo) => {
    windowMaker()
})

app.on('window-all-closed', () => {
    server.stop()
    app.quit()
})

ipcMain.on('initServer', (event, data) => {
    if (data === null) {
        server.stop((key, val) => {
            event.sender.send('initServer', val)
        })
    }
    else {
        let serverIP = data.serverIP
        let serverPort = parseInt(data.serverPort)
        server.init(serverIP, serverPort, (key, val) => {
            switch (key) {
                case 'status':
                    event.sender.send('initServer', val)
                    break
                default:
                    if (val['status']) {
                        event.sender.send('peerStatus', { 'id': key, 'status': val.status })
                    }
                    else {
                        if (peerLocation[key])
                            peerLocation[key].push(val.location)
                        else
                            peerLocation[key] = [val.location]
                        event.sender.send('peerLocation', { 'id': key, 'location': val.location })
                    }
            }
        })
    }
})

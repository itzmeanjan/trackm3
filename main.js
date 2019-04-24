const { app, BrowserWindow, ipcMain } = require('electron')
const express = require('express')
let currentWindow
let expressApp
let server
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
    server.close()
    expressApp = null
    app.quit()
})

ipcMain.on('initServer', (event, data) => {
    if (data === null) {
        server.close((e) => {
            if (e)
                event.sender.send('initServer', e.message)
            else
                event.sender.send('initServer', 'Server Stopped')
        })
        expressApp = null
    }
    else {
        let serverIP = data.serverIP
        let serverPort = parseInt(data.serverPort)
        expressApp = express()
        expressApp.get('/', (req, res) => {
            res.status(200).send('hello').end()
        })
        server = expressApp.listen(serverPort, serverIP, () => {
            event.sender.send('initServer', 'Server Listening ...')
        })
    }
})

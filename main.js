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
                event.sender.send('initServerResp', e.message)
            else
                event.sender.send('initServerResp', 'Server Stopped')
        })
        expressApp = null
    }
    else {
        let serverIP = data.serverIP
        let serverPort = parseInt(data.serverPort)
        expressApp = express()
        expressApp.get('/', (req, res) => {
            console.log(req.ip)
            res.status(200).send('hello').end()
        })
        server = expressApp.listen(serverIP, serverPort, () => {
            event.sender.send('initServerResp', 'Server Listening ...')
        })
    }
})

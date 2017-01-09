const {app, BrowserWindow} = require('electron');
const url = require('url');

let win = null;
app.on('ready', createWindow);
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});


function createWindow () {
	win = new BrowserWindow({ width: 800, height: 600 });
	win.loadURL(url.format({
		pathname: `${__dirname}/index.html`,
		protocol: 'file:',
		slashes: true,
	}));

	win.webContents.openDevTools();

	win.on('closed', () => {
		win = null;
	});
}
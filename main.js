const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('./database/db');
const ItemsService = require('./src/services/items');
const CurrenciesService = require('./src/services/currencies');
const FinishesService = require('./src/services/finishes');
const ProjectsService = require('./src/services/projects');

let mainWindow;
let db;
let itemsService;
let currenciesService;
let finishesService;
let projectsService;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  mainWindow.loadFile('renderer/index.html');

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function initializeDatabase() {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'precalculation.db');
  
  db = new Database(dbPath);
  itemsService = new ItemsService(db);
  currenciesService = new CurrenciesService(db);
  finishesService = new FinishesService(db);
  projectsService = new ProjectsService(db);
}

app.whenReady().then(() => {
  initializeDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) db.close();
    app.quit();
  }
});

// IPC Handlers for Items
ipcMain.handle('items:getAll', async () => {
  try {
    return await itemsService.getAll();
  } catch (error) {
    console.error('Error getting items:', error);
    throw error;
  }
});

ipcMain.handle('items:create', async (event, item) => {
  try {
    return await itemsService.create(item);
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
});

ipcMain.handle('items:update', async (event, id, item) => {
  try {
    return await itemsService.update(id, item);
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
});

ipcMain.handle('items:delete', async (event, id) => {
  try {
    return await itemsService.delete(id);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
});

// IPC Handlers for Currencies
ipcMain.handle('currencies:getAll', async () => {
  try {
    return await currenciesService.getAll();
  } catch (error) {
    console.error('Error getting currencies:', error);
    throw error;
  }
});

ipcMain.handle('currencies:create', async (event, currency) => {
  try {
    return await currenciesService.create(currency);
  } catch (error) {
    console.error('Error creating currency:', error);
    throw error;
  }
});

ipcMain.handle('currencies:update', async (event, id, currency) => {
  try {
    return await currenciesService.update(id, currency);
  } catch (error) {
    console.error('Error updating currency:', error);
    throw error;
  }
});

ipcMain.handle('currencies:delete', async (event, id) => {
  try {
    return await currenciesService.delete(id);
  } catch (error) {
    console.error('Error deleting currency:', error);
    throw error;
  }
});

// IPC Handlers for Finishes
ipcMain.handle('finishes:getAll', async () => {
  try {
    return await finishesService.getAll();
  } catch (error) {
    console.error('Error getting finishes:', error);
    throw error;
  }
});

ipcMain.handle('finishes:create', async (event, finish) => {
  try {
    return await finishesService.create(finish);
  } catch (error) {
    console.error('Error creating finish:', error);
    throw error;
  }
});

ipcMain.handle('finishes:delete', async (event, id) => {
  try {
    return await finishesService.delete(id);
  } catch (error) {
    console.error('Error deleting finish:', error);
    throw error;
  }
});

// IPC Handlers for Projects
ipcMain.handle('projects:getAll', async () => {
  try {
    return await projectsService.getAll();
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
});

ipcMain.handle('projects:create', async (event, project) => {
  try {
    return await projectsService.create(project);
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
});

ipcMain.handle('projects:update', async (event, id, project) => {
  try {
    return await projectsService.update(id, project);
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
});

ipcMain.handle('projects:delete', async (event, id) => {
  try {
    return await projectsService.delete(id);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
});

// File operations
ipcMain.handle('dialog:saveFile', async (event, options) => {
  try {
    const result = await dialog.showSaveDialog(mainWindow, options);
    return result;
  } catch (error) {
    console.error('Error showing save dialog:', error);
    throw error;
  }
});

ipcMain.handle('dialog:openFile', async (event, options) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, options);
    return result;
  } catch (error) {
    console.error('Error showing open dialog:', error);
    throw error;
  }
});

ipcMain.handle('fs:writeFile', async (event, filePath, content) => {
  try {
    // Check if content is an array (from Uint8Array transfer)
    if (Array.isArray(content)) {
      const buffer = Buffer.from(content);
      fs.writeFileSync(filePath, buffer);
    } else if (Buffer.isBuffer(content)) {
      fs.writeFileSync(filePath, content);
    } else {
      fs.writeFileSync(filePath, content, 'utf8');
    }
    return { success: true };
  } catch (error) {
    console.error('Error writing file:', error);
    throw error;
  }
});

ipcMain.handle('fs:readFile', async (event, filePath) => {
  try {
    // Read as buffer for Excel files
    if (filePath.toLowerCase().endsWith('.xlsx') || 
        filePath.toLowerCase().endsWith('.xls') || 
        filePath.toLowerCase().endsWith('.xlsm')) {
      const buffer = fs.readFileSync(filePath);
      return Array.from(buffer);
    }
    // Read as text for other files
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
});

ipcMain.handle('app:print', async () => {
  try {
    if (mainWindow) {
      mainWindow.webContents.print();
    }
  } catch (error) {
    console.error('Error printing:', error);
    throw error;
  }
});

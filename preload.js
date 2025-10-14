const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Items API
  items: {
    getAll: () => ipcRenderer.invoke('items:getAll'),
    create: (item) => ipcRenderer.invoke('items:create', item),
    update: (id, item) => ipcRenderer.invoke('items:update', id, item),
    delete: (id) => ipcRenderer.invoke('items:delete', id)
  },
  
  // Currencies API
  currencies: {
    getAll: () => ipcRenderer.invoke('currencies:getAll'),
    create: (currency) => ipcRenderer.invoke('currencies:create', currency),
    update: (id, currency) => ipcRenderer.invoke('currencies:update', id, currency),
    delete: (id) => ipcRenderer.invoke('currencies:delete', id)
  },
  
  // Finishes API
  finishes: {
    getAll: () => ipcRenderer.invoke('finishes:getAll'),
    create: (finish) => ipcRenderer.invoke('finishes:create', finish),
    delete: (id) => ipcRenderer.invoke('finishes:delete', id)
  },
  
  // Projects API
  projects: {
    getAll: () => ipcRenderer.invoke('projects:getAll'),
    create: (project) => ipcRenderer.invoke('projects:create', project),
    update: (id, project) => ipcRenderer.invoke('projects:update', id, project),
    delete: (id) => ipcRenderer.invoke('projects:delete', id)
  },
  
  // File operations
  dialog: {
    saveFile: (options) => ipcRenderer.invoke('dialog:saveFile', options),
    openFile: (options) => ipcRenderer.invoke('dialog:openFile', options)
  },
  
  fs: {
    writeFile: (filePath, content) => {
      // Convert Uint8Array to Array for IPC transfer
      if (content instanceof Uint8Array) {
        return ipcRenderer.invoke('fs:writeFile', filePath, Array.from(content));
      }
      return ipcRenderer.invoke('fs:writeFile', filePath, content);
    },
    readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath)
  },
  
  app: {
    print: () => ipcRenderer.invoke('app:print')
  }
});

// Make Buffer available in renderer
contextBridge.exposeInMainWorld('Buffer', {
  from: (data) => {
    if (Array.isArray(data)) {
      return new Uint8Array(data);
    }
    return new Uint8Array(Buffer.from(data));
  }
});

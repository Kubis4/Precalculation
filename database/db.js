const fs = require('fs');
const path = require('path');

class DatabaseManager {
  constructor(dbPath) {
    this.dbDir = path.dirname(dbPath);
    this.dbPath = dbPath.replace('.db', '.json');
    this.data = {
      items: [],
      currencies: [],
      finishes: [],
      projects: [],
      settings: []
    };
    this.initialize();
  }

  initialize() {
    if (!fs.existsSync(this.dbDir)) {
      fs.mkdirSync(this.dbDir, { recursive: true });
    }

    if (fs.existsSync(this.dbPath)) {
      try {
        const fileData = fs.readFileSync(this.dbPath, 'utf8');
        this.data = JSON.parse(fileData);
      } catch (error) {
        console.error('Error loading database:', error);
        this.seedDefaultData();
      }
    } else {
      this.seedDefaultData();
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  getDb() {
    return this;
  }

  prepare(query) {
    return {
      run: (...params) => {
        return { lastInsertRowid: Date.now(), changes: 1 };
      },
      get: () => {
        return { count: this.data.items.length };
      },
      all: () => {
        return [];
      }
    };
  }

  exec() {}
  pragma() {}

  seedDefaultData() {
    // Default Items - Complete list
    this.data.items = [
      { id: 1, name: "ATEX Certification", modification: "ATEX", unit: "pcs", defaultQty: 1, costPerUnit: 20, isDefault: true },
      { id: 2, name: "ATEX Grounding", modification: "ATEX", unit: "pcs", defaultQty: 1, costPerUnit: 7, isDefault: true },
      { id: 3, name: "ATEX Markup", modification: "ATEX", unit: "pcs", defaultQty: 1, costPerUnit: 200, isDefault: true },
      { id: 4, name: "ATEX Modification (welded screw + wire)", modification: "ATEX", unit: "pcs", defaultQty: 1, costPerUnit: 15, isDefault: true },
      { id: 5, name: "Decontamination Port", modification: "CamSafe", unit: "", defaultQty: 1, costPerUnit: 113, isDefault: true },
      { id: 6, name: "High Pressure Customization (9kPa)", modification: "CamSafe", unit: "", defaultQty: 1, costPerUnit: 80, isDefault: true },
      { id: 7, name: "High Temperature Modification", modification: "CamSafe", unit: "", defaultQty: 1, costPerUnit: 450, isDefault: true },
      { id: 8, name: "Kamlock", modification: "CamSafe", unit: "pcs", defaultQty: 1, costPerUnit: 114, isDefault: true },
      { id: 9, name: "Pressure Relief Kit S4/S6", modification: "CamSafe", unit: "pcs", defaultQty: 1, costPerUnit: 252, isDefault: true },
      { id: 10, name: "Pressure Relief Kit SW", modification: "CamSafe", unit: "pcs", defaultQty: 1, costPerUnit: 147, isDefault: true },
      { id: 11, name: "Additional Material S4/S6", modification: "", unit: "kg", defaultQty: 1, costPerUnit: 5, isDefault: true },
      { id: 12, name: "Additional Welding", modification: "", unit: "", defaultQty: 1, costPerUnit: 7, isDefault: true }
    ];

    // Default Currencies
    this.data.currencies = [
      { id: 1, code: "EUR", rate: 1, isDefault: true },
      { id: 2, code: "USD", rate: 1.0822, isDefault: true },
      { id: 3, code: "GBP", rate: 0.8466, isDefault: true },
      { id: 4, code: "AED", rate: 3.9748, isDefault: true },
      { id: 5, code: "AUD", rate: 1.6393, isDefault: true },
      { id: 6, code: "CAD", rate: 1.4821, isDefault: true },
      { id: 7, code: "CHF", rate: 0.9528, isDefault: true },
      { id: 8, code: "CNY", rate: 7.7878, isDefault: true },
      { id: 9, code: "JPY", rate: 163.8686, isDefault: true }
    ];

    // Default Finishes
    this.data.finishes = [
      { id: 1, name: "RAL 9010", isDefault: true },
      { id: 2, name: "SS304L", isDefault: true },
      { id: 3, name: "SS316L", isDefault: true },
      { id: 4, name: "RAL 9002", isDefault: true },
      { id: 5, name: "RAL 9003", isDefault: true },
      { id: 6, name: "RAL 9016", isDefault: true }
    ];
  }

  // Items methods
  getAllItems() {
    return this.data.items;
  }

  createItem(item) {
    const newItem = {
      id: this.data.items.length > 0 ? Math.max(...this.data.items.map(i => i.id)) + 1 : 1,
      ...item,
      createdAt: new Date().toISOString()
    };
    this.data.items.push(newItem);
    this.save();
    return newItem;
  }

  updateItem(id, item) {
    const index = this.data.items.findIndex(i => i.id === id);
    if (index !== -1) {
      this.data.items[index] = { ...this.data.items[index], ...item, updatedAt: new Date().toISOString() };
      this.save();
      return this.data.items[index];
    }
    return null;
  }

  deleteItem(id) {
    const index = this.data.items.findIndex(i => i.id === id);
    if (index !== -1 && !this.data.items[index].isDefault) {
      this.data.items.splice(index, 1);
      this.save();
      return { success: true };
    }
    return { success: false };
  }

  // Currencies methods
  getAllCurrencies() {
    return this.data.currencies;
  }

  createCurrency(currency) {
    const newCurrency = {
      id: this.data.currencies.length > 0 ? Math.max(...this.data.currencies.map(c => c.id)) + 1 : 1,
      ...currency,
      createdAt: new Date().toISOString()
    };
    this.data.currencies.push(newCurrency);
    this.save();
    return newCurrency;
  }

  updateCurrency(id, currency) {
    const index = this.data.currencies.findIndex(c => c.id === id);
    if (index !== -1) {
      this.data.currencies[index] = { ...this.data.currencies[index], ...currency, updatedAt: new Date().toISOString() };
      this.save();
      return this.data.currencies[index];
    }
    return null;
  }

  deleteCurrency(id) {
    const index = this.data.currencies.findIndex(c => c.id === id);
    if (index !== -1 && this.data.currencies[index].code !== 'EUR') {
      this.data.currencies.splice(index, 1);
      this.save();
      return { success: true };
    }
    return { success: false };
  }

  // Finishes methods
  getAllFinishes() {
    return this.data.finishes;
  }

  createFinish(finish) {
    const newFinish = {
      id: this.data.finishes.length > 0 ? Math.max(...this.data.finishes.map(f => f.id)) + 1 : 1,
      ...finish,
      createdAt: new Date().toISOString()
    };
    this.data.finishes.push(newFinish);
    this.save();
    return newFinish;
  }

  deleteFinish(id) {
    const index = this.data.finishes.findIndex(f => f.id === id);
    if (index !== -1 && !this.data.finishes[index].isDefault) {
      this.data.finishes.splice(index, 1);
      this.save();
      return { success: true };
    }
    return { success: false };
  }

  // Projects methods
  getAllProjects() {
    return this.data.projects;
  }

  createProject(project) {
    const newProject = {
      id: this.data.projects.length > 0 ? Math.max(...this.data.projects.map(p => p.id)) + 1 : 1,
      ...project,
      createdAt: new Date().toISOString()
    };
    this.data.projects.push(newProject);
    this.save();
    return newProject;
  }

  updateProject(id, project) {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.projects[index] = { ...this.data.projects[index], ...project, updatedAt: new Date().toISOString() };
      this.save();
      return this.data.projects[index];
    }
    return null;
  }

  deleteProject(id) {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.data.projects.splice(index, 1);
      this.save();
      return { success: true };
    }
    return { success: false };
  }

  close() {
    this.save();
  }
}

module.exports = DatabaseManager;

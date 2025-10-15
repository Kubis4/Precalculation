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

    let needsReinitialization = false;

    if (fs.existsSync(this.dbPath)) {
      try {
        const fileData = fs.readFileSync(this.dbPath, 'utf8');
        this.data = JSON.parse(fileData);
        
        // Check if data is complete - should have at least 30 currencies and 40+ items
        if (!this.data.items || this.data.items.length < 40) {
          console.log(`Database incomplete: found ${this.data.items?.length || 0} items (expected 40+)`);
          needsReinitialization = true;
        }
        if (!this.data.currencies || this.data.currencies.length < 30) {
          console.log(`Database incomplete: found ${this.data.currencies?.length || 0} currencies (expected 30)`);
          needsReinitialization = true;
        }
        
        if (needsReinitialization) {
          console.log('Reinitializing database with complete default data...');
          this.seedDefaultData();
          this.save();
        }
      } catch (error) {
        console.error('Error loading database:', error);
        needsReinitialization = true;
      }
    } else {
      needsReinitialization = true;
    }

    if (needsReinitialization && !fs.existsSync(this.dbPath)) {
      console.log('Creating new database with default data...');
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
    // Complete Items list
    const itemsData = [
      { name: "ATEX Certification", modification: "ATEX", unit: "pcs", defaultQty: 1, costPerUnit: 20 },
      { name: "ATEX Grounding", modification: "ATEX", unit: "pcs", defaultQty: 1, costPerUnit: 7 },
      { name: "ATEX Markup", modification: "ATEX", unit: "pcs", defaultQty: 1, costPerUnit: 200 },
      { name: "ATEX Modification (welded screw + wire)", modification: "ATEX", unit: "pcs", defaultQty: 1, costPerUnit: 15 },
      { name: "Decontamination Port", modification: "CamSafe", unit: "", defaultQty: 1, costPerUnit: 113 },
      { name: "High Pressure Customization (9kPa)", modification: "CamSafe", unit: "", defaultQty: 1, costPerUnit: 80 },
      { name: "High Temperature Modification", modification: "CamSafe", unit: "", defaultQty: 1, costPerUnit: 450 },
      { name: "Kamlock", modification: "CamSafe", unit: "pcs", defaultQty: 1, costPerUnit: 114 },
      { name: "Pressure Relief Kit S4/S6", modification: "CamSafe", unit: "pcs", defaultQty: 1, costPerUnit: 252 },
      { name: "Pressure Relief Kit SW", modification: "CamSafe", unit: "pcs", defaultQty: 1, costPerUnit: 147 },
      { name: "Horizontal Orientation Markup", modification: "CamSafe", unit: "", defaultQty: 2, costPerUnit: 23 },
      { name: "Flange Collector Customization Markup", modification: "CamSafe - Collector", unit: "", defaultQty: 1, costPerUnit: 100 },
      { name: "Markup Mirror Finish", modification: "CamSafe - Finish", unit: "pcs", defaultQty: 1, costPerUnit: 30 },
      { name: "Window Markup for CamSafe", modification: "CamSafe - Window", unit: "pcs", defaultQty: 1, costPerUnit: 66 },
      { name: "Mini Latch", modification: "CamSafe WM - Door", unit: "pcs", defaultQty: 1, costPerUnit: 20 },
      { name: "Turn Lock Markup", modification: "CamSafe WM - Door", unit: "pcs", defaultQty: 1, costPerUnit: 25 },
      { name: "Carabin for Safety Cable", modification: "CleanSeal", unit: "pcs", defaultQty: 1, costPerUnit: 2 },
      { name: "Custom Support Brackets", modification: "CleanSeal", unit: "", defaultQty: 1, costPerUnit: 6 },
      { name: "Female Spigot Markup", modification: "CleanSeal", unit: "", defaultQty: 1, costPerUnit: 10 },
      { name: "Injection Port", modification: "CleanSeal", unit: "", defaultQty: 1, costPerUnit: 37 },
      { name: "Push-on Modification", modification: "CleanSeal", unit: "pcs", defaultQty: 1, costPerUnit: 22 },
      { name: "Safety Cable", modification: "CleanSeal", unit: "pcs", defaultQty: 1, costPerUnit: 3 },
      { name: "T-C Damper kit", modification: "CleanSeal", unit: "pcs", defaultQty: 1, costPerUnit: 130 },
      { name: "No Filter Accessories", modification: "CleanSeal - Blind Housing", unit: "", defaultQty: -1, costPerUnit: 27 },
      { name: "Custom Filter Size", modification: "CleanSeal", unit: "", defaultQty: 1, costPerUnit: 20 },
      { name: "Male stud coupling NPT 1/8 - 6mm Swagelok, SS-6M0-1-2", modification: "SS Tubing", unit: "pcs", defaultQty: 1, costPerUnit: 12 },
      { name: "Screw-on cutting ring fitt. G 1/8-6 L, Landefeld GAI 6 LR ES", modification: "SS Tubing", unit: "pcs", defaultQty: 1, costPerUnit: 19 },
      { name: "Screw-on screw connection G 1/8 8x6mm, Landenfeld, ACK 186 MSV", modification: "SS Tubing", unit: "pcs", defaultQty: 1, costPerUnit: 1 },
      { name: "SS Tubing", modification: "SS Tubing", unit: "m", defaultQty: 1, costPerUnit: 33 },
      { name: "Disk Filter 40mm/6mm", modification: "SS Tubing", unit: "pcs", defaultQty: 1, costPerUnit: 150 },
      { name: "Straight weld nipple D10 - 6mm, Schwer, SR-5296L", modification: "SS Tubing", unit: "pcs", defaultQty: 1, costPerUnit: 5 },
      { name: "Assembly", modification: "Strader", unit: "h", defaultQty: 1, costPerUnit: 40 },
      { name: "Coupling C-Angle, Strader, SW-LCK2_664200 S4,S6-LCK2E_6642001", modification: "Strader", unit: "pcs", defaultQty: 1, costPerUnit: 2 },
      { name: "Mounting set, Strader, SW-SGKM10X20_651341 S4,S6-SGKM10X20E_661050", modification: "Strader", unit: "pcs", defaultQty: 1, costPerUnit: 1 },
      { name: "Protective Cap 40x40", modification: "Strader", unit: "pcs", defaultQty: 1, costPerUnit: 0 },
      { name: "Screw hex head, M8x30, ISO 4017", modification: "Strader", unit: "pcs", defaultQty: 1, costPerUnit: 0 },
      { name: "Screw, Nuts & Washer kits", modification: "Strader", unit: "pcs", defaultQty: 1, costPerUnit: 2 },
      { name: "Square nut M8, Strader, SW-NWM8_650249 S4,S6-NWM8E_6502491", modification: "Strader", unit: "pcs", defaultQty: 1, costPerUnit: 0 },
      { name: "Strader Legs Markup", modification: "Strader", unit: "pcs", defaultQty: 1, costPerUnit: 25 },
      { name: "Strader Length S4/S6", modification: "Strader", unit: "mm", defaultQty: 1, costPerUnit: 0 },
      { name: "Strader Length SW", modification: "Strader", unit: "mm", defaultQty: 1, costPerUnit: 0 },
      { name: "Support Strips S4/S6", modification: "Strader", unit: "pcs", defaultQty: 1, costPerUnit: 25 },
      { name: "Support Strips SW", modification: "Strader", unit: "pcs", defaultQty: 1, costPerUnit: 25 },
      { name: "TOP VALVE SUPPORT SUSPENSION - DN450 PN10", modification: "Strader", unit: "pcs", defaultQty: 1, costPerUnit: 50 },
      { name: "Washer, M8, NF E25-513", modification: "Strader", unit: "pcs", defaultQty: 1, costPerUnit: 0 },
      { name: "Leg Position Holder", modification: "Strader", unit: "pcs", defaultQty: 1, costPerUnit: 8 },
      { name: "Additional Material S4/S6", modification: "", unit: "kg", defaultQty: 1, costPerUnit: 5 },
      { name: "Additional Material SW", modification: "", unit: "kg", defaultQty: 1, costPerUnit: 3 },
      { name: "Additional Ports", modification: "", unit: "pcs", defaultQty: 1, costPerUnit: 15 },
      { name: "Additional Spigot Customization", modification: "", unit: "pcs", defaultQty: 1, costPerUnit: 25 },
      { name: "Additional Support Brackets + Screws + Washers", modification: "", unit: "pcs", defaultQty: 1, costPerUnit: 10 },
      { name: "Additional Surface Finish - Painting", modification: "", unit: "m2", defaultQty: 1, costPerUnit: 35 },
      { name: "Additional Welding", modification: "", unit: "", defaultQty: 1, costPerUnit: 7 },
      { name: "Bending", modification: "", unit: "", defaultQty: 1, costPerUnit: 10 },
      { name: "Cleaning Process", modification: "", unit: "", defaultQty: 1, costPerUnit: 5 },
      { name: "Custom Collector Orientation", modification: "", unit: "", defaultQty: 1, costPerUnit: 30 },
      { name: "Custom Flange Markup", modification: "", unit: "", defaultQty: 1, costPerUnit: 30 },
      { name: "Custom Plate Markup", modification: "", unit: "", defaultQty: 1, costPerUnit: 275 },
      { name: "Customization Markup (variable)", modification: "", unit: "", defaultQty: 1, costPerUnit: 10 },
      { name: "Finish Markup", modification: "", unit: "", defaultQty: 1, costPerUnit: 20 },
      { name: "Fittings", modification: "", unit: "pcs", defaultQty: 1, costPerUnit: 15 },
      { name: "Laser Cutting", modification: "", unit: "min", defaultQty: 1, costPerUnit: 1 },
      { name: "Less Material & Paint Cost", modification: "", unit: "", defaultQty: -1, costPerUnit: 15 },
      { name: "Less Material Used (mm)", modification: "", unit: "mm", defaultQty: -1, costPerUnit: 0 },
      { name: "Less Material Used S4/S6", modification: "", unit: "kg", defaultQty: -1, costPerUnit: 5 },
      { name: "Less Material Used SW", modification: "", unit: "kg", defaultQty: -1, costPerUnit: 2 },
      { name: "Less Paint Used S4/S6", modification: "", unit: "m2", defaultQty: -1, costPerUnit: 35 },
      { name: "Less Paint Used SW", modification: "", unit: "m2", defaultQty: -1, costPerUnit: 26 },
      { name: "Magnetic Lock Markup", modification: "", unit: "", defaultQty: 1, costPerUnit: 10 },
      { name: "Manhours Markup", modification: "", unit: "hr", defaultQty: 1, costPerUnit: 40 },
      { name: "Montage", modification: "", unit: "", defaultQty: 1, costPerUnit: 15 },
      { name: "Sheet Metal Costs", modification: "", unit: "kg", defaultQty: 1, costPerUnit: 10 },
      { name: "Welded Fittings", modification: "", unit: "pcs", defaultQty: 1, costPerUnit: 15 }
    ];

    this.data.items = itemsData.map((item, index) => ({
      id: index + 1,
      ...item,
      isDefault: true
    }));

    // Complete Currencies list
    const currenciesData = [
      { code: "EUR", rate: 1 },
      { code: "USD", rate: 1.0822 },
      { code: "GBP", rate: 0.8466 },
      { code: "AED", rate: 3.9748 },
      { code: "AUD", rate: 1.6393 },
      { code: "BGN", rate: 1.9586 },
      { code: "BRL", rate: 5.8251 },
      { code: "CAD", rate: 1.4821 },
      { code: "CHF", rate: 0.9528 },
      { code: "CNY", rate: 7.7878 },
      { code: "CZK", rate: 25.1276 },
      { code: "DKK", rate: 7.4610 },
      { code: "HKD", rate: 8.4437 },
      { code: "HUF", rate: 395.5523 },
      { code: "INR", rate: 90.5414 },
      { code: "JPY", rate: 163.8686 },
      { code: "MXN", rate: 21.7539 },
      { code: "MYR", rate: 4.9511 },
      { code: "NOK", rate: 11.6315 },
      { code: "NZD", rate: 1.7876 },
      { code: "PLN", rate: 4.3082 },
      { code: "RON", rate: 4.9760 },
      { code: "RSD", rate: 117.1005 },
      { code: "RUB", rate: 100.3879 },
      { code: "SEK", rate: 11.4381 },
      { code: "SGD", rate: 1.4460 },
      { code: "THB", rate: 38.1867 },
      { code: "TRY", rate: 35.5786 },
      { code: "TWD", rate: 34.7900 },
      { code: "ZAR", rate: 19.8297 }
    ];

    this.data.currencies = currenciesData.map((currency, index) => ({
      id: index + 1,
      ...currency,
      isDefault: true
    }));

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

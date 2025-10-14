const { useState, useEffect } = React;

// ==================== CONSTANTS ====================
const FINISH_TYPES = ["SW", "S4", "S6"];
const FINISH_SUBTEXTS = {
  "SW": ["RAL 9010", "RAL 9002", "RAL 9003", "RAL 9006", "RAL 9016", "RAL 7035", "Custom"],
  "S4": ["Brushed", "Mirror", "2B", "025", "Custom"],
  "S6": ["Brushed", "Mirror", "2B", "025", "Custom"]
};
const FINISH_DESCRIPTIONS = {
  "SW": "Prepainted Steel",
  "S4": "Stainless Steel",
  "S6": "Aluminium"
};

// ==================== ICON COMPONENTS ====================
const Plus = ({size = 20}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Trash2 = ({size = 20}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const Copy = ({size = 20}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const Calendar = ({size = 16}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const User = ({size = 16}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Save = ({size = 18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const Download = ({size = 20}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const Upload = ({size = 20}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const FileText = ({size = 20}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const ChevronDown = ({size = 16}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const Edit = ({size = 20}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const X = ({size = 24}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// ==================== CURRENCY MANAGER MODAL ====================
const CurrencyManagerModal = ({ isOpen, onClose, allCurrencies, onRefresh, currentCurrency }) => {
  const [currencies, setCurrencies] = useState([]);
  const [newCurrency, setNewCurrency] = useState({ code: '', rate: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrencies([...allCurrencies]);
    }
  }, [isOpen, allCurrencies]);

  if (!isOpen) return null;

  const addCurrency = async () => {
    if (newCurrency.code && newCurrency.rate) {
      try {
        await window.electronAPI.currencies.create({
          code: newCurrency.code.toUpperCase(),
          rate: parseFloat(newCurrency.rate),
          isDefault: false
        });
        setNewCurrency({ code: '', rate: '' });
        await onRefresh();
      } catch (error) {
        console.error('Error adding currency:', error);
        alert('Error adding currency: ' + error.message);
      }
    }
  };

  const updateCurrency = async (id, field, value) => {
    try {
      const currency = currencies.find(c => c.id === id);
      if (currency) {
        const updatedCurrency = { ...currency };
        if (field === 'code') {
          updatedCurrency.code = value.toUpperCase();
        } else if (field === 'rate') {
          updatedCurrency.rate = parseFloat(value) || 0;
        }
        await window.electronAPI.currencies.update(id, updatedCurrency);
        await onRefresh();
      }
    } catch (error) {
      console.error('Error updating currency:', error);
      alert('Error updating currency: ' + error.message);
    }
  };

  const deleteCurrency = async (id) => {
    if (window.confirm('Are you sure you want to delete this currency?')) {
      try {
        await window.electronAPI.currencies.delete(id);
        await onRefresh();
      } catch (error) {
        console.error('Error deleting currency:', error);
        alert('Error deleting currency: ' + error.message);
      }
    }
  };

  const handleSave = () => {
    onClose();
  };

  const filteredCurrencies = currencies.filter(curr => 
    searchTerm === '' || curr.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Currencies</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={28} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>Current Currency:</strong> <span className="text-blue-700 font-bold">{currentCurrency}</span>
          </p>
        </div>

        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold mb-3">Add New Currency</h4>
          <div className="grid grid-cols-3 gap-3">
            <input 
              type="text" 
              placeholder="Currency Code (e.g., SKK)" 
              value={newCurrency.code} 
              onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value.toUpperCase() })} 
              className="px-3 py-2 border border-gray-300 rounded uppercase"
              maxLength={3}
            />
            <input 
              type="number" 
              placeholder="Exchange Rate to EUR" 
              value={newCurrency.rate} 
              onChange={(e) => setNewCurrency({ ...newCurrency, rate: e.target.value })} 
              className="px-3 py-2 border border-gray-300 rounded"
              step="0.0001"
            />
            <button onClick={addCurrency} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 justify-center">
              <Plus /> Add
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-700">All Currencies ({currencies.length} items)</h4>
            <input 
              type="text" 
              placeholder="Search currencies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded w-64"
            />
          </div>
          <div className="max-h-96 overflow-y-auto border border-gray-300 rounded">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left w-32">Currency Code</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Exchange Rate (to EUR)</th>
                  <th className="border border-gray-300 px-3 py-2 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCurrencies.map((curr) => {
                  const isCurrent = curr.code === currentCurrency;
                  return (
                    <tr key={curr.id} className={`hover:bg-gray-50 ${isCurrent ? 'bg-blue-100' : ''}`}>
                      <td className="border border-gray-300 px-2 py-1">
                        <input 
                          type="text" 
                          value={curr.code} 
                          onChange={(e) => updateCurrency(curr.id, 'code', e.target.value)} 
                          className="w-full px-2 py-1 border-0 focus:outline-none bg-transparent font-semibold uppercase"
                          maxLength={3}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input 
                          type="number" 
                          value={curr.rate} 
                          onChange={(e) => updateCurrency(curr.id, 'rate', e.target.value)} 
                          className="w-full px-2 py-1 border-0 focus:outline-none bg-transparent"
                          step="0.0001"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        {curr.code === 'EUR' ? (
                          <span className="text-gray-400 text-xs">Base</span>
                        ) : (
                          <button onClick={() => deleteCurrency(curr.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== MODIFICATION MANAGER MODAL ====================
const ModificationManagerModal = ({ isOpen, onClose, allItems, onRefresh, tables }) => {
  const [items, setItems] = useState([]);
  const [newMod, setNewMod] = useState({ name: '', unit: '', qty: '', costPerUnit: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      const combined = [...allItems];
      
      const usedMods = new Map();
      tables.forEach(table => {
        table.rows.forEach(row => {
          if (row.modification && row.modification.trim() !== '') {
            const exists = combined.some(item => item.name === row.modification);
            
            if (!exists && !usedMods.has(row.modification)) {
              usedMods.set(row.modification, {
                id: 'temp_' + Date.now() + Math.random(),
                name: row.modification,
                modification: row.modification,
                unit: row.unit || '',
                defaultQty: parseFloat(row.qty) || 1,
                costPerUnit: parseFloat(row.f4Price) || 0,
                isDefault: false
              });
            }
          }
        });
      });
      
      usedMods.forEach(mod => combined.push(mod));
      setItems(combined);
    }
  }, [isOpen, allItems, tables]);

  if (!isOpen) return null;

  const addMod = async () => {
    if (newMod.name && newMod.costPerUnit) {
      try {
        await window.electronAPI.items.create({
          name: newMod.name,
          modification: newMod.name,
          unit: newMod.unit || '',
          defaultQty: parseFloat(newMod.qty) || 1,
          costPerUnit: parseFloat(newMod.costPerUnit),
          isDefault: false
        });
        setNewMod({ name: '', unit: '', qty: '', costPerUnit: '' });
        await onRefresh();
      } catch (error) {
        console.error('Error adding modification:', error);
        alert('Error adding modification: ' + error.message);
      }
    }
  };

  const updateMod = async (id, field, value) => {
    try {
      if (typeof id === 'string' && id.startsWith('temp_')) {
        return;
      }

      const item = items.find(i => i.id === id);
      if (item) {
        const updatedItem = { ...item };
        if (field === 'name') {
          updatedItem.name = value;
          updatedItem.modification = value;
        } else if (field === 'unit') {
          updatedItem.unit = value;
        } else if (field === 'qty') {
          updatedItem.defaultQty = parseFloat(value) || 1;
        } else if (field === 'costPerUnit') {
          updatedItem.costPerUnit = parseFloat(value) || 0;
        }
        await window.electronAPI.items.update(id, updatedItem);
        await onRefresh();
      }
    } catch (error) {
      console.error('Error updating modification:', error);
      alert('Error updating modification: ' + error.message);
    }
  };

  const deleteMod = async (id) => {
    if (window.confirm('Are you sure you want to delete this modification?')) {
      try {
        await window.electronAPI.items.delete(id);
        await onRefresh();
      } catch (error) {
        console.error('Error deleting modification:', error);
        alert('Error deleting modification: ' + error.message);
      }
    }
  };

  const handleSave = () => {
    onClose();
  };

  const filteredMods = items.filter(mod => 
    searchTerm === '' || mod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Modifications</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={28} />
          </button>
        </div>

        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-semibold mb-3">Add New Modification</h4>
          <div className="grid grid-cols-5 gap-3">
            <input 
              type="text" 
              placeholder="Modification Name" 
              value={newMod.name} 
              onChange={(e) => setNewMod({ ...newMod, name: e.target.value })} 
              className="px-3 py-2 border border-gray-300 rounded" 
            />
            <input 
              type="text" 
              placeholder="Unit" 
              value={newMod.unit} 
              onChange={(e) => setNewMod({ ...newMod, unit: e.target.value })} 
              className="px-3 py-2 border border-gray-300 rounded" 
            />
            <input 
              type="number" 
              step="1" 
              placeholder="Default Qty" 
              value={newMod.qty} 
              onChange={(e) => setNewMod({ ...newMod, qty: e.target.value })} 
              className="px-3 py-2 border border-gray-300 rounded" 
            />
            <input 
              type="number" 
              step="0.01" 
              placeholder="F4 Cost per Unit" 
              value={newMod.costPerUnit} 
              onChange={(e) => setNewMod({ ...newMod, costPerUnit: e.target.value })} 
              className="px-3 py-2 border border-gray-300 rounded" 
            />
            <button onClick={addMod} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2 justify-center">
              <Plus /> Add
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-700">All Modifications ({items.length} items)</h4>
            <input 
              type="text" 
              placeholder="Search modifications..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded w-64"
            />
          </div>
          <div className="max-h-96 overflow-y-auto border border-gray-300 rounded">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">Modification Name</th>
                  <th className="border border-gray-300 px-3 py-2 text-left w-24">Unit</th>
                  <th className="border border-gray-300 px-3 py-2 text-left w-28">Default Qty</th>
                  <th className="border border-gray-300 px-3 py-2 text-left w-32">F4 Cost/Unit</th>
                  <th className="border border-gray-300 px-3 py-2 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredMods.map((mod) => {
                  const isTemp = typeof mod.id === 'string' && mod.id.startsWith('temp_');
                  return (
                    <tr key={mod.id} className={`hover:bg-gray-50 ${isTemp ? 'bg-yellow-50' : ''}`}>
                      <td className="border border-gray-300 px-2 py-1">
                        <input 
                          type="text" 
                          value={mod.name} 
                          onChange={(e) => updateMod(mod.id, 'name', e.target.value)} 
                          className="w-full px-2 py-1 border-0 focus:outline-none bg-transparent"
                          disabled={isTemp}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input 
                          type="text" 
                          value={mod.unit} 
                          onChange={(e) => updateMod(mod.id, 'unit', e.target.value)} 
                          className="w-full px-2 py-1 border-0 focus:outline-none bg-transparent text-center"
                          disabled={isTemp}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <input 
                          type="number" 
                          step="1" 
                          value={mod.defaultQty} 
                          onChange={(e) => updateMod(mod.id, 'qty', e.target.value)} 
                          className="w-full px-2 py-1 border-0 focus:outline-none bg-transparent text-center"
                          disabled={isTemp}
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        <div className="flex items-center justify-end gap-1">
                          <input 
                            type="number" 
                            step="0.01" 
                            value={mod.costPerUnit} 
                            onChange={(e) => updateMod(mod.id, 'costPerUnit', e.target.value)} 
                            className="w-full px-2 py-1 border-0 focus:outline-none bg-transparent text-right"
                            disabled={isTemp}
                          />
                          <span className="text-gray-600">€</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-center">
                        {isTemp ? (
                          <span className="text-gray-400 text-xs">Used</span>
                        ) : (
                          <button onClick={() => deleteMod(mod.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== PRECALCULATION TABLE ====================
const PrecalculationTable = ({ 
  table, 
  index, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  allItems,
  globalDate, 
  globalBy, 
  globalCurrency, 
  formatProjectNumber, 
  formatDrawingNumber, 
  allCurrencies, 
  isFirstTable, 
  isSalesView 
}) => {
  const [showDropdown, setShowDropdown] = useState({});

  const availableFinishSubtexts = FINISH_SUBTEXTS[table.finishType] || ["RAL 9010"];

  const addDefaultItemRow = () => {
    const newDefaultItems = [...table.defaultItems, { itemNumber: '', name: '', f3Cost: '' }];
    onUpdate(index, { ...table, defaultItems: newDefaultItems });
  };

  const updateDefaultItem = (itemIndex, field, value) => {
    const newDefaultItems = [...table.defaultItems];
    newDefaultItems[itemIndex][field] = value;
    onUpdate(index, { ...table, defaultItems: newDefaultItems });
  };

  const deleteDefaultItem = (itemIndex) => {
    if (table.defaultItems.length > 1) {
      const newDefaultItems = table.defaultItems.filter((_, i) => i !== itemIndex);
      onUpdate(index, { ...table, defaultItems: newDefaultItems });
    }
  };

  const addRow = () => {
    const newRows = [...table.rows, { modification: '', unit: '', qty: '', f4Price: '', f3Price: '' }];
    onUpdate(index, { ...table, rows: newRows });
  };

  const updateRow = (rowIndex, field, value) => {
    const newRows = [...table.rows];
    newRows[rowIndex][field] = value;
    
    if (field === 'modification') {
      const item = allItems.find(i => i.name === value);
      if (item) {
        newRows[rowIndex].unit = item.unit;
        newRows[rowIndex].qty = item.defaultQty;
        newRows[rowIndex].f4Price = item.costPerUnit;
        const margin = parseFloat(table.customMargin) || 40;
        const f3 = item.costPerUnit / (1 - margin / 100);
        newRows[rowIndex].f3Price = Math.ceil(f3);
        setShowDropdown({ ...showDropdown, [rowIndex]: false });
      }
    }
    
    if (field === 'f4Price') {
      const f4 = parseFloat(value) || 0;
      const margin = parseFloat(table.customMargin) || 40;
      const f3 = f4 / (1 - margin / 100);
      newRows[rowIndex].f3Price = Math.ceil(f3);
    }
    
    if (field === 'f3Price') {
      const f3 = parseFloat(value) || 0;
      const margin = parseFloat(table.customMargin) || 40;
      newRows[rowIndex].f4Price = (f3 * (1 - margin / 100));
    }
    
    onUpdate(index, { ...table, rows: newRows });
  };

  const deleteRow = (rowIndex) => {
    if (table.rows.length > 1) {
      const newRows = table.rows.filter((_, i) => i !== rowIndex);
      onUpdate(index, { ...table, rows: newRows });
    }
  };

  const getFilteredItems = (rowIndex) => {
    const searchValue = table.rows[rowIndex]?.modification || '';
    if (!searchValue) return allItems;
    return allItems.filter(item => 
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const handleCustomMarginChange = (value) => {
    const margin = parseFloat(value) || 0;
    const newRows = table.rows.map(row => {
      if (row.f4Price) {
        const f4 = parseFloat(row.f4Price) || 0;
        const f3 = f4 / (1 - margin / 100);
        return { ...row, f3Price: Math.ceil(f3) };
      }
      return row;
    });
    onUpdate(index, { ...table, customMargin: value, rows: newRows });
  };

  const defaultItemsTotal = table.defaultItems.reduce((sum, item) => sum + (parseFloat(item.f3Cost) || 0), 0);
  
  const modificationsCostF3 = table.rows.reduce((sum, row) => {
    const qty = parseFloat(row.qty) || 0;
    const f3 = parseFloat(row.f3Price) || 0;
    return sum + (qty * f3);
  }, 0);

  const modificationsCostF4 = table.rows.reduce((sum, row) => {
    const qty = parseFloat(row.qty) || 0;
    const f4 = parseFloat(row.f4Price) || 0;
    return sum + (qty * f4);
  }, 0);
  
  const totalCost = Math.round(defaultItemsTotal + modificationsCostF3);
  
  const emcMargin = totalCost > 0 ? ((totalCost - modificationsCostF4) / totalCost * 100) : 0;

  const selectedCurrency = allCurrencies.find(c => c.code === globalCurrency);
  const currencyRate = selectedCurrency ? selectedCurrency.rate : 1;

  const handleProjectNumberChange = (value) => {
    const upperValue = value.toUpperCase();
    const formatted = formatProjectNumber(upperValue);
    const parts = formatted.split('-');
    let drawingNumberBase = '';
    if (parts.length >= 2) {
      drawingNumberBase = parts[0] + '-' + parts[1];
    }
    onUpdate(index, { ...table, projectNumber: formatted, drawingNumber: drawingNumberBase ? drawingNumberBase + '-' : '' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 print-page">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{table.projectNumber || 'New Project'}</h2>
        <div className="flex gap-2 no-print">
          <button onClick={() => onDuplicate(index)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Duplicate">
            <Copy />
          </button>
          <button onClick={() => onDelete(index)} className="p-2 text-red-600 hover:bg-red-50 rounded" title={isFirstTable ? "Clear Data" : "Delete"}>
            <Trash2 />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Finish Type</label>
          <select 
            value={table.finishType} 
            onChange={(e) => {
              const newType = e.target.value;
              const newSubtexts = FINISH_SUBTEXTS[newType];
              onUpdate(index, { 
                ...table, 
                finishType: newType,
                finishSubtext: newSubtexts[0],
                finishSubtextCustom: ''
              });
            }} 
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded"
          >
            {FINISH_TYPES.map(f => (
              <option key={f} value={f}>
                {f} {FINISH_DESCRIPTIONS[f] ? `(${FINISH_DESCRIPTIONS[f]})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Finish Detail</label>
          {table.finishSubtext === 'Custom' ? (
            <div className="flex gap-2">
              <input 
                type="text" 
                value={table.finishSubtextCustom} 
                onChange={(e) => onUpdate(index, { ...table, finishSubtextCustom: e.target.value })} 
                className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded" 
              />
              <button 
                onClick={() => onUpdate(index, { ...table, finishSubtext: availableFinishSubtexts[0], finishSubtextCustom: '' })} 
                className="h-10 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 no-print"
              >
                ✕
              </button>
            </div>
          ) : (
            <select 
              value={table.finishSubtext} 
              onChange={(e) => onUpdate(index, { ...table, finishSubtext: e.target.value })} 
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded"
            >
              {availableFinishSubtexts.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          )}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Number</label>
          <input 
            type="text" 
            value={table.projectNumber} 
            onChange={(e) => handleProjectNumberChange(e.target.value)} 
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded font-mono uppercase" 
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Drawing Number</label>
          <input 
            type="text" 
            value={table.drawingNumber} 
            onChange={(e) => { 
              const formatted = formatDrawingNumber(e.target.value); 
              onUpdate(index, { ...table, drawingNumber: formatted }); 
            }} 
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded font-mono" 
          />
          <input 
            type="text" 
            value={table.drawingNumberSubtext} 
            onChange={(e) => onUpdate(index, { ...table, drawingNumberSubtext: e.target.value })} 
            className="w-full h-8 px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 mt-1" 
            placeholder="Configuration"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
          <input 
            type="number" 
            step="0.1" 
            value={table.weight} 
            onChange={(e) => onUpdate(index, { ...table, weight: e.target.value })} 
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded" 
          />
        </div>
        <div className="col-span-1 no-print">
          <label className="block text-sm font-medium text-gray-700 mb-2">Margin %</label>
          <input 
            type="number" 
            step="1" 
            value={table.customMargin || ''} 
            onChange={(e) => handleCustomMarginChange(e.target.value)} 
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded" 
          />
        </div>
        <div className="col-span-12">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description Name</label>
          <input 
            type="text" 
            value={table.descriptionName} 
            onChange={(e) => onUpdate(index, { ...table, descriptionName: e.target.value })} 
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded description-name-print" 
          />
        </div>
      </div>


      <h3 className="text-lg font-semibold mb-3 text-gray-700">Items & Modifications</h3>
      
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <h4 className="font-medium text-gray-600">Default Items</h4>
          <button 
            onClick={addDefaultItemRow} 
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 text-sm no-print"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left w-32">Item Number</th>
              <th className="border border-gray-300 px-3 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-3 py-2 text-left w-32">F3 Cost (EUR)</th>
              <th className="border border-gray-300 px-3 py-2 w-12 no-print"></th>
            </tr>
          </thead>
          <tbody>
            {table.defaultItems.map((item, itemIndex) => (
              <tr key={itemIndex}>
                <td className="border border-gray-300 px-2 py-1">
                  <input 
                    type="text" 
                    value={item.itemNumber} 
                    onChange={(e) => updateDefaultItem(itemIndex, 'itemNumber', e.target.value)} 
                    className="w-full px-2 py-1 border-0 focus:outline-none bg-transparent" 
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input 
                    type="text" 
                    value={item.name} 
                    onChange={(e) => updateDefaultItem(itemIndex, 'name', e.target.value)} 
                    className="w-full px-2 py-1 border-0 focus:outline-none bg-transparent" 
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input 
                    type="number" 
                    step="0.01" 
                    value={item.f3Cost} 
                    onChange={(e) => updateDefaultItem(itemIndex, 'f3Cost', e.target.value)} 
                    className="w-full px-2 py-1 border-0 focus:outline-none bg-transparent" 
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center no-print">
                  <button 
                    onClick={() => deleteDefaultItem(itemIndex)} 
                    className="text-red-600 hover:text-red-800"
                    disabled={table.defaultItems.length === 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <h4 className="font-medium text-gray-600">Modifications</h4>
        <button 
          onClick={addRow} 
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 text-sm no-print"
        >
          <Plus size={14} /> Add Row
        </button>
      </div>
      
      <div style={{ overflow: 'visible' }} className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 text-left w-96">Modification</th>
              {!isSalesView && <th className="border border-gray-300 px-3 py-2 text-left w-20">Unit</th>}
              {!isSalesView && <th className="border border-gray-300 px-3 py-2 text-left w-24">Qty</th>}
              {!isSalesView && <th className="border border-gray-300 px-3 py-2 text-left w-32">F4 Price (EUR)</th>}
              <th className="border border-gray-300 px-3 py-2 text-left w-32">F3 Price (EUR)</th>
              <th className="border border-gray-300 px-3 py-2 w-12 no-print"></th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => {
              const qty = parseFloat(row.qty) || 0;
              const f3Price = parseFloat(row.f3Price) || 0;
              const totalRowF3 = Math.ceil(qty * f3Price);
              
              return (
                <tr key={rowIndex}>
                  <td className="border border-gray-300 px-2 py-1" style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      value={row.modification} 
                      onChange={(e) => { 
                        updateRow(rowIndex, 'modification', e.target.value); 
                        setShowDropdown({ ...showDropdown, [rowIndex]: true }); 
                      }} 
                      onFocus={() => setShowDropdown({ ...showDropdown, [rowIndex]: true })} 
                      onBlur={() => setTimeout(() => setShowDropdown({ ...showDropdown, [rowIndex]: false }), 200)} 
                      className="w-full px-2 py-1 border-0 focus:outline-none" 
                    />
                    {showDropdown[rowIndex] && getFilteredItems(rowIndex).length > 0 && (
                      <div 
                        style={{ 
                          position: 'absolute', 
                          top: '100%', 
                          left: 0, 
                          zIndex: 1000, 
                          width: '400px', 
                          maxHeight: '300px', 
                          overflowY: 'auto', 
                          backgroundColor: 'white', 
                          border: '1px solid #d1d5db', 
                          borderRadius: '4px', 
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                        }} 
                        className="no-print"
                      >
                        {getFilteredItems(rowIndex).map((item, i) => (
                          <div 
                            key={i} 
                            style={{ 
                              padding: '8px 12px', 
                              cursor: 'pointer', 
                              borderBottom: '1px solid #f3f4f6' 
                            }} 
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#dbeafe'} 
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'} 
                            onMouseDown={() => updateRow(rowIndex, 'modification', item.name)}
                          >
                            {item.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  {!isSalesView && (
                    <td className="border border-gray-300 px-2 py-1">
                      <input 
                        type="text" 
                        value={row.unit} 
                        onChange={(e) => updateRow(rowIndex, 'unit', e.target.value)} 
                        className="w-full px-2 py-1 border-0 focus:outline-none text-center" 
                      />
                    </td>
                  )}
                  {!isSalesView && (
                    <td className="border border-gray-300 px-2 py-1">
                      <input 
                        type="number" 
                        step="1" 
                        value={row.qty} 
                        onChange={(e) => updateRow(rowIndex, 'qty', e.target.value)} 
                        className="w-full px-2 py-1 border-0 focus:outline-none text-right" 
                      />
                    </td>
                  )}
                  {!isSalesView && (
                    <td className="border border-gray-300 px-2 py-1">
                      <input 
                        type="number" 
                        step="0.01" 
                        value={row.f4Price} 
                        onChange={(e) => updateRow(rowIndex, 'f4Price', e.target.value)} 
                        className="w-full px-2 py-1 border-0 focus:outline-none text-right" 
                      />
                    </td>
                  )}
                  <td className="border border-gray-300 px-2 py-1 bg-green-50">
                    {isSalesView ? (
                      <div className="px-2 py-1 font-semibold text-right text-green-900">{totalRowF3}</div>
                    ) : (
                      <input 
                        type="number" 
                        step="1" 
                        value={row.f3Price} 
                        onChange={(e) => updateRow(rowIndex, 'f3Price', e.target.value)} 
                        className="w-full px-2 py-1 border-0 focus:outline-none bg-transparent font-semibold text-right" 
                      />
                    )}
                  </td>
                  <td className="border border-gray-300 px-2 py-1 text-center no-print">
                    <button 
                      onClick={() => deleteRow(rowIndex)} 
                      className="text-red-600 hover:text-red-800"
                      disabled={table.rows.length === 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div></div>
        <div className="bg-gray-50 p-4 rounded space-y-3 summary-box">
          {!isSalesView && (
            <div className="flex justify-between text-sm">
              <span>Item Price:</span>
              <span className="font-medium">{defaultItemsTotal.toFixed(2)} €</span>
            </div>
          )}
          {!isSalesView && (
            <div className="flex justify-between text-sm">
              <span>Modification Price:</span>
              <span className="font-medium">{modificationsCostF3.toFixed(2)} €</span>
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex justify-between font-bold text-xl text-green-700 bg-green-50 p-3 rounded border-t-2 border-green-700 cost-total-print">
              <span>Cost Total:</span>
              <span>{totalCost.toFixed(0)} €</span>
            </div>
          </div>
          {!isSalesView && (
            <div className="flex justify-between text-sm border-t pt-2 print-hide-emc-margin">
              <span>EMC Margin:</span>
              <span className="font-semibold">{emcMargin.toFixed(0)}%</span>
            </div>
          )}
          {globalCurrency !== 'EUR' && (
            <div className="flex flex-col">
              <div className="flex justify-between font-bold text-xl text-blue-700 bg-blue-50 p-3 rounded border-t-2 border-blue-700 cost-total-print">
                <span>Cost Total ({globalCurrency}):</span>
                <span>{Math.round(totalCost * currencyRate).toFixed(0)} {globalCurrency}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1 exchange-rate-print">
                Exchange rate: 1 EUR = {currencyRate.toFixed(4)} {globalCurrency}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP COMPONENT ====================
function App() {
  const [globalDate, setGlobalDate] = useState(new Date().toISOString().split('T')[0]);
  const [globalBy, setGlobalBy] = useState("MDT");
  const [globalByCustom, setGlobalByCustom] = useState(false);
  const [globalCurrency, setGlobalCurrency] = useState("EUR");
  const [isSalesView, setIsSalesView] = useState(false);
  
  const [allItems, setAllItems] = useState([]);
  const [allCurrencies, setAllCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [tables, setTables] = useState([{ 
    id: Date.now(), 
    descriptionName: "", 
    drawingNumber: "", 
    drawingNumberSubtext: "",
    projectNumber: "", 
    finishType: "SW",
    finishSubtext: "RAL 9010",
    finishSubtextCustom: "",
    weight: "", 
    customMargin: "",
    defaultItems: [{ itemNumber: '', name: '', f3Cost: '' }], 
    rows: [{ modification: '', unit: '', qty: '', f4Price: '', f3Price: '' }] 
  }]);
  
  const [showModManager, setShowModManager] = useState(false);
  const [showCurrencyManager, setShowCurrencyManager] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showImportMenu, setShowImportMenu] = useState(false);

  // Load data from database on mount
  useEffect(() => {
    loadDatabaseData();
  }, []);

  const loadDatabaseData = async () => {
    try {
      setIsLoading(true);
      console.log('Loading database data...');
      
      const [items, currencies] = await Promise.all([
        window.electronAPI.items.getAll(),
        window.electronAPI.currencies.getAll()
      ]);
      
      console.log('Loaded items:', items.length);
      console.log('Loaded currencies:', currencies.length);
      
      setAllItems(items);
      setAllCurrencies(currencies);
      
      // Set default currency if EUR exists
      const eurCurrency = currencies.find(c => c.code === 'EUR');
      if (eurCurrency) {
        setGlobalCurrency('EUR');
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading database data:', error);
      alert('Error loading data from database: ' + error.message);
      setIsLoading(false);
    }
  };

  // Format functions
  const formatProjectNumber = (value) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 4) formatted = cleaned.slice(0, 4) + '-' + cleaned.slice(4);
    if (cleaned.length > 7) formatted = cleaned.slice(0, 4) + '-' + cleaned.slice(4, 7) + '-' + cleaned.slice(7);
    return formatted;
  };

  const formatDrawingNumber = (value) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 4) formatted = cleaned.slice(0, 4) + '-' + cleaned.slice(4);
    if (cleaned.length > 7) formatted = cleaned.slice(0, 4) + '-' + cleaned.slice(4, 7) + '-' + cleaned.slice(7, 10);
    return formatted;
  };

  // Table operations
  const addTable = () => {
    const lastTable = tables[tables.length - 1];
    setTables([...tables, { 
      id: Date.now(), 
      descriptionName: "", 
      drawingNumber: lastTable.drawingNumber || "", 
      drawingNumberSubtext: lastTable.drawingNumberSubtext || "",
      projectNumber: lastTable.projectNumber || "", 
      finishType: "SW",
      finishSubtext: "RAL 9010",
      finishSubtextCustom: "",
      weight: "", 
      customMargin: "",
      defaultItems: [{ itemNumber: '', name: '', f3Cost: '' }], 
      rows: [{ modification: '', unit: '', qty: '', f4Price: '', f3Price: '' }] 
    }]);
  };

  const updateTable = (index, updatedTable) => {
    const newTables = [...tables];
    newTables[index] = updatedTable;
    setTables(newTables);
  };

  const deleteTable = (index) => {
    if (index === 0 && tables.length === 1) {
      setTables([{ 
        id: Date.now(), 
        descriptionName: "", 
        drawingNumber: "", 
        drawingNumberSubtext: "",
        projectNumber: "", 
        finishType: "SW",
        finishSubtext: "RAL 9010",
        finishSubtextCustom: "",
        weight: "", 
        customMargin: "",
        defaultItems: [{ itemNumber: '', name: '', f3Cost: '' }], 
        rows: [{ modification: '', unit: '', qty: '', f4Price: '', f3Price: '' }] 
      }]);
    } else if (tables.length > 1) {
      setTables(tables.filter((_, i) => i !== index));
    }
  };

  const duplicateTable = (index) => {
    const tableToDuplicate = { ...tables[index], id: Date.now() };
    const newTables = [...tables];
    newTables.splice(index + 1, 0, tableToDuplicate);
    setTables(newTables);
  };

  // Export/Import functions (keep same as before)
  const exportToPDF = async () => {
    try {
      if (isSalesView) {
        document.body.classList.add('sales-view-mode');
      }
      await window.electronAPI.app.print();
      document.body.classList.remove('sales-view-mode');
      setShowExportMenu(false);
    } catch (error) {
      console.error('Error printing:', error);
      alert('Error printing document');
    }
  };

  const exportToXML = async () => {
    try {
      let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xmlContent += '<Precalculations>\n';
      xmlContent += `  <Metadata>\n`;
      xmlContent += `    <Date>${globalDate}</Date>\n`;
      xmlContent += `    <By>${globalBy}</By>\n`;
      xmlContent += `    <Currency>${globalCurrency}</Currency>\n`;
      xmlContent += `    <ViewMode>${isSalesView ? 'Sales' : 'Full'}</ViewMode>\n`;
      xmlContent += `  </Metadata>\n`;
      
      tables.forEach((table, tableIndex) => {
        xmlContent += `  <Project id="${tableIndex + 1}">\n`;
        xmlContent += `    <ProjectNumber>${table.projectNumber || ''}</ProjectNumber>\n`;
        xmlContent += `    <DrawingNumber>${table.drawingNumber || ''}</DrawingNumber>\n`;
        xmlContent += `    <DrawingNumberSubtext>${table.drawingNumberSubtext || ''}</DrawingNumberSubtext>\n`;
        xmlContent += `    <DescriptionName>${table.descriptionName || ''}</DescriptionName>\n`;
        xmlContent += `    <FinishType>${table.finishType || 'SW'}</FinishType>\n`;
        xmlContent += `    <FinishSubtext>${table.finishSubtext || 'RAL 9010'}</FinishSubtext>\n`;
        xmlContent += `    <FinishSubtextCustom>${table.finishSubtextCustom || ''}</FinishSubtextCustom>\n`;
        xmlContent += `    <Weight>${table.weight || ''}</Weight>\n`;
        xmlContent += `    <CustomMargin>${table.customMargin || ''}</CustomMargin>\n`;
        
        xmlContent += `    <DefaultItems>\n`;
        table.defaultItems.forEach((item, itemIndex) => {
          if (item.name || item.itemNumber || item.f3Cost) {
            xmlContent += `      <Item id="${itemIndex + 1}">\n`;
            xmlContent += `        <ItemNumber>${item.itemNumber || ''}</ItemNumber>\n`;
            xmlContent += `        <Name>${item.name || ''}</Name>\n`;
            xmlContent += `        <F3Cost>${item.f3Cost || ''}</F3Cost>\n`;
            xmlContent += `      </Item>\n`;
          }
        });
        xmlContent += `    </DefaultItems>\n`;
        
        xmlContent += `    <Modifications>\n`;
        table.rows.forEach((row, rowIndex) => {
          if (row.modification) {
            xmlContent += `      <Modification id="${rowIndex + 1}">\n`;
            xmlContent += `        <Name>${row.modification || ''}</Name>\n`;
            xmlContent += `        <Unit>${row.unit || ''}</Unit>\n`;
            xmlContent += `        <Qty>${row.qty || ''}</Qty>\n`;
            xmlContent += `        <F4Price>${row.f4Price || ''}</F4Price>\n`;
            xmlContent += `        <F3Price>${row.f3Price || ''}</F3Price>\n`;
            xmlContent += `      </Modification>\n`;
          }
        });
        xmlContent += `    </Modifications>\n`;
        xmlContent += `  </Project>\n`;
      });
      
      xmlContent += '</Precalculations>';

      const firstTable = tables[0];
      const projectNum = firstTable.projectNumber || 'PROJECT';
      
      const result = await window.electronAPI.dialog.saveFile({
        title: 'Export to XML',
        defaultPath: `${projectNum}_precalculation.xml`,
        filters: [
          { name: 'XML Files', extensions: ['xml'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (!result.canceled && result.filePath) {
        await window.electronAPI.fs.writeFile(result.filePath, xmlContent);
        alert('XML file exported successfully!');
      }
      
      setShowExportMenu(false);
    } catch (error) {
      console.error('XML export error:', error);
      alert('Error exporting to XML: ' + error.message);
    }
  };

  const loadXML = async () => {
    try {
      const result = await window.electronAPI.dialog.openFile({
        title: 'Import XML',
        filters: [
          { name: 'XML Files', extensions: ['xml'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
        return;
      }

      const xmlText = await window.electronAPI.fs.readFile(result.filePaths[0]);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const parseError = xmlDoc.getElementsByTagName('parsererror');
      if (parseError.length > 0) {
        throw new Error('Invalid XML file');
      }
      
      const metadata = xmlDoc.getElementsByTagName('Metadata')[0];
      if (metadata) {
        const dateNode = metadata.getElementsByTagName('Date')[0];
        const byNode = metadata.getElementsByTagName('By')[0];
        const currencyNode = metadata.getElementsByTagName('Currency')[0];
        const viewModeNode = metadata.getElementsByTagName('ViewMode')[0];
        
        if (dateNode) setGlobalDate(dateNode.textContent);
        if (byNode) setGlobalBy(byNode.textContent);
        if (currencyNode) setGlobalCurrency(currencyNode.textContent);
        if (viewModeNode) setIsSalesView(viewModeNode.textContent === 'Sales');
      }
      
      const projects = xmlDoc.getElementsByTagName('Project');
      const newTables = [];
      
      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const table = {
          id: Date.now() + i,
          projectNumber: project.getElementsByTagName('ProjectNumber')[0]?.textContent || '',
          drawingNumber: project.getElementsByTagName('DrawingNumber')[0]?.textContent || '',
          drawingNumberSubtext: project.getElementsByTagName('DrawingNumberSubtext')[0]?.textContent || '',
          descriptionName: project.getElementsByTagName('DescriptionName')[0]?.textContent || '',
          finishType: project.getElementsByTagName('FinishType')[0]?.textContent || 'SW',
          finishSubtext: project.getElementsByTagName('FinishSubtext')[0]?.textContent || 'RAL 9010',
          finishSubtextCustom: project.getElementsByTagName('FinishSubtextCustom')[0]?.textContent || '',
          weight: project.getElementsByTagName('Weight')[0]?.textContent || '',
          customMargin: project.getElementsByTagName('CustomMargin')[0]?.textContent || '',
          defaultItems: [],
          rows: []
        };
        
        const defaultItems = project.getElementsByTagName('DefaultItems')[0];
        if (defaultItems) {
          const items = defaultItems.getElementsByTagName('Item');
          for (let j = 0; j < items.length; j++) {
            const item = items[j];
            table.defaultItems.push({
              itemNumber: item.getElementsByTagName('ItemNumber')[0]?.textContent || '',
              name: item.getElementsByTagName('Name')[0]?.textContent || '',
              f3Cost: item.getElementsByTagName('F3Cost')[0]?.textContent || ''
            });
          }
        }
        
        if (table.defaultItems.length === 0) {
          table.defaultItems = [{ itemNumber: '', name: '', f3Cost: '' }];
        }
        
        const modifications = project.getElementsByTagName('Modifications')[0];
        if (modifications) {
          const mods = modifications.getElementsByTagName('Modification');
          for (let j = 0; j < mods.length; j++) {
            const mod = mods[j];
            table.rows.push({
              modification: mod.getElementsByTagName('Name')[0]?.textContent || '',
              unit: mod.getElementsByTagName('Unit')[0]?.textContent || '',
              qty: mod.getElementsByTagName('Qty')[0]?.textContent || '',
              f4Price: mod.getElementsByTagName('F4Price')[0]?.textContent || '',
              f3Price: mod.getElementsByTagName('F3Price')[0]?.textContent || ''
            });
          }
        }
        
        if (table.rows.length === 0) {
          table.rows = [{ modification: '', unit: '', qty: '', f4Price: '', f3Price: '' }];
        }
        
        newTables.push(table);
      }
      
      if (newTables.length > 0) {
        setTables(newTables);
        alert(`XML file loaded successfully! Imported ${newTables.length} project(s).`);
      } else {
        alert('No project data found in XML file');
      }
      
      setShowImportMenu(false);
    } catch (error) {
      console.error('XML import error:', error);
      alert('Error loading XML file: ' + error.message);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800 mb-4">Loading...</div>
          <div className="text-gray-600">Loading database...</div>
        </div>
      </div>
    );
  }

  // Show error state if no data loaded
  if (allItems.length === 0 || allCurrencies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-2xl font-bold text-red-600 mb-4">Database Error</div>
          <div className="text-gray-600 mb-4">
            Failed to load database. Please check the console for errors.
          </div>
          <button 
            onClick={loadDatabaseData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Precalculation</h1>
          <div className="flex gap-3 no-print">
            <button 
              onClick={() => setShowModManager(true)} 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Edit /> Manage Modifications ({allItems.length})
            </button>
            <button 
              onClick={() => setShowCurrencyManager(true)} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Edit /> Manage Currencies ({allCurrencies.length})
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)} 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download /> Export <ChevronDown />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <button 
                    onClick={exportToPDF} 
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 rounded-t-lg"
                  >
                    <FileText size={16} /> Export PDF
                  </button>
                  <button 
                    onClick={exportToXML} 
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 rounded-b-lg"
                  >
                    <FileText size={16} /> Export XML
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowImportMenu(!showImportMenu)} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Upload /> Import <ChevronDown />
              </button>
              {showImportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <button 
                    onClick={loadXML} 
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 rounded-t-lg"
                  >
                    <Upload size={16} /> Import XML
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6 bg-white rounded-lg shadow-md p-6 no-print">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Global Settings</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Calendar /> Calculated Date
              </label>
              <input 
                type="date" 
                value={globalDate} 
                onChange={(e) => setGlobalDate(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <User /> By
              </label>
              {globalByCustom ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={globalBy} 
                    onChange={(e) => setGlobalBy(e.target.value)} 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded" 
                  />
                  <button 
                    onClick={() => { setGlobalByCustom(false); setGlobalBy('MDT'); }} 
                    className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <select 
                  value={globalBy} 
                  onChange={(e) => { 
                    if (e.target.value === 'custom') { 
                      setGlobalByCustom(true); 
                      setGlobalBy(''); 
                    } else { 
                      setGlobalBy(e.target.value); 
                    } 
                  }} 
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="MDT">MDT</option>
                  <option value="VLK">VLK</option>
                  <option value="custom">-- Custom --</option>
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select 
                value={globalCurrency} 
                onChange={(e) => setGlobalCurrency(e.target.value)} 
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                {allCurrencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">View Mode</label>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-600">Full View</span>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={isSalesView} 
                    onChange={(e) => setIsSalesView(e.target.checked)} 
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className="text-sm text-gray-600">Sales View</span>
              </div>
            </div>
          </div>
        </div>

        {tables.map((table, index) => (
          <PrecalculationTable 
            key={table.id} 
            table={table} 
            index={index} 
            onUpdate={updateTable} 
            onDelete={deleteTable} 
            onDuplicate={duplicateTable} 
            allItems={allItems}
            globalDate={globalDate} 
            globalBy={globalBy} 
            globalCurrency={globalCurrency} 
            formatProjectNumber={formatProjectNumber} 
            formatDrawingNumber={formatDrawingNumber} 
            allCurrencies={allCurrencies}
            isFirstTable={index === 0 && tables.length === 1}
            isSalesView={isSalesView}
          />
        ))}

        <div className="flex justify-center mt-8">
          <button 
            onClick={addTable} 
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium text-lg shadow-md no-print"
          >
            <Plus size={24} /> Add New Project
          </button>
        </div>
      </div>

      <ModificationManagerModal 
        isOpen={showModManager} 
        onClose={() => setShowModManager(false)} 
        allItems={allItems}
        onRefresh={loadDatabaseData}
        tables={tables}
      />

      <CurrencyManagerModal 
        isOpen={showCurrencyManager} 
        onClose={() => setShowCurrencyManager(false)} 
        allCurrencies={allCurrencies}
        onRefresh={loadDatabaseData}
        currentCurrency={globalCurrency}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
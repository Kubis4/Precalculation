class ItemsService {
  constructor(dbManager) {
    this.db = dbManager;
  }

  getAll() {
    return this.db.getAllItems();
  }

  create(item) {
    return this.db.createItem(item);
  }

  update(id, item) {
    return this.db.updateItem(id, item);
  }

  delete(id) {
    return this.db.deleteItem(id);
  }
}

module.exports = ItemsService;

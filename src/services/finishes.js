class FinishesService {
  constructor(dbManager) {
    this.db = dbManager;
  }

  getAll() {
    return this.db.getAllFinishes();
  }

  create(finish) {
    return this.db.createFinish(finish);
  }

  delete(id) {
    return this.db.deleteFinish(id);
  }
}

module.exports = FinishesService;

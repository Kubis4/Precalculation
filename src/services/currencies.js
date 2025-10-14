class CurrenciesService {
  constructor(dbManager) {
    this.db = dbManager;
  }

  getAll() {
    return this.db.getAllCurrencies();
  }

  create(currency) {
    return this.db.createCurrency(currency);
  }

  update(id, currency) {
    return this.db.updateCurrency(id, currency);
  }

  delete(id) {
    return this.db.deleteCurrency(id);
  }
}

module.exports = CurrenciesService;

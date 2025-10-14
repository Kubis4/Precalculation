class ProjectsService {
  constructor(dbManager) {
    this.db = dbManager;
  }

  getAll() {
    return this.db.getAllProjects();
  }

  create(project) {
    return this.db.createProject(project);
  }

  update(id, project) {
    return this.db.updateProject(id, project);
  }

  delete(id) {
    return this.db.deleteProject(id);
  }
}

module.exports = ProjectsService;

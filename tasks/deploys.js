class DeployProcessor {

  constructor(app) {
    this.app = app;
    this.deployProcesses = Object.getOwnPropertyNames(this.prototype);
  }

  getDeployProcesses() {
    console.log(this.deployProcesses);
  }

}

module.exports = {
  DeployProcessor,
}

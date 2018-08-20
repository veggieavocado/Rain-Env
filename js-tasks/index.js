const { getServerNames,
        listServerRegions,
        listOSTypes,
        listPlanList,
        createServer,
        deleteServer,
} = require('./vultr.js');

const { initTable, initTrigger, updateData } = require('./postgres.js')

module.exports = {
  getServerNames,
  listServerRegions,
  listOSTypes,
  listPlanList,
  createServer,
  deleteServer,

  initTable,
  initTrigger,
  updateData,
}

export default {
  content: {
    portName: '港口',
    searchList: '查询条件',
    portList: [
      {
        Currently: '当前在港',
        text: '0'
      },
      {
        Currently: '预计到港',
        text: '1'
      },
      {
        Currently: '历史到港',
        text: '2'
      }
    ],
    button: '港口排队',
    timezone: '时间范围',
    Routestate: '航线状态',
    static: '静止',
    Sail: '航行',
    allWeight: '总载重',
    queuingPlan: '港口排队计划'
  },
  tableList: {
    No: '序号',
    shipName: '船名',
    imo: 'IMO',
    mmsi: 'MMSI',
    sizeType: '船舶类型',
    sdwt: '载重吨',
    draft: '最大吃水',
    draught: '到港吃水',
    fromPort: '上一港',
    ata: '到港时间',
    berthTime: '在港时间(h)',
    eta: '实际到港时间/预计到港时间',
    Speed: '航速',
    rTime: '更新时间',
    draughtOut: '离港吃水',
    atd: '离港时间'
  }
}

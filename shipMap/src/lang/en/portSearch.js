export default {
  content: {
    portName: 'Port',
    searchList: 'Condition-Port Search',
    portList: [
      {
        Currently: 'Vessels at port ',
        text: '0'
      },
      {
        Currently: 'Vessels will arrive port',
        text: '1'
      },
      {
        Currently: 'Vessels have left port',
        text: '2'
      }
    ],
    button: 'Line Up',
    timezone: 'Time Range',
    Routestate: 'Status',
    static: 'Anchored',
    Sail: 'Under way using engine',
    allWeight: 'total Vessel Capacity',
    queuingPlan: 'Terminal Line Up'
  },
  tableList: {
    No: 'No.',
    shipName: 'Vessel Name',
    imo: 'IMO',
    mmsi: 'MMSI',
    sizeType: 'Vessel Type',
    sdwt: 'DWT',
    draft: 'Max Draught',
    draught: 'Arrival Draught',
    fromPort: 'Previous Port',
    ata: 'ATA',
    berthTime: 'Hours in Port(h)',
    eta: 'ATA/ETA',
    Speed: 'Speed',
    rTime: 'Last Updated',
    draughtOut: 'Departure Draught',
    atd: 'ATD'
  }
}

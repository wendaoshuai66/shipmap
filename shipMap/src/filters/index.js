// set function parseTime,formatTime to filter
export { parseTime, formatTime } from '@/utils'
import moment from 'moment'

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

// 货币格式化千分位加逗号
export function numFormat(value) {
  if (!value) {
    return '0'
  }
  const intPart = Number(value).toFixed(0)
  const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  let floatPart = ''
  let value2Array = null
  if ((value.toString()).indexOf('.') !== -1) {
    value2Array = value.toString().split('.')
  } else {
    value2Array = []
  }
  if (value2Array.length === 2) {
    floatPart = value2Array[1].toString()
    if (floatPart === 0) {
      return intPartFormat
    } else {
      return intPartFormat + '.' + floatPart.slice(0, 2)
    }
  } else {
    return intPartFormat + floatPart
  }
}

// 毫秒数转化为小时
export function timeNum(index) {
  let num = 0
  if (!index) {
    num = ''
  } else {
    num = Number(Math.floor((index / 1000 / 3600) * 100) / 100)
  }
  return num
}

export function formatTimes(index) {
  if (index) {
    return ''
  }
  return moment(Number(index)).format('YYYY-MM-DD HH:mm:ss')
}

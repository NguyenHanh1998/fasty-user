import moment from 'moment'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'

const amountRegex = /^[0-9.+-e]*$/
export function splitZero (value) {
  if (!value || !amountRegex.test(value)) {
    return '0.' + Array.from(Array((1))).map(_ => '0').join('')
  }
  const decimals = value.split('.')[1] ? value.split('.')[1].length : 0
  const maxLength = value.length
  let splitCounter = 0
  switch (decimals) {
    case 0:
      return value + '.' + Array.from(Array((1))).map(_ => '0').join('')
    case 1:
      return value
    default:
      for (let i = decimals; i > 0; i--) {
        const char = value.charAt(value.split('.')[0].length + i)
        if (char !== '0') {
          break
        }
        if (char === '0') {
          splitCounter++
        }
      }
      return value.substring(0, decimals - splitCounter >= 1 ? maxLength - splitCounter : maxLength - splitCounter + 1)
  }
}

export function formatNumberAsText (value, decimals) {
  if (!value || !amountRegex.test(value)) {
    return '0'
  }
  if (decimals) {
    return new BigNumber(value.toString()).decimalPlaces(decimals).toFormat()
  }
  return new BigNumber(value.toString()).toFormat()
}

export function convertUnitToReal (amount, decimals = 18) {
  if (!amount || !amountRegex.test(amount)) {
    return new BigNumber(0)
  }
  return new BigNumber(amount.toString()).div(new BigNumber(10).pow(decimals))
}

export function convertRealAmountToUnit (amount, decimals = 18) {
  if (!amount || !amountRegex.test(amount)) {
    return new BigNumber(0)
  }
  return new BigNumber(amount.toString()).multipliedBy(new BigNumber(10).pow(decimals))
}

export function formatUTCTimeInSeconds (seconds, format) {
  if (!seconds) {
    return ''
  }
  return moment.utc(moment.unix(seconds)).format(format || 'MMM DD, YYYY, hh:mm A')
}

export function formatLocalTimeInSeconds (seconds, format) {
  if (!seconds) {
    return ''
  }
  return moment.unix(seconds).format(format || 'MMM DD, YYYY, hh:mm A')
}

export function formatUuid (uuid) {
  return Web3.utils.hexToBytes(Web3.utils.asciiToHex(uuid.replace(/-/g, '')))
}

export function convertBytesToUint128Number (bytes) {
  let bytes16

  // Convert bytes to bytes16
  if (bytes.length >= 16) {
    bytes16 = bytes.slice(bytes.length - 16)
  } else {
    bytes16 = Array(16 - bytes.length).fill(0).concat(bytes)
  }

  const hex = Web3.utils.bytesToHex(bytes16)
  return Web3.utils.hexToNumberString(hex)
}

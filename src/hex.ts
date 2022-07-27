/**
 * Convert Array Buffer or binary data to hex string representation of that data
 */
const arrayBufferToHexString = (buffer: ArrayBuffer): string => {
  /**
   * Taken from https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
  */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Problem in browser types
  return ([...new Uint8Array(buffer)] as number[])
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Convert a hex string value to the number which is represented by this hex string
 *
 * @param hexData - hex string value without 0x prefix, e.g. 0efa1
 */
const hexToNumber = (hexData: string): number => {
  return Number(`0x${hexData}`)
}

/**
 * Converts hex string to text string, assuming every two hex chars represent
 * one 32-bit char code
 */
const stringFromHexCharCode = (hexCharCode: string): string => {
  const hexChars: string[] = []

  for (let i = 0; i < hexCharCode.length; i += 2) {
    const hexChar = hexCharCode.substring(i, i + 2)
    hexChars.push(hexChar)
  }

  const charCodes = hexChars.map(hexChar => hexToNumber(hexChar))

  const result = String.fromCharCode(...charCodes)

  return result
}

export {
  arrayBufferToHexString,
  hexToNumber,
  stringFromHexCharCode,
}

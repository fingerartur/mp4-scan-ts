import { arrayBufferToHexString, hexToNumber, stringFromHexCharCode } from './hex'

describe('hex', () => {
  it('can convert hex to number', () => {
    expect(hexToNumber('10')).toBe(16)
    expect(hexToNumber('aa')).toBe(170)
    expect(hexToNumber('00')).toBe(0)
    expect(hexToNumber('pica')).toBe(NaN)
    expect(hexToNumber('0x22')).toBe(NaN)
  })

  it('can convert array buffer to hex', () => {
    const buffer = new ArrayBuffer(4) // 4 bytes
    const bufferView = new Uint8Array(buffer) // one position in array has 8 bits
    bufferView[0] = 10
    bufferView[1] = 0
    bufferView[2] = 160
    bufferView[3] = 180

    const result = arrayBufferToHexString(buffer)
    expect(result).toBe('0a00a0b4')
  })

  it('can convert hex charcodes to string', () => {
    const result = stringFromHexCharCode('214142')
    expect(result).toBe('!AB')
  })
})

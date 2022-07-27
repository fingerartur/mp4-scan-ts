import { ErrorCodes, Mp4Error } from './error'
import { arrayBufferToHexString, hexToNumber, stringFromHexCharCode } from './hex'
import { loadHead } from './http'

const MP4_WORD_SIZE_HEX = 8

/**
 * See list of all atoms http://mp4ra.org/#/atoms
 */
enum Atoms {
  /**
   * container for all the meta-data
   */
  MOOV = 'moov',
  /**
   * file type and compatibility
   */
  FTYP = 'ftyp',
}


/**
 * How many hex chars are needed to represent one byte? two
 */
const BYTE_TO_HEX_RATIO = 2

/**
 * Basic building block unit of na MP4 file. Everything is split up
 * to MP4 boxes
 */
type Box = {
  /**
   * MP4 box type as a string (binary converted to string via char codes)
   */
  type: string
  /**
   * Size in bytes that the box takes up, including the first 8 bytes
   * taken up by the "size" and "type" fields
   */
  size: number
  /**
   * MP4 box type as hex representation of binary
   */
  typeHex: string
}

/**
 * Parse out MP4 boxes from hex string representation of MP4 file data
 *
 * @param mp4Hex hex string representation of MP4 file data, it must start from the
 *   beginning of the MP4 file (the start must not be cropped) but it may be unfinished
 *   (the end may be cropped)
 *
 * @throws If video uses extended box size format (usually this should happen only for large videos - over 4 GB)
 */
const parseMp4Boxes = (mp4Hex: string): Box[] => {
  const boxes: Box[] = []
  /**
     * Index in hex string
     */
  let index = 0

  while (index < mp4Hex.length) {
    const sizeStartIndex = index
    const sizeEndIndex = sizeStartIndex + MP4_WORD_SIZE_HEX
    const typeStartIndex = sizeEndIndex
    const typeEndIndex = typeStartIndex + MP4_WORD_SIZE_HEX

    const isBoxHeaderOutOfBounds = typeEndIndex >= mp4Hex.length
    if (isBoxHeaderOutOfBounds) {
      break
    }

    const boxSizeHex = mp4Hex.substring(sizeStartIndex, sizeEndIndex)
    const boxTypeHex = mp4Hex.substring(typeStartIndex, typeEndIndex)

    const box: Box = {
      size: hexToNumber(boxSizeHex),
      typeHex: boxTypeHex,
      type: stringFromHexCharCode(boxTypeHex),
    }

    boxes.push(box)

    index += box.size * BYTE_TO_HEX_RATIO

    if (box.size === 1) {
      // TODO support extended box size for videos over 4GB. Definitely not necessary now
      // https://stackoverflow.com/questions/55677945/why-cant-i-get-a-manually-modified-mpeg-4-extended-box-chunk-size-to-work#:~:text=Most%20MP4%20box%20headers%20contain,%2C%20a%20large%20video%20file).
      throw new Mp4Error(ErrorCodes.MP4_CONTAINS_EXTENDED_BOX_SIZE, 'Videos using extended box size format are not supported yet')
    }
  }

  return boxes
}

/**
 * Check whether MP4 file supports progressive download.
 * Resolves to false also when any of the steps to preform this check fails.
 *
 * @param url URL of mp4 file
 * @throws If download or parsing of mp4 file fails (see error.code to distinguish errors)
 *   - #1 If request for mp4 file fails (e.g. when Range header is not supported)
 *   - #2 If video uses extended box size format (usually this should happen only for large videos - over 4 GB)
 */
const supportsProgressiveDownload = async (url: string) => {
  /**
     * Here I assume that if video supports progressive download, its moov atom
     * will be located somewhere inside the first 1 kB, if it is not,
     * it will be considered as lacking progressive download support.
     *
     * This is pretty reasonable. I tried processing a random video with
     * `ffmpeg -movflags faststart`, and ffmpeg moved the moov atom to within
     * the first 68 bytes
     */
  const response = await loadHead(url, 1024)

  const mp4Buffer = await response.arrayBuffer()
  const mp4HexString = arrayBufferToHexString(mp4Buffer)

  const mp4Boxes = parseMp4Boxes(mp4HexString)

  /**
     * According to these articles, in order for progressive download and playback
     * to be supported, it is sufficient that the MOOV atom is somewhere close
     * to the beginning of the MP4 file.
     *
     *   https://sanjeev-pandey.medium.com/understanding-the-mpeg-4-moov-atom-pseudo-streaming-in-mp4-93935e1b9e9a
     *   https://rigor.com/blog/optimizing-mp4-video-for-fast-streaming/
     */
  const result = mp4Boxes.some(box => box.type === Atoms.MOOV)
  return result
}

export {
  parseMp4Boxes,
  supportsProgressiveDownload,
}

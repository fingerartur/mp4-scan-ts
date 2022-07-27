import { MP4A_HEX_STRING } from './fixtures/mp4a'
import { MP4B_HEX_STRING } from './fixtures/mp4b'
import { parseMp4Boxes, supportsProgressiveDownload } from './mp4'

describe('MP4', () => {
  describe('can read mp4 boxes out of MP4 raw hex data', () => {
    it('file 1', () => {
      const result = parseMp4Boxes(MP4A_HEX_STRING)

      expect(result).toStrictEqual([
        {
          size: 32,
          type: 'ftyp',
          typeHex: '66747970',
        },
        {
          size: 8,
          type: 'free',
          typeHex: '66726565',
        },
        {
          size: 6513482,
          type: 'mdat',
          typeHex: '6D646174',
        },
      ])
    })

    it('file 2', () => {
      const result = parseMp4Boxes(MP4B_HEX_STRING)

      expect(result).toStrictEqual([
        { size: 32, typeHex: '66747970', type: 'ftyp' },
        { size: 22892, typeHex: '6D6F6F76', type: 'moov' },
      ])
    })
  })

  /**
   * These tests may stop working when the files are removed from server
   */
  describe('can check if mp4 supports progressive download', () => {
    it('mp4 with moov at the beginning returns true', async () => {
      const mp4 = 'https://firebasestorage.googleapis.com/v0/b/tivio-dev.appspot.com/o/assets%2Fstatic%2Fvast_garaztv_hyundai_i30_nline_20s-edit2.mp4?alt=media'
      const result = await supportsProgressiveDownload(mp4)

      expect(result).toBe(true)
    })

    it('mp4 with moov at the end returns false', async () => {
      const mp4 = 'https://cdn.flashtalking.com/161990/BraunMHR-ShavS9-BRM22020CZ_20sec_Video_1920_1080_2500_3000.mp4'
      const result = await supportsProgressiveDownload(mp4)

      expect(result).toBe(false)
    })

    it('invalid uri returns false', async () => {
      await expect(async () => {
        const mp4 = 'https://cdn.flashtalking.com/161990/Braun.txt'
        await supportsProgressiveDownload(mp4)
      })
        .rejects
        .toThrow('HTTP error 404')
    })
  })
})

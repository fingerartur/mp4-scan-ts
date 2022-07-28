# @finga/mp4-scan-ts

Utility to scan an mp4 file and check whether it supports progressive download and playback or not.

It downloads the first 1kB of the MP4 file using a Range request and looks for MP4 `moov` box header atom in there. If `moov` atom is present, the MP4 can be played back progressively.

*Intended for web environment. Not tested in node.js environment.*

## Install
```bash
npm i @finga/mp4-scan-ts
```

## Use

**supportsProgressiveDownload**

Check whether MP4 file supports progressive download.

```typescript
import { supportsProgressiveDownload } from '@finga/mp4-scan-ts'

const result = await supportsProgressiveDownload('https://cdn.myweb.com/myvideo.mp4')

// result === true or false
```

*This method downloads the first 1kB of the MP4 file and uses that to decide if it supports progressive playback.*

<br/>

**parseMp4Boxes**

Parse MP4 format boxes from MP4 represented in hex. The MP4 file is made up of boxes, each box has type and content size.

```typescript
import { parseMp4Boxes } from '@finga/mp4-scan-ts'

  /**
   * MP4 binary data represented as a hexadecimal string (2 letters represent 1 byte of data)
   */
  const MP4_HEX_STRING = 'F99EB891E813A6...'

  const result = parseMp4Boxes(MP4_HEX_STRING)

  // result:

  // [
  //   {
  //     size: 32,
  //     type: 'ftyp',
  //     typeHex: '66747970',
  //   },
  //   {
  //     size: 8,
  //     type: 'free',
  //     typeHex: '66726565',
  //   },
  //   {
  //     size: 6513482,
  //     type: 'mdat',
  //     typeHex: '6D646174',
  //   },
  // ]

  // The file begins with an "ftyp" box of size 32B, followed by a "free" box of size 8B and ends with "mdat"
  // box of size 6513482B.
```

## Known issues:
- [extended box size](https://stackoverflow.com/questions/55677945/why-cant-i-get-a-manually-modified-mpeg-4-extended-box-chunk-size-to-work#:~:text=Most%20MP4%20box%20headers%20contain,%2C%20a%20large%20video%20file) is not supported (this should be present only in videos larger than 4GB)

## Sources of inspiration:

- https://agama.tv/demystifying-the-mp4-container-format/
- https://bitmovin.com/fun-with-container-formats-2/
- https://github.com/uupaa/MP4Parser.js/tree/79e90b21b903da591bd59e0e2e727567af8953d3
- http://mp4ra.org/#/atoms
- https://sanjeev-pandey.medium.com/understanding-the-mpeg-4-moov-atom-pseudo-streaming-in-mp4-93935e1b9e9a
- https://rigor.com/blog/optimizing-mp4-video-for-fast-streaming/

## Changelog

- v1.0.1
  - Improved NPM keywords
- v1.0.0
  - Added functions `supportsProgressiveDownload` and `parseMp4Boxes`

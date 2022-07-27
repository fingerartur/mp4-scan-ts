import { ErrorCodes, Mp4Error } from './error'

/**
 * Load first `byteCount` bytes of a file
 *
 * @throws
 *  - Mp4Error if request returns bad status code
 *  - generic error if request fails (TODO convert this to Mp4Error)
 */
const loadHead = async (url: string, byteCount = 1024) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Range: `bytes=0-${byteCount - 1}`,
    },
  })

  const isOkStatus = response.status >= 200 && response.status < 300
  if (!isOkStatus) {
    const text = await response.text()
    throw new Mp4Error(ErrorCodes.HTTP_FAILED, `HTTP error ${response.status} ${response.statusText} ${text}`)
  }

  return response
}

export {
  loadHead,
}

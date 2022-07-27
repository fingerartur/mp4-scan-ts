class Mp4Error extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message)
  }
}

enum ErrorCodes {
  HTTP_FAILED = 1,
  MP4_CONTAINS_EXTENDED_BOX_SIZE = 2,
}

export {
  Mp4Error,
  ErrorCodes,
}

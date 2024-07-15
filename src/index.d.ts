// index.d.ts

declare module 'get-pixels' {
  type Callback = (
    err: Error | null,
    pixels: { data: Uint8Array; shape: number[] },
  ) => void
  function getPixels(path: string, type: string, cb: Callback): void
  export = getPixels
}

declare module 'zlib' {
  function deflateSync(buffer: Buffer): Buffer
  function inflateSync(buffer: Buffer): Buffer
  export = {
    deflateSync,
    inflateSync,
  }
}

interface EncodeOptions {
  method?: 'Z64' | 'ASCII'
  mimeType?: string | null
  threshold?: number
  luminance?: {
    r: number
    g: number
    b: number
  }
}

interface Image {
  bitmap: {
    width: number
    height: number
    channels: number
  }
  data: Uint8Array
  getPixelColor: (
    x: number,
    y: number,
  ) => { r: number; g: number; b: number; a: number }
}

declare function encode(
  file: string | Buffer,
  options?: EncodeOptions,
): Promise<string>
declare function decode(text: string): {
  width: number
  height: number
  buffer: Uint8Array
  getPixelBit: (x: number, y: number) => number
}

declare module '@replytechnologies/zpl-image-convert' {
  export { encode, decode }
}

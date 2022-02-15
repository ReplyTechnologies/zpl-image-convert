## ZPL-IMAGE-CONVERT

![BADGE_NPM_DOWNLOADS](https://img.shields.io/npm/dt/@replytechnologies/zpl-image-convert) ![BADGE_NPM_DOWNLOADS](https://img.shields.io/npm/dw/@replytechnologies/zpl-image-convert) ![BADGE_NPM_VERSION](https://img.shields.io/npm/v/@replytechnologies/zpl-image-convert) ![BADGE_NPM_LICENCE](https://img.shields.io/npm/l/@replytechnologies/zpl-image-convert) [![BADGE_PAYPAL](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/donate/?hosted_button_id=BVBKNU8NHN2UN)

Encode and decode ZPL images.

---

![encoding_image](./resources/encoding_image.png)

---

![decoding_image](./resources/decoding_image.png)

---

### Installation

```shell
npm install @replytechnologies/zpl-image-convert
```

**CommonJS**

```js
const zplImageConvert = require('@replytechnologies/zpl-image-convert');
```

**EJS**

```js
import zplImageConvert from '@replytechnologies/zpl-image-convert';
```

### Encoding

Encoding takes image data and turns it into a ZPL statement. This library supports Z64 and ASCII output formats.

```js
const zpl = await zplImageConvert.encode(image: string | Buffer, options: object);
```

**Options**

| Property      | Default  | Description                                                  |
| ------------- | -------- | ------------------------------------------------------------ |
| `method`      | `Z64`    | The encoding method to use (`Z64`, `ASCII`)                  |
| `mimeType`    | `null`   | The mime type of the provided image (only required if image is a buffer) |
| `threshold`   | `0x80`   | The threshold above which the pixel luminance value is interpreted as white |
| `luminance.r` | `0.2126` | Pixel luminance calculation red channel multiplier           |
| `luminance.g` | `0.7152` | Pixel luminance calculation green channel multiplier         |
| `luminance.b` | `0.0722` | Pixel luminance calculation blue channel multiplier          |

**Using method `Z64`**

```js
const zpl = await zplImageConvert.encode('... path to image file ...', {
	method: 'Z64',
});
// ^GFA,2850,2850,19,:Z64:eJzV1j1u2zAUAOBH ... ^FS
```

**Using method `ASCII`**

```js
const zpl = await zplImageConvert.encode('... path to image file ...', {
	method: 'ASCII',
});
// ^GFA,2850,2850,19,,:::::::::S0IFC,R01JF8 ... ^FS
```

**Using pre-existing image data**

If you already have image data, you can pass the data directly to the encode method. Doing this requires you to set the data mime type in the options.

```js
const image = fs.readFileSync('... path to image file ...');
const zpl = await zplImageConvert.encode(image, {
    method: 'Z64',
    mimeType: 'image/png',
});
```

### Decoding

Decoding takes a ZPL statement and turns it into a binary image. The `decode` function handles input with either `Z64` or `ASCII` formatting. Additional processing must be performed on the decoded result to turn it into an image.

**Result**

| Property | Description                                                  |
| -------- | ------------------------------------------------------------ |
| `width`  | Width of the image                                           |
| `height` | Height of the image                                          |
| `buffer` | Binary bytes of the image (each bit represents a pixel: 1 = black, 0 = white) |

**Decoding a ZPL statement**

```js
const zpl = `^GFA,2850,2850,19,:Z64:eJzV1j1u2AOB ... ^FS`;  
const image = await zplImageConvert.decode(zpl);
// image.width = 152
// image.height = 150
// image.buffer.length = 2850
```

**Turning the decoded result into an image**

Below is an example of turning the decoded result into a PNG image. This example makes use of [jimp](https://www.npmjs.com/package/jimp) to create the image.

```js
const Jimp = require('jimp');

// zpl = ^GFA,2850,2850,19,:Z64:eJzV1j1u2zAUAOB ... ^FS;
const decodeResult = await zplImageConvert.decode(zpl);
// image.width = 152
// image.height = 150
// image.buffer.length = 2850

const outputImage = new Jimp(decodeResult.width, decodeResult.height);
// set pixel color values on image
for (let i = 0; i < decodeResult.buffer.length; i++) {
    const currentByte = decodeResult.buffer[i];
    for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
        const pixelBit = (currentByte >> (7 - bitIndex)) & 0x01;
        const currentBitIndex = i * 8 + bitIndex;

        const y = ~~(currentBitIndex / decodeResult.width);
        const x = currentBitIndex % decodeResult.width;

        const color = pixelBit ? 0x000000FF : 0xFFFFFFFF;
        outputImage.setPixelColor(color, x, y);
    }
}
outputImage.write('... output file path ...'); 
```

If processing power is at your disposal, you may choose to use the code from the example below to get pixel values from the decoded result buffer.

```js
...
// set pixel color values on image
for (let x = 0; x < decodeResult.width; x++) {
    for (let y = 0; y < decodeResult.height; y++) {
        const pixelBit = decodeResult.getPixelBit(x, y);
        const color = pixelBit ? 0x000000FF : 0xFFFFFFFF;
        outputImage.setPixelColor(color, x, y);
    }
}
...
```



### Preprocessing

If you need to alter the image before encoding to ZPL, you can either use any image manipulation program to create a new image or you can use [jimp](https://www.npmjs.com/package/jimp).

**Example of resizing the image before encoding**

```js
const Jimp = require('jimp');

const image = await Jimp.read('... path to image ...');
// Resize the image to 300px by 300px
image.resize(300, 300);
const zpl = await zplImageConvert.encode(image);
/// ^GFA,11400,11400,38,:Z64:eJztmj1u5DYUgMlwEaYY ... ^FS
```

### Tests

Unit tests can be executed by running the test command. This command is configured to run `jest` on the project.

```shell
npm test
```

### Issues

If any issues are found in the library, please create a new issue describing the problem with potential reproduction steps and potential solutions.

### Contributing

If you would like to add additional functionality to this library, please create a new issue describing the functionality.


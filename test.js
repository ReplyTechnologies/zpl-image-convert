const zplImageConvert = require('./src/index.js');
const Jimp = require('jimp');

(async () => {

  const result = await zplImageConvert.encode('test-image.png', {
    method: 'Z64',
    // rotation: 0,    
    width: 150,
    height: 150
  });

  console.log(result);
  console.log('\n');

  const decodeResult = await zplImageConvert.decode(result);
  console.log(decodeResult);

  new Jimp(decodeResult.width, decodeResult.height, (err, image) => {
    if (err) {
      throw err;
    }

    for (let index = 0; index < decodeResult.buffer.length; index++) {
      const byte = decodeResult.buffer[index];

      for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
        const y = ~~((index * 8 + bitIndex) / decodeResult.width);
        const x = ((index * 8 + bitIndex) % decodeResult.width);

        const value = (byte >> (7 - bitIndex)) & 1;
        image.setPixelColor(value ? 0x000000FF : 0xFFFFFFFF, x, y);
      }
    }
  
    image.write('test-decode.png', (err) => {
      if (err) throw err;
    });
  });

  

})();

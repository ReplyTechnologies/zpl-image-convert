const Jimp = require('jimp');
const zlib = require('zlib');

const mapCode = {
  1: "G", 2: "H", 3: "I", 4: "J", 5: "K", 6: "L", 7: "M", 8: "N", 9: "O",
  10: "P", 11: "Q", 12: "R", 13: "S", 14: "T", 15: "U", 16: "V", 17: "W",
  18: "X", 19: "Y", 20: "g", 40: "h", 60: "i", 80: "j", 100: "k", 120: "l",
  140: "m", 160: "n", 180: "o", 200: "p", 220: "q", 240: "r", 260: "s",
  280: "t", 300: "u", 320: "v", 340: "w", 360: "x", 380: "y", 400: "z"
};

const pivotedMapCode = {
  "G": 1, "H": 2, "I": 3, "J": 4, "K": 5, "L": 6, "M": 7, "N": 8, "O": 9,
  "P": 10, "Q": 11, "R": 12, "S": 13, "T": 14, "U": 15, "V": 16, "W": 17,
  "X": 18, "Y": 19, "g": 20, "h": 40, "i": 60, "j": 80, "k": 100, "l": 120,
  "m": 140, "n": 160, "o": 180, "p": 200, "q": 220, "r": 240, "s": 260,
  "t": 280, "u": 300, "v": 320, "w": 340, "x": 360, "y": 380, "z": 400
};

const crcTable = [
  0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5,
  0x60c6, 0x70e7, 0x8108, 0x9129, 0xa14a, 0xb16b,
  0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210,
  0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6,
  0x9339, 0x8318, 0xb37b, 0xa35a, 0xd3bd, 0xc39c,
  0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401,
  0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b,
  0x8528, 0x9509, 0xe5ee, 0xf5cf, 0xc5ac, 0xd58d,
  0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6,
  0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738,
  0xf7df, 0xe7fe, 0xd79d, 0xc7bc, 0x48c4, 0x58e5,
  0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
  0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969,
  0xa90a, 0xb92b, 0x5af5, 0x4ad4, 0x7ab7, 0x6a96,
  0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc,
  0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a,
  0x6ca6, 0x7c87, 0x4ce4, 0x5cc5, 0x2c22, 0x3c03,
  0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd,
  0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6,
  0x5ed5, 0x4ef4, 0x3e13, 0x2e32, 0x1e51, 0x0e70,
  0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a,
  0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb,
  0xd10c, 0xc12d, 0xf14e, 0xe16f, 0x1080, 0x00a1,
  0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
  0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c,
  0xe37f, 0xf35e, 0x02b1, 0x1290, 0x22f3, 0x32d2,
  0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb,
  0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d,
  0x34e2, 0x24c3, 0x14a0, 0x0481, 0x7466, 0x6447,
  0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8,
  0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2,
  0x0691, 0x16b0, 0x6657, 0x7676, 0x4615, 0x5634,
  0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9,
  0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827,
  0x18c0, 0x08e1, 0x3882, 0x28a3, 0xcb7d, 0xdb5c,
  0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
  0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0,
  0x2ab3, 0x3a92, 0xfd2e, 0xed0f, 0xdd6c, 0xcd4d,
  0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07,
  0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1,
  0xef1f, 0xff3e, 0xcf5d, 0xdf7c, 0xaf9b, 0xbfba,
  0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74,
  0x2e93, 0x3eb2, 0x0ed1, 0x1ef0
];

async function encode(file, options) {
  options = options || {};
  options.method = options.method || 'Z64';
  options.threshold = options.threshold || 0x80;

  options.luminance = options.luminance || {
    r: 0.2126,
    g: 0.7152,
    b: 0.0722
  };

  const acceptedMethods = ['Z64', 'ASCII'];
  if (!acceptedMethods.includes(options.method)) {
    throw new Error(`Method '${options.method}' is not supported (${acceptedMethods.join(', ')})`);
  }

  let image = null;

  if (typeof file == 'buffer') {
    image = Jimp.read(file);
  } else if (typeof file == 'string') {
    image = await Jimp.read(file);
  } else {
    throw new Error(`Invalid file supplied`);
  }

  if (options.rotation) {
    image = await image.rotate(options.rotation);
  }

  if (options.width || options.height) {
    image = await image.resize(
      options.width || Jimp.AUTO,
      options.height || Jimp.AUTO);
  }

  const monochromeImage = convertImageToMonochrome(image, options);

  let data = null;

  if (options.method === 'Z64') {
    data = encodeZ64(monochromeImage.buffer, monochromeImage.width);
  }

  if (options.method === 'ASCII') {
    data = encodeASCII(monochromeImage.buffer, monochromeImage.width);
  }

  return `^GFA,${monochromeImage.buffer.length},${monochromeImage.buffer.length},${monochromeImage.width / 8},${data}^FS`;
}

function convertImageToMonochrome(image, options) {
  // image width must be multiples of 8
  const imageWidth = ~~((image.bitmap.width + 7) / 8) * 8;

  let buffer = new Uint8Array(image.bitmap.height * imageWidth / 8);
  let currentValue = 0;

  let bitCounter = 0;
  let index = 0;

  for (let y = 0; y < image.bitmap.height; y++) {
    for (let x = 0; x < imageWidth; x++) {

      let value = 0;

      if (x < image.bitmap.width) {
        const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
        const alpha = pixel.a / 255;

        const luminanceValue = (
          pixel.r * options.luminance.r +
          pixel.g * options.luminance.g +
          pixel.b * options.luminance.b
        ) * alpha + (255 * (1 - alpha));

        value = luminanceValue < options.threshold ? 1 : 0;
      }

      currentValue = currentValue | (value << (7 - bitCounter));

      bitCounter++;
      if (bitCounter == 8) {
        buffer[index] = currentValue;
        currentValue = 0;
        bitCounter = 0;
        index++;
      }
    }
  }

  return {
    buffer: buffer,
    width: imageWidth,
    height: image.bitmap.height
  };
}

function encodeASCII(buffer, width) {
  let lines = [];
  let currentLine = '';

  const lineLength = width / 8;

  for (let index = 0; index < buffer.length; index++) {
    currentLine += buffer[index].toString('16').padStart(2, '0');

    if ((index + 1) % lineLength == 0) {
      lines.push(currentLine);
      currentLine = '';
    }
  }

  const newLines = [];

  // process duplicate lines
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (line === lines[index - 1]) {
      newLines[index] = ':';
    } else {
      newLines[index] = line;
    }
  }

  lines = newLines;

  // process trailing zeros
  for (let index = 0; index < lines.length; index++) {
    lines[index] = processAsciiLine(lines[index]);
  }

  // join lines into single string
  const line = lines.join('');
  let data = '';

  const nonCountingCharacters = [',', ':', '!'];

  let currentCharacter = null;
  let counter = 0;
  let characterIndex = 0;
  while (characterIndex <= line.length) {
    const character = line[characterIndex];
    const isNonCountingCharacter = nonCountingCharacters.includes(currentCharacter);

    if (!currentCharacter) {
      currentCharacter = character;
      counter = 1;
    } else {
      if (character == currentCharacter && !isNonCountingCharacter) {
        counter++
      } else {
        if (isNonCountingCharacter || counter == 1) {
          data += currentCharacter;
        } else {
          const mapCodeValues = getMapCodeValues(counter);
          data += `${mapCodeValues}${currentCharacter}`;
        }
        currentCharacter = null;
        continue;
      }
    }

    characterIndex++;
  }

  return data;
}

function processAsciiLine(line) {
  line = line.toUpperCase();

  const zeroRegex = /0+$/;
  line = line.replace(zeroRegex, ',');

  return line;
}

function getMapCodeValues(counter) {
  let mapCodeValues = '';

  while (counter > 20) {
    mapCodeValues += getMapCodeValues(~~(counter / 20));
    counter = counter % 20;
  }

  mapCodeValues += mapCode[counter];
  return mapCodeValues;
}

function encodeZ64(buffer) {
  const base64Value = zlib.deflateSync(buffer).toString('base64');
  const crc16Value = calculateCRC(base64Value);
  return `:Z64:${base64Value}:${crc16Value}`;
}

function calculateCRC(input) {
  let crc = 0;

  for (let index = 0; index < input.length; index++) {
    const character = input.charCodeAt(index);
    if (character > 255) {
      throw new RangeError();
    }
    const crcIndex = (character ^ (crc >> 8)) & 0xFF;
    crc = crcTable[crcIndex] ^ (crc << 8);
  }

  crc = (crc & 0xFFFF).toString(16).toLowerCase();
  return crc.padStart(4, '0');
}

function decode(text) {
  text = text.trim();

  if (!text.startsWith('^GFA')) {
    throw new Error('Unsupported encoding')
  }

  // trim ^GF
  text = text.substring(3);
  if (text.endsWith('^FS')) {
    // trim trailing '^FS'
    text = text.substring(0, text.length - 3);
  }
  
  // a: compression type (A, B, C)
  let commaIndex = text.indexOf(',');
  const a = text.substring(0, commaIndex);
  text = text.substring(commaIndex + 1);
  
  // b: binary byte count
  commaIndex = text.indexOf(',');
  const b = text.substring(0, commaIndex);
  text = text.substring(commaIndex + 1);
  
  // c: graphic field count
  commaIndex = text.indexOf(',');
  const c = text.substring(0, commaIndex);
  text = text.substring(commaIndex + 1);

  // d: bytes per row
  commaIndex = text.indexOf(',');
  const d = text.substring(0, commaIndex);
  
  const data = text.substring(commaIndex + 1);
  let buffer = null;

  const width = d * 8;
  const height = c / d;

  if (data.startsWith(':Z64:')) {
    buffer = decodeZ64(data);
  } else {
    buffer = decodeASCII(data, c, d);
  }

  return {
    width,
    height,
    buffer
  };
}

function decodeZ64(data) {
  // trim :Z64:
  data = data.substring(5);
  // trim trailing crc
  data = data.substring(0, data.length - 5);
  
  const deflatedData = Buffer.from(data, 'base64');
  const buffer = zlib.inflateSync(deflatedData);
  return buffer;
}

function decodeASCII(data, size, lineByteCount) {
  const buffer = new Uint8Array(size);
  const lineWordCount = lineByteCount * 2;
  
  // inflate data from map codes
  let inflatedData = '';
  let index = 0;
  while (index < data.length) {
    let character = data[index++];

    if (pivotedMapCode[character]) {
      let code = '';
      while (pivotedMapCode[character]) {
        code += character;
        character = data[index++];
      }

      const multiplier = getMapCodeCount(code);
      inflatedData += new Array(multiplier + 1).join(character);
    } else {
      inflatedData += character;
    }
  }

  // expand shortended data rows
  let expandedData = '';
  index = 0;
  while (index < inflatedData.length) {
    let character = inflatedData[index++];
    let remainingLength = lineWordCount - (expandedData.length % lineWordCount);
    
    if (character == ',') {
      expandedData += new Array(remainingLength + 1).join('0');
    } else if (character == '!') {
      expandedData += new Array(remainingLength + 1).join('F');
    } else if (character == ':') {
      expandedData += expandedData.substring(expandedData.length - lineWordCount, expandedData.length);
    } else {
      expandedData += character;
    }
  }

  // convert data into buffer
  let bufferIndex = 0;
  index = 0;
  while (index < expandedData.length) {
    let character = expandedData[index++];
    let nextCharacter = expandedData[index++];
    buffer[bufferIndex++] = Number.parseInt(character + nextCharacter, 16);
  }

  return buffer;
}

function getMapCodeCount(code) {
  let value = 0;

  for (let index = 0; index < code.length; index++) {
    const multiplier = Math.pow(20, (code.length - index - 1));
    value += multiplier * pivotedMapCode[code[index]];
  }

  return value;
}

module.exports = {
  encode,
  decode,
};

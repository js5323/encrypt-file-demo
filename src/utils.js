/*
wordArray: { words: [..], sigBytes: words.length * 4 }
*/

// assumes wordArray is Big-Endian (because it comes from CryptoJS which is all BE)
// From: https://gist.github.com/creationix/07856504cf4d5cede5f9#file-encode-js
export const convertWordArrayToUint8Array = function (wordArray) {
  var len = wordArray.words.length,
    u8_array = new Uint8Array(len << 2),
    offset = 0,
    word,
    i;
  for (i = 0; i < len; i++) {
    word = wordArray.words[i];
    u8_array[offset++] = word >> 24;
    u8_array[offset++] = (word >> 16) & 0xff;
    u8_array[offset++] = (word >> 8) & 0xff;
    u8_array[offset++] = word & 0xff;
  }
  return u8_array;
};

// create a wordArray that is Big-Endian (because it's used with CryptoJS which is all BE)
// From: https://gist.github.com/creationix/07856504cf4d5cede5f9#file-encode-js
export const convertUint8ArrayToWordArray = function (u8Array) {
  var words = [],
    i = 0,
    len = u8Array.length;

  while (i < len) {
    words.push(
      (u8Array[i++] << 24) |
        (u8Array[i++] << 16) |
        (u8Array[i++] << 8) |
        u8Array[i++]
    );
  }

  return {
    sigBytes: words.length * 4,
    words: words,
  };
};

export const convertUint8ArrayToBinaryString = function (u8Array) {
  var i,
    len = u8Array.length,
    b_str = "";
  for (i = 0; i < len; i++) {
    b_str += String.fromCharCode(u8Array[i]);
  }
  return b_str;
};

export const convertBinaryStringToUint8Array = function (bStr) {
  var i,
    len = bStr.length,
    u8_array = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    u8_array[i] = bStr.charCodeAt(i);
  }
  return u8_array;
};

export const stringToByte = (str) => {
  var len, c;
  len = str.length;
  var bytes = [];
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  return new Int8Array(bytes);
};

export const readAsBinaryString = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsBinaryString(file);
  });
};

export const readAsArrayBuffer = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsArrayBuffer(file);
  });
};

export const downloadBlob = (blob, filename) => {
  let a = document.createElement("a");
  let url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

<template>
  <div class="wrapper">
    <label for="pad">Public Key:</label>
    <input v-model="publicKey" />

    <label for="pad">Encode File:</label>
    <input ref="file" type="file" @change="handleChange" />

    <button @click="encrypt">Encrypt</button>

    <hr />

    <label for="pad">Decode File:</label>
    <input ref="file" type="file" @change="handleChange2" />

    <button @click="decrypt">Decrypt</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputFile: null,
      publicKey: "adoxb42lk35nsfgl",
      iv: "",
      decodeFile: null,
      encrypted: null,
    };
  },
  methods: {
    handleChange(e) {
      this.inputFile = e.target.files[0];
    },
    handleChange2(e) {
      this.decodeFile = e.target.files[0];
    },
    encrypt() {
      if (!this.inputFile) {
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        let u8Array = new Uint8Array(reader.result);
        let wordArray = convertUint8ArrayToWordArray(u8Array); // Convert: ArrayBuffer -> WordArray

        // console.log(this.inputFile.name);

        // let encrypted = CryptoJS.AES.encrypt(wordArray, this.publicKey, {
        //   mode: CryptoJS.mode.CBC,
        //   padding: CryptoJS.pad.Pkcs7,
        // }); // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)
        // console.log("before u8Array:", u8Array);
        // console.log(encrypted);
        // console.log(encrypted.ciphertext);

        // window.encrypted = encrypted;

        // this.iv = encrypted.iv.toString();

        // let result = convertWordArrayToUint8Array(encrypted.ciphertext);
        // let fileEnc = new Blob([result]); // Create blob from string

        // let a = document.createElement("a");
        // let url = window.URL.createObjectURL(fileEnc);
        // let filename = this.iv + ".enc";
        // a.href = url;
        // a.download = filename;
        // a.click();
        // window.URL.revokeObjectURL(url);
      };

      reader.readAsArrayBuffer(this.inputFile);
    },

    decrypt() {
      if (!this.decodeFile) {
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        let u8Array = new Uint8Array(reader.result);
        let wordArray = convertUint8ArrayToWordArray(u8Array);

        // let ciphertextParams = CryptoJS.lib.CipherParams.create({
        //   ciphertext: wordArray,
        //   iv: CryptoJS.enc.Hex.parse(this.iv), // parse the IV
        //   mode: CryptoJS.mode.CBC,
        //   padding: CryptoJS.pad.Pkcs7,
        // });

        // let decrypted = CryptoJS.AES.decrypt(ciphertextParams, this.publicKey); // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)

        // console.log(decrypted);

        // let result = convertWordArrayToUint8Array(decrypted);
        // let fileEnc = new Blob([result], {
        //   type: "application/pdf",
        // }); // Create blob from string

        // console.log("after:", result);

        // let a = document.createElement("a");
        // let url = window.URL.createObjectURL(fileEnc);
        // let filename = `decrypted-${new Date().getTime()}.pdf`;
        // a.href = url;
        // a.download = filename;
        // a.click();
        // window.URL.revokeObjectURL(url);
      };

      reader.readAsArrayBuffer(this.decodeFile);
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.wrapper {
  input,
  select {
    margin-bottom: 16px;
  }
}
</style>

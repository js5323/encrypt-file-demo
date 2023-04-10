<template>
  <div class="wrapper">
    <h3 @click="show = !show">crypto-js</h3>
    <div v-show="show" class="cont">
      <div>
        <label for="pad">Public Key:</label>
        <input v-model="publicKey" />
      </div>

      <div>
        <label for="pad">IV:</label>
        <input v-model="iv" />
      </div>

      <div>
        <label for="pad">Encode File:</label>
        <input ref="file" type="file" @change="handleChange" />
      </div>

      <button @click="encrypt">Encrypt</button>

      <div style="margin-top: 15px">
        <label for="pad">Decode File:</label>
        <input ref="file" type="file" @change="handleChange2" />
      </div>

      <div>
        <label for="pad">Decrypted File Name:</label>
        <input v-model="decryptedFileName" />
      </div>

      <button @click="decrypt">Decrypt</button>
    </div>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import {
  convertWordArrayToUint8Array,
  downloadBlob,
  readAsArrayBuffer,
} from "../utils";

window.CryptoJS = CryptoJS;

export default {
  data() {
    return {
      inputFile: null,
      publicKey: "adoxb42lk35nsfgl",
      iv: "a12xb42lab5nsjga",
      decodeFile: null,
      encrypted: null,
      show: true,
      decryptedFileName: `decrypt-by-crypto-js-${new Date().getTime()}.pdf`,
    };
  },
  methods: {
    handleChange(e) {
      this.inputFile = e.target.files[0];
    },
    handleChange2(e) {
      this.decodeFile = e.target.files[0];
    },
    async encrypt() {
      if (!this.inputFile) {
        return;
      }

      const fileArrBuffer = await readAsArrayBuffer(this.inputFile);
      let wordArray = CryptoJS.lib.WordArray.create(fileArrBuffer); // Convert: ArrayBuffer -> WordArray

      console.log("before encrypt:");
      console.log(wordArray);

      let encrypted = CryptoJS.AES.encrypt(
        wordArray,
        CryptoJS.enc.Utf8.parse(this.publicKey),
        {
          iv: CryptoJS.enc.Utf8.parse(this.iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.NoPadding,
        }
      );

      console.log("encrypt result:");
      console.log(encrypted.ciphertext);

      let result = convertWordArrayToUint8Array(encrypted.ciphertext);

      downloadBlob(
        new Blob([result]),
        `encrypt-by-crypto-js-${new Date().getTime()}.enc`
      );
    },

    async decrypt() {
      if (!this.decodeFile) {
        return;
      }

      const fileArrBuffer = await readAsArrayBuffer(this.decodeFile);
      // wordArray 已经是与encrypt后的结果一致了
      let wordArray = CryptoJS.lib.WordArray.create(fileArrBuffer);

      console.log("get encrypt file result:");
      console.log(wordArray);

      // 直接将wordArray放入decrypt无法解密
      let decrypted = CryptoJS.AES.decrypt(
        CryptoJS.lib.CipherParams.create({
          ciphertext: wordArray,
        }),
        CryptoJS.enc.Utf8.parse(this.publicKey),
        {
          iv: CryptoJS.enc.Utf8.parse(this.iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.NoPadding,
        }
      );

      console.log("decrypted file result:");
      console.log(decrypted);

      let result = convertWordArrayToUint8Array(decrypted);
      downloadBlob(new Blob([result]), this.decryptedFileName);
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.wrapper {
  border: 1px solid #535bf2;
  padding: 20px;
  margin-bottom: 16px;

  .cont {
    border-top: 1px solid #535bf2;
    padding-top: 15px;
    margin-top: 15px;
  }

  h3 {
    margin: 0;
  }

  input,
  select {
    margin-bottom: 16px;
  }
}
</style>

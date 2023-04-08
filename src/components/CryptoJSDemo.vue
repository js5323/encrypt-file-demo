<template>
  <div class="wrapper">
    <h3 @click="show = !show">crypto-js</h3>
    <div v-show="show" class="cont">
      <div>
        <label for="pad">Public Key:</label>
        <input v-model="publicKey" />
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

      <button @click="decrypt">Decrypt</button>
    </div>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
import {
  convertUint8ArrayToWordArray,
  convertWordArrayToUint8Array,
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

        console.log("before encrypt:");
        console.log(wordArray);

        let encrypted = CryptoJS.AES.encrypt(wordArray, this.publicKey, {
          iv: this.iv,
        });

        console.log("encrypt result:");
        console.log(encrypted.ciphertext);

        let result = convertWordArrayToUint8Array(encrypted.ciphertext);
        let fileEnc = new Blob([result]); // Create blob from string

        let a = document.createElement("a");
        let url = window.URL.createObjectURL(fileEnc);
        let filename = this.iv + ".enc";
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      };

      reader.readAsArrayBuffer(this.inputFile);
    },

    decrypt() {
      if (!this.decodeFile) {
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        // wordArray 已经是与encrypt后的结果一致了
        let wordArray = CryptoJS.lib.WordArray.create(reader.result);

        console.log("get encrypt file result:");
        console.log(wordArray);

        // 直接将wordArray放入decrypt无法解密
        let decrypted = CryptoJS.AES.decrypt(wordArray, this.publicKey, {
          iv: this.iv,
        });

        console.log("decrypted file result:");
        console.log(decrypted);

        let result = convertWordArrayToUint8Array(decrypted);
        let fileEnc = new Blob([result], {
          type: "application/pdf",
        }); // Create blob from string

        console.log("after:", result);

        let a = document.createElement("a");
        let url = window.URL.createObjectURL(fileEnc);
        let filename = `decrypted-${new Date().getTime()}.pdf`;
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      };

      reader.readAsArrayBuffer(this.decodeFile);
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

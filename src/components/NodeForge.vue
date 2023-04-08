<template>
  <div class="wrapper">
    <h3 @click="show = !show">node-froge</h3>
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
import forge from "node-forge";
import { convertBinaryStringToUint8Array } from "../utils";

window.forge = forge;

export default {
  data() {
    return {
      inputFile: null,
      publicKey: "adoxb42lk35nsfgl",
      iv: "a12xb42lab5nsjga",
      decodeFile: null,
      encrypted: null,
      show: false,
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
        // encrypt some bytes using CBC mode
        // (other modes include: ECB, CFB, OFB, CTR, and GCM)
        // Note: CBC and ECB modes use PKCS#7 padding as default
        var cipher = forge.cipher.createCipher("AES-CBC", this.publicKey);
        cipher.start({ iv: this.iv });
        cipher.update(forge.util.createBuffer(reader.result));
        cipher.finish();
        var encrypted = convertBinaryStringToUint8Array(cipher.output.bytes());

        // console.group("encrypt source");
        // console.log(reader.result);
        // console.groupEnd();
        // console.group("encrypt result");
        // console.log(encrypted);
        // console.groupEnd();

        let fileEnc = new Blob([encrypted]); // Create blob from string

        let a = document.createElement("a");
        let url = window.URL.createObjectURL(fileEnc);
        let filename = "encrypt-" + this.iv + ".enc";
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      };

      reader.readAsBinaryString(this.inputFile);
    },

    decrypt() {
      if (!this.decodeFile) {
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        // decrypt some bytes using CBC mode
        // (other modes include: CFB, OFB, CTR, and GCM)
        var decipher = forge.cipher.createDecipher("AES-CBC", this.publicKey);
        decipher.start({ iv: this.iv });
        decipher.update(forge.util.createBuffer(reader.result));
        decipher.finish();
        let decrypted = convertBinaryStringToUint8Array(
          decipher.output.bytes()
        );

        // console.group("read encrypt result");
        // console.log(reader.result);
        // console.groupEnd();

        // reader.result should be same with encrypted bytes

        // console.group("decrypt result");
        // console.log(decrypted);
        // console.groupEnd();

        let fileDecrypt = new Blob([decrypted], {
          type: "application/pdf",
        });

        let a = document.createElement("a");
        let url = window.URL.createObjectURL(fileDecrypt);
        let filename = `decrypted-${this.iv}.pdf`;
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      };

      reader.readAsBinaryString(this.decodeFile);
    },
  },
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

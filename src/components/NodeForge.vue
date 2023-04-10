<template>
  <div class="card">
    <h3 @click="show = !show">node-froge</h3>
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
import forge from "node-forge";
import {
  convertBinaryStringToUint8Array,
  downloadBlob,
  readAsBinaryString,
} from "../utils";

window.forge = forge;

export default {
  data() {
    return {
      inputFile: null,
      publicKey: "adoxb42lk35nsfgl",
      iv: "a12xb42lab5nsjga",
      decodeFile: null,
      encrypted: null,
      show: true,
      decryptedFileName: `decrypt-by-forge-${new Date().getTime()}.pdf`,
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

      const fileBinaryString = await readAsBinaryString(this.inputFile);
      // encrypt some bytes using CBC mode
      // (other modes include: ECB, CFB, OFB, CTR, and GCM)
      // Note: CBC and ECB modes use PKCS#7 padding as default
      const cipher = forge.cipher.createCipher("AES-CBC", this.publicKey);
      cipher.start({ iv: this.iv });
      cipher.update(forge.util.createBuffer(fileBinaryString));
      cipher.finish();

      const encrypted = convertBinaryStringToUint8Array(cipher.output.bytes());

      downloadBlob(
        new Blob([encrypted]),
        `encrypt-by-forge-${new Date().getTime()}.enc`
      );
    },

    async decrypt() {
      if (!this.decodeFile) {
        return;
      }

      const fileBinaryString = await readAsBinaryString(this.decodeFile);
      // decrypt some bytes using CBC mode
      // (other modes include: CFB, OFB, CTR, and GCM)
      var decipher = forge.cipher.createDecipher("AES-CBC", this.publicKey);
      decipher.start({ iv: this.iv });
      decipher.update(forge.util.createBuffer(fileBinaryString));
      decipher.finish();
      let decrypted = convertBinaryStringToUint8Array(decipher.output.bytes());

      downloadBlob(new Blob([decrypted]), this.decryptedFileName);
    },
  },
};
</script>

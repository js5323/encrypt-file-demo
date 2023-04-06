<template>
  <div>
    <input ref="file" type="file" @change="handleChange" />

    <button>encrypt</button>
  </div>
</template>

<script>
import { Buffer } from "buffer";
const crypto = require("crypto");

// www.cnblogs.com/shenjp/p/16423487.html

/**
 * aes-128-gcm 加密
 * @param {String} msg 加密字符串
 * @param {String} key 密钥
 * @returns 加密后的字符串，16进制
 */
function Encrypt(msg, key) {
  try {
    var pwd = Buffer.from(key, "hex");
    var iv = crypto.randomBytes(12);
    var cipher = crypto.createCipheriv("aes-128-gcm", pwd, iv);

    var enc = cipher.update(msg, "utf8", "hex");
    enc += cipher.final("hex");
    //cipher.getAuthTag() 方法返回一个 Buffer，它包含已从给定数据计算后的认证标签。
    //cipher.getAuthTag() 方法只能在使用 cipher.final() 之后调用 这里返回的是一个十六进制后的数组
    var tags = cipher.getAuthTag();
    enc = Buffer.from(enc, "hex");
    // 由于和java对应的AES/GCM/PKCS5Padding模式对应 所以采用这个拼接
    var totalLength = iv.length + enc.length + tags.length;
    var bufferMsg = Buffer.concat([iv, enc, tags], totalLength);
    return bufferMsg.toString("hex");
  } catch (e) {
    console.log("Encrypt is error", e);
    return null;
  }
}

/**
 * aes-128-gcm 解密
 * @param {String} serect 密文 16进制
 * @param {String} key 密钥 16进制
 * @returns
 */
function Decrypt(serect, key) {
  try {
    var tmpSerect = Buffer.from(serect, "hex");
    var pwd = Buffer.from(key, "hex");
    // 读取数组
    var iv = tmpSerect.slice(0, 12);
    var cipher = crypto.createDecipheriv("aes-128-gcm", pwd, iv);
    // 这边的数据为 去除头的iv12位和尾部的tags的16位
    var msg = cipher.update(tmpSerect.slice(12, tmpSerect.length - 16));
    return msg.toString("utf8");
  } catch (e) {
    console.log("Decrypt is error", e);
    return null;
  }
}

export default {
  data() {
    return {
      inputFile: null,
    };
  },

  methods: {
    handleChange(e) {
      this.inputFile = e.target.files[0];
    },
    encrypt() {
      const reader = new FileReader();
      reader.readAsArrayBuffer();
      reader.onload = function (event) {
        const arrayBuffer = event.target.result;

        console.log(arrayBuffer);

        const AESKey = "e5889166bb98ba01e1a6bc9b32dbf3e6";

        const fileBlob = new Blob([encData], { type: "application/pdf" });
        console.log(fileBlob);
      };
    },
  },
};
</script>

<style scoped></style>

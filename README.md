# Vue 3 + Vite

```
	    12
also24      2020-02-23 20:35:19 +08:00
https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader

我看了一下 FileReader，在读取的时候需要指定
FileReader.readAsArrayBuffer()
FileReader.readAsBinaryString()
FileReader.readAsDataURL()

你在 encode 方法里用的是 readAsDataURL，也就是说 reader.result 里其实是文件在 base64 编码后的字符串。
而你把这个字符串直接传进了 encrypt 方法，也就是说此时你其实是在加密这个字符串。
encrypt 方法返回的 encryptedData 直接 tostring 的话，是密文 base64 后的字符串，
但你取的是 encryptedData.ciphertext.tostring()，这个实际上是密文的 hexString 字符串。

相应的，你在 Decode 方法里使用的是 readAsText，文件内容是字符串的情况下也不算太错
但是你把这串文本直接丢进 decrypt 方法就大错特错了，应当从 hexString 转回 Blob 才对


当然，以上是针对你的程序来说的。
我来写的话，应该会选择 readAsDataURL 读到 base64 编码后的文件，
然后 base64 解码后丢进 encrypt 方法，再把 encryptedData.toString() 的字符串解码后丢进输出文件。
```

```
总结一下，请务必分清楚几种不同的数据格式：

一个字符串，它的内容是：『 V2EX 』

对应的 ASCII 码是：
86 50 69 88

对应的十六进制分别为：
56 32 45 58

那么在 UTF8 / ANSI 编码下，按大端序书写，它的二进制（ binary ）内容是：
0101 0110 0011 0010 0100 0101 0101 1000

相应的 HEX 字符串就是：
0x56324558

相应的 base64 字符串是：
VjJFWA==

你的错误就在于混淆使用了 binary / b64 String / HEX String，从而导致混乱

不过确实，网上找到的很多资料都在混淆使用或者不仔细说明。
事实上，AES 的 encrypt 方法只管你输入的是 binary( byte array ) 就好了，字符串还是文件对它来说没区别。

总之，你这里只需要配合 FileReader，选择正确的编解码方式就好了。
个人不建议对 base64 String 进行加解密操作，这样会造成密文文件体积增大，徒增开销。
如果我没有理解错的话，直接使用 FileReader.readAsArrayBuffer() 应该能够避免中间 b64 编解码的开销。
```

```
正好前两天看过这个

我用的这个库 https://cryptojs.gitbook.io/docs/#encoders。
首先读取文件用 FileReader.readAsArrayBuffer()，然后把 ArrayBuffer 转成十六进制字符串。
再用 crypto-js 读取十六进制字符串进行加密。
加密过程结束之后，crypto-js 把结果转成十六进制字符串，然后转换成 ArrayBuffer，写入文件对象即可。
```


http://shihuacivis.github.io/2015/12/29/20151229_aes/

const express = require('express')
const app = express()
const port = 9000;
const {AESCALL} = require('./AESCrypt');


app.get('/', (req, res) => {
    let key = "sample_key";
    let data = "This is a sample input string";
    let aesConvert = AESCALL(key,data,"enc");
    let aesDecrpt = AESCALL("sample_key",aesConvert,"dec");
//   res.write(`KEY ${key} `);
//   res.write(`Data ${data}`);
//   res.write(`Encrept ${aesConvert} `);
//   res.write(`Decrept ${aesDecrpt}`);
res.end(`Encrept ${aesConvert} /n ${aesDecrpt} `);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const express = require('express')
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));
  
const port = 9000;
const {DigitalSignature} = require('./DigitalSignature');

app.get('/', (req, res) => {
    let key = "sample_key";
    let genKeyData = DigitalSignature(key,null,null,null,null,null,"gen");
    console.log('---->', genKeyData);
    // res.end(`privateKey ${genKeyData?.privateKey} \n publicKey ${genKeyData?.publicKey}`)
    res.status(200).json(genKeyData);
});

app.post('/gen', (req, res) => {
    let data = "This is a sample input string YOYO";
    let key = "sample_key";
    let signData = DigitalSignature(key,data,req.body.privateKey,null,null,null,"sign");
    res.status(200).json(signData);
    // res.end(`signature ${signData?.signature} \n hash ${signData?.hash} `)
});

app.post('/verify', (req, res) => {
    let key = "sample_key";
    let data = "This is a sample input string YOYO";
    let verifed = DigitalSignature(key,data,req.body?.privateKey,req.body?.publicKey,req.body?.signature,req.body?.hash,'verify');
    res.json(verifed)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const crypto = require('crypto');
const fs = require('fs');

class DigitalSignatureUtil {
    constructor() {
        
    }
    generateKeyPair(key){
        crypto.generateKeyPair('rsa', {
            modulusLength: 4096, // Adjust based on security needs
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: key // Choose a strong passphrase
            }
        }, async (err, publicKey, privateKey) => {
            if (err) throw err;
        
            // Store or export the keys securely (using encryption if necessary)
            console.log('Public key:', publicKey.toString('utf8'));
            console.log('Private key:', privateKey.toString('utf8'));
            return {
                publicKey: publicKey.toString('utf8'), privateKey: privateKey.toString('utf8')
            }
        });

    }

    signatureOnData(planText,passphrase,privateKey1){
        try {
            const privateKey = fs.readFileSync('./private-key.pem', 'utf8');
            const buf = Buffer.from(planText);
            const hash = crypto.createHash('sha256').update(buf).digest(); 
            const sign = crypto.createSign('RSA-SHA256');
            sign.update(hash);
    
            const signature = sign.sign({ key: privateKey, passphrase: passphrase }, 'base64');
    
            console.log('Signature:', signature, hash.toString('base64'));
            return { signature: signature, hash:hash.toString('base64') };
        } catch (error) {
            console.error('Error:', error.message);
            return { error: error.message };
        }
    }

    verifySignature(signature,hash,publicKey1){
        const publicKey = fs.readFileSync('./public-key.pem', 'utf8');
        const data = Buffer.from(hash,'base64');

        const verify = crypto.createVerify('RSA-SHA256');
        verify.update(data);

        const isVerified = verify.verify(publicKey, signature, 'base64');

        console.log('Signature verification:', isVerified);
        return { isVerified: isVerified };
    }  
}
exports.DigitalSignature =(key, data, privateKey, publicKey,signature,hash, action)=>{

    let result = null;
    let err = null;
      
    if (err == null) {
        try {
            const encrypter = new DigitalSignatureUtil();
            if (action === "gen") {
                result = encrypter.generateKeyPair(key);
            } 
            else if (action === "sign") {
                result = encrypter.signatureOnData(data,key,privateKey);
            } 
            else if(action === "verify") {
                result = encrypter.verifySignature(signature,hash,publicKey);
            }
        } catch (e) {
            err = "error : Exception in performing the requested operation : " + e;
        }
    }
    
    if (result != null) {
        // console.log(result);
        return result;
    } else {
        console.log(err);
        return null;
    }
}


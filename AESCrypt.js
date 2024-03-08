const crypto = require('crypto');

class AesCryptUtil {
    constructor(key) {
        const skey = Buffer.from(this.getMD5(key), 'hex');
        this.setupCrypto(skey);
    }

    setupCrypto(key) {
        const iv = Buffer.from([
            0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
        ]);
        try {
            this.ecipher = crypto.createCipheriv('aes-128-cbc', key, iv);
            this.dcipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        } catch (e) {
            console.error(e);
        }
    }

    encrypt(plaintext) {
        try {
            const ciphertext = this.ecipher.update(plaintext, 'utf8', 'hex') + this.ecipher.final('hex');
            return ciphertext;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    decrypt(hexCipherText) {
        try {
            const plaintext = this.dcipher.update(hexCipherText, 'hex', 'utf8') + this.dcipher.final('utf8');
            return plaintext;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    getMD5(input) {
        try {
            const md = crypto.createHash('md5');
            md.update(input, 'utf8');
            return md.digest('hex');
        } catch (e) {
            return null;
        }
    }
}
exports.AESCALL =(key, data, action)=>{

    let result = null;
    let err = null;
    
    // console.log(key,"=>",key.length)
       
    if (key == null) {
        err = "error: no key";
    } 
    // else if (key.length < 32) {
    //     err = "error: key length less than 32 bytes";
    // }
     else if (data == null || action == null) {
        err = "error: no data";
    } else if (action == null) {
        err = "error: no action";
    } else if (!["enc","dec"].includes(action)) {
        err = "error: invalid action";
    }
    
    
    if (err == null) {
        try {
            const encrypter = new AesCryptUtil(key);
            if (action === "enc") {
                result = encrypter.encrypt(data);
            } else {
                result = encrypter.decrypt(data);
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


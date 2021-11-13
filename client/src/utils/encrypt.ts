import JSEncrypt from "jsencrypt";

interface IEncrypt {
  encrypt(input: string, key?: string): string,
  decrypt(input: string, key?: string): string
}

export class RsaEncrypt implements IEncrypt {
  encrypt(input: string, key?: string): string {
    const jsencrypt = new JSEncrypt();
    jsencrypt.setPublicKey(key || '');
    var result = jsencrypt.encrypt(input);
    if (result) {
      return result as string;
    }
    return '';
  }

  decrypt(input: string, key?: string): string {
    const jsdecrypt = new JSEncrypt();
    jsdecrypt.setPrivateKey(key || '');
    var result = jsdecrypt.decrypt(input);
    if (result) {
      return result as string;
    }
    return '';
  }
}

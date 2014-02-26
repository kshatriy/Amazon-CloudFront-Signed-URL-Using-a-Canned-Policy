/* 
 * Copyright (c) <2014> by Srikanth Kshatriy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */


function signing() {
    //Your Asset URI Eg: http://xxxxxxxxxx.cloudfront.net/test.mp4
    var url = "ASSET_URL";
    url = url.replace(/^\s+|\s+$/gm,'');
    
    //Adding expiration time as 4 hours from now
    var date = new Date;
    var expiration = parseInt((date.getTime() + (4 * 3600000)) / 1000);
    
    //Your Cloud Front access key
    var cloudfrontAccessKey = 'CLOUDFRONT_ACCESS_KEY';
        
    //canned policy statement
    var policy = '{"Statement":[{"Resource":"' + url + '","Condition":{"DateLessThan":{"AWS:EpochTime":' + expiration + '}}}]}';
    policy = policy.replace(/^\s+|\s+$/gm,'');

    //Your pem key value
    var pem_key = 'PLACE_HOLDER_FOR_PEM_KEY';
    
    //Encoding with RSA_SHA1
    var rsa = new RSAKey();
    rsa.readPrivateKeyFromPEMString(pem_key);
    var hSig = rsa.signString(policy, "sha1");
    hSig = $.trim(hSig);
    
    //Converting to base64 and replacing special character
    var signature = hex2b64(hSig);
    signature = signature.replace(/\+/g, "-");
    signature = signature.replace(/\=/g, "_");
    signature = signature.replace(/\//g, "~");
    
    //final url format
    var signedurl = url + "?Expires=" + expiration + "&Signature=" + signature + "&Key-Pair-Id=" + cloudfrontAccessKey;
    console.log(signedurl);
}
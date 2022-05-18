# Slik Files Sample App

Generate an API key on the [cloud dashboard](https://console.developers.sliksafe.com)

Refer the [detailed documentation](https://developers.sliksafe.com/docs/package/decentralized-storage) to integrate `@sliksafe/slik-files` for uploading and downloading files to the decentralized web.


## DEMO

The slik-files sample demo app is deployed to - https://slikfilesdemo.web.app/


## Install the library

```bash
# Install via yarn
yarn add @sliksafe/slik-files
```

## Upload to Filecoin

```javascript

// Import SlikFiles
import { SlikFiles } from '@sliksafe/slik-files'

// Initialize slik-files
const initParams = { apiKey: "... <enter your api key> ..." }
const filesHandler = await SlikFiles.initialize(initParams)

// A file-like object with raw data. The File interface inherits from Blob.
// Assign the file object received after uploading a file.
let file: File = 

// Upload a file with upload options
const uploadOptions = { 
    networks: ["filecoin"],
    walletAddress: "0x5c14E7A5e9D4568Bb8B1ebEE2ceB2E32Faee1311",
    file: file,
    isEncrypted: false,
}

filesHandler.uploadFile(uploadOptions, (uploadHandle, fileId, err) => {
    console.log("The unique identifier of the file uploaded: ", fileId);
    
    if (!!err) {
      console.error('Failed to upload file: ', err)
    } else {
      console.log("Uploading file progress: ", uploadHandle);
      setUploadDownloadProgress(uploadHandle.percentage);

      if (uploadHandle.status === "uploaded") {
        console.log("File upload finished");
        console.log("The unique identifier of the file uploaded: ", fileId);
      }
    }
});

```


## Upload to Arweave

```javascript

// Import SlikFiles
import { SlikFiles } from '@sliksafe/slik-files'

// Initialize slik-files
const initParams = { apiKey: "api_key_string" }
const filesHandler = await SlikFiles.initialize(initParams)

// A file-like object with raw data. The File interface inherits from Blob.
// Assign the file object received after uploading a file.
let file: File = 

// Upload a file with upload options
const uploadOptions = { 
    networks: ["arweave"],
    walletAddress: "0x5c14E7A5e9D4568Bb8B1ebEE2ceB2E32Faee1311",
    file: file,
    isEncrypted: false,
}

filesHandler.uploadFile(uploadOptions, (uploadHandle, fileId, err) => {
    console.log("The unique identifier of the file uploaded: ", fileId);
    
    if (!!err) {
      console.error('Failed to upload file: ', err)
    } else {
      console.log("Uploading file progress: ", uploadHandle);
      setUploadDownloadProgress(uploadHandle.percentage);

      if (uploadHandle.status === "uploaded") {
        console.log("File upload finished");
        console.log("The unique identifier of the file uploaded: ", fileId);
      }
    }
});


```



## Notes

Let's use the decentralized web! 

![chandler-thumbsup](https://user-images.githubusercontent.com/2617936/164838147-c323a88b-82c9-42fc-9964-2cbe060e7488.gif)



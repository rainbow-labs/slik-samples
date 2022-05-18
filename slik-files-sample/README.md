# Slik Files Sample App

The sample demo app is deployed to - https://slikfilesdemo.web.app/

You would need an API key to upload/download files. You can generate an API key on the developer dashboard: [https://console.developers.sliksafe.com
](https://console.developers.sliksafe.com)

The detailed documentation to integrate `@sliksafe/slik-files` to upload/download files can be found here: https://slik.gitbook.io/docs/packages/upload-and-download-files

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



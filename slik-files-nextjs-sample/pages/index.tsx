import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React from 'react'
import { SlikFiles } from '@sliksafe/slik-files'
import { useEffect, useState } from 'react'
import { Upload, message, Divider, Button, Progress } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';

const { Dragger } = Upload;


const Home: NextPage = () => {

  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [uploadedFileId, setUploadedFileId] = useState<string>()

  const initParams = { apiKey: ".... api ... key ... " }

  const uploadFile = async (selectedFile: File) => {

    const filesHandler = await SlikFiles.initialize(initParams)
    let file: File = selectedFile

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
        setUploadProgress(uploadHandle.percentage);

        if (uploadHandle.status === "uploaded") {
          console.log("File upload finished");
          console.log("The unique identifier of the file uploaded: ", fileId);

          setUploadedFileId(fileId)
        }
      }
    });

  }

  const downloadProgressCallback = (value) => {
    setDownloadProgress(value)
  }

  const downloadFile = async (fileId: string, callback: any) => {
    const filesHandler = await SlikFiles.initialize(initParams)

    // Download a file with download options
    const downloadOptions = {
      fileId: fileId,
      walletAddress: "0x5c14E7A5e9D4568Bb8B1ebEE2ceB2E32Faee1311",
    }

    filesHandler.downloadFile(downloadOptions, (downloadHandle, file, err) => {
      console.log("Downloading file progress: ", downloadHandle.percentage);


      callback(downloadHandle.progress)

      if (downloadHandle.status === "downloaded") {
        console.log("File download finished");
        console.log("Downloaded file: ", file);

        /// Save the downloaded file.
        saveAs(file)
      }
    });
  }

  const props = {
    name: 'file',
    multiple: false,
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  
  const handleUploadAction = (actionProps: any) => {
    console.log(`Action props: `, actionProps)
    uploadFile(actionProps)
    return undefined
  }

  const beforeUpload = (file) => {
    
    return true
  }
  

  return (
    <div className={styles.container}>
      <Head>
        <title>Slik Files NextJS Sample</title>
        <meta name="description" content="Slik files nextjs sample" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://sliksafe.com">Slik!</a>
        </h1>

        <p className={styles.description}>
          Get started by uploading a file to the {' '}
          <code className={styles.code}>arweave | filecoin | ...</code>
        </p>

        <Dragger 
          action={(file: any) => handleUploadAction(file)} 
          {...props} 
          style={{ width: '500px', borderRadius: '8px' }} 
          beforeUpload={beforeUpload}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Backup to Decentralized Storage
          </p>
        </Dragger>

        <Progress percent={uploadProgress} style={{ width: '400px', padding: '16px 0px', visibility: uploadProgress <= 10 ? 'hidden' : 'visible'}} />

        <Divider style={{ width: '300px' }} />

        <Button loading={downloadProgress > 10} onClick={() => downloadFile(uploadedFileId, downloadProgressCallback)} disabled={!!uploadedFileId ? false : true}>
          Download File
        </Button>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://sliksafe.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Slik!
        </a>
      </footer>
    </div>
  )
}

export default Home

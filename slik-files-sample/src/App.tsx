import { useState, useEffect } from 'react';
import './App.css';
import { SlikFiles } from '@sliksafe/slik-files';
import { Button, Col, Checkbox, Empty, message, Row, Typography, Upload, Input, Alert, Steps, Table, Spin, Progress } from 'antd';
import { saveAs } from 'file-saver';
import { SlikMint } from '@sliksafe/mint';

const { Dragger } = Upload;
const { Text } = Typography;
const { Step } = Steps;

function App() {

  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [apiKey, setAPIKey] = useState<string>()

  const [selectedFiles, setSelectedFiles] = useState<any>([])
  const [uploadedFile, setUploadedFile] = useState<any>()
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(["filecoin"]);
  const [networkDetails, setNetworkDetails] = useState<any>([]);
  const [uploadDownloadProgress, setUploadDownloadProgress] = useState(0);

  useEffect(() => {
    if (!!uploadedFile) {
      SlikFiles.getInstance().networkDetails(uploadedFile, networkDetailsListenerCallback);
    }
  }, [uploadedFile]);

  const networkDetailsListenerCallback = (response: any) => {
    console.log("networkDetailsListenerCallback", response);
    setNetworkDetails(response);
  }

  function onChange(selectedValues: any) {
    setSelectedNetworks(selectedValues);
  }

  const networkOptions = [
    { label: 'FileCoin', value: 'filecoin' },
    { label: 'Storj', value: 'storj' }
  ];

  const props = {
    name: 'file',
    multiple: false,
    beforeUpload(file: any) {
      setSelectedFiles([file]);
      return false;
    }
  };

  async function uploadFile() {
    if (!!!apiKey) {
      message.error({
        key: 'api-key-error',
        content: 'Please enter an API key'
      })
      return
    }

    if (!!!selectedNetworks || selectedNetworks.length === 0) {
      message.error({
        key: 'network-selection-error',
        content: "Please select at least one network"
      });
      return;
    }

    if (!!!selectedFiles || selectedFiles.length === 0) {
      message.error({
        key: 'file-selection-error',
        content: 'Please select a file'
      })
      return
    }

    const initParams: any = {
      apiKey: apiKey
    };


    setIsUploading(true)

    const filesHandler = await SlikFiles.initialize(initParams);
    let uploadOptions: any = {
      isEncrypted: false,
      networks: selectedNetworks,
      walletAddress: "0x5c14E7A5e9D4568Bb8B1ebEE2ceB2E32Faee1311"
    }

    let pendingUploadCount = selectedFiles.length
    selectedFiles.forEach((selectedFile: any) => {
      uploadOptions['file'] = selectedFile;
      filesHandler.uploadFile(uploadOptions, (uploadHandle: any, fileId: string, err: any) => {
        if (!!err) {
          message.error("Failed to upload file.")
          console.error('Failed to upload file: ', err)
        } else {
          console.log("Uploading file progress: ", uploadHandle);
          setUploadDownloadProgress(uploadHandle.percentage);
          if (uploadHandle.status === "uploaded") {
            console.log("File upload finished");
            console.log("The unique identifier of the file uploaded: ", fileId);
            setUploadedFile(fileId);
            setIsUploading(false);
            setSelectedFiles([]);
            setUploadDownloadProgress(0);
            message.success({
              key: 'upload-success',
              content: 'File upload finished'
            })
          }
        }
      });
    });
  }

  async function uploadMint() {
    if (!!!apiKey) {
      message.error({
        key: 'api-key-error',
        content: 'Please enter an API key'
      })
      return
    }

    if (!!!selectedFiles || selectedFiles.length === 0) {
      message.error({
        key: 'file-selection-error',
        content: 'Please select a file'
      })
      return
    }

    const initParams: any = {
      apiKey: apiKey
    };


    setIsUploading(true)

    const filesHandler = await SlikMint.initialize(initParams);
   
    const contractOptions = {
      tokenName: "BoredApeYachtClub",
      tokenSymbol: "BAYC",
      chain: "polygon",
      protocol: "ERC721"
    }
    filesHandler.deployContract(contractOptions, (response: any, err: any) => {
      console.log("The contract was deployed with id: ", response.contractId);
    })

    const metadataJSON = {
      name: "My Awesome NFT #1",
      description: "This is the description of my awesome, NFT!",
    }

    const mintOptions: any = {
      walletAddress: "0x5c14E7A5e9D4568Bb8B1ebEE2ceB2E32Faee1311",
      contractAddress: "<enter-contract-address>",
      storageNetwork: "filecoin", // or "arweave"
      chain: "polygon",
      metadata: metadataJSON,
    }
    selectedFiles.forEach((selectedFile: any) => {
      mintOptions['file'] = selectedFile;
      filesHandler.mintNFT(mintOptions, (response: any, err: any) => {
        if (!!err) {
          console.error("Failed to mint NFTs");
          return
        }
        const txId = response.txId;
        console.log("NFT minting completed. Transaction id: ", txId);
      });
    });
  }

  async function downloadFile() {
    if (!!!uploadedFile) {
      message.error({
        key: 'file-download-error',
        content: 'Please upload a file first'
      })
      return
    }
    setIsDownloading(true)
    const filesHandler = SlikFiles.getInstance();
    let downloadOptions: any = {
      fileId: uploadedFile,
      walletAddress: "0x5c14E7A5e9D4568Bb8B1ebEE2ceB2E32Faee1311"
    }

    filesHandler.downloadFile(downloadOptions, (downloadHandle: any, file: any, err: any) => {
      if (!!err) {
        console.error(err);
        message.error("Failed to download file.")
        console.error('Failed to download file: ', err)
      } else {
        console.log("Downloading file progress: ", downloadHandle.percentage);
        setUploadDownloadProgress(downloadHandle.percentage);
        if (downloadHandle.status === "downloaded") {
          setIsDownloading(false)
          setUploadDownloadProgress(0)
          console.log("File download finished");
          console.log("Downloaded file: ", file);
          saveAs(file); // saving file to local disk
          message.success({
            key: 'download-success',
            content: 'File download finished'
          });
        }
      }
    });
  }

  const renderDraggerDiv = () => {
    return (
      <Dragger
        {...props} fileList={selectedFiles}
        style={{ backgroundColor: 'transparent', width: "50%", borderRadius: '8px', margin: 16 }}>
        <Empty
          description={
            <Row align='middle' justify='start'>
              <Col>
                <div
                  className='tip-status-card'
                >
                  <Text style={{ textAlign: 'center' }}>Drag and Drop a file</Text>
                </div>
              </Col>
            </Row>
          }
        />
      </Dragger>
    )
  }

  const renderAPIKeyRegistration = () => {
    return (
      <div>
        <div>
          <Alert
            // message="Register API Key"
            description={`Get an API Key from https://console.developers.sliksafe.com`}
            type="warning"
            style={{ borderRadius: '8px', margin: 16, width: '50%' }}
          />
        </div>
        <div>
          <Input
            placeholder="Enter API Key"
            style={{ borderRadius: '8px', margin: 16, height: 44, width: '50%' }}
            onChange={(event) => setAPIKey(event.target.value)} />
        </div>
      </div>
    )
  }

  const renderStorageNetworkSelection = () => {
    return (
      <div>
        <p style={{ margin: 16 }}>Select as many storage networks<br /></p>
        <Checkbox.Group style={{ margin: 16 }} options={networkOptions} defaultValue={['filecoin']} onChange={onChange} />
      </div>
    )
  }

  const renderProgressBar = () => {
    if (uploadDownloadProgress === 0) {
      return <></>;
    }
    return (<Row style={{ maxWidth: '50%' }} justify="center" align='middle'>
      <Col span={24}>
        <Progress percent={uploadDownloadProgress} />
      </Col>
    </Row>);
  }

  const renderFileSelection = () => {
    return (
      <div>
        {renderDraggerDiv()}
        {renderProgressBar()}

        <Button
          type="primary"
          loading={isUploading}
          style={{ margin: 16 }}
          onClick={() => uploadMint()}>
          Upload
        </Button>
        {
          uploadedFile ?
            <Button
              type="primary"
              loading={isDownloading}
              style={{ margin: 16 }}
              onClick={() => downloadFile()}>
              Download
            </Button> : <></>
        }
      </div >
    )
  }

  const columns = [
    {
      title: 'Network Name',
      dataIndex: 'networkName',
      key: 'networkName',
    },
    {
      title: 'Network Url',
      dataIndex: 'networkUrl',
      key: 'networkUrl',
      render: (networkUrl: any) => {
        if (!!!networkUrl) {
          return (<Spin />);
        }
        return (
          <a href={networkUrl} target={'_blank'}>
            {networkUrl}
          </a>
        )
      }
    },
  ];

  const renderNetworkDetails = () => {
    if (!!!networkDetails || networkDetails.length === 0)
      return <></>;

    return (<Table dataSource={networkDetails} columns={columns} style={{ maxWidth: '60%' }} />);
  }

  return (
    <div className="App">
      <Row justify='center'>
        <Col span={24} style={{ maxWidth: '60%' }}>
          <p style={{ margin: 16 }}>Slik Files Demo App<br /></p>

          <Steps direction="vertical" current={2} progressDot>
            <Step title="Register API Key" description={renderAPIKeyRegistration()} />
            <Step title="Select storage networks" description={renderStorageNetworkSelection()} />
            <Step title="Upload file" description={renderFileSelection()} />
          </Steps>
          {renderNetworkDetails()}
        </Col>
      </Row>
    </div>
  );
}

export default App;

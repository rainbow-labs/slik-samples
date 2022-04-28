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
  const [isDeployingContract, setIsDeployingSmartContract] = useState(false)
  const [contractAddress, setContractAddress] = useState<string>()
  const [mintedHash, setMintedHash] = useState<string>()
  const [nftName, setNftName] = useState<string>()
  const [nftDesc, setNftDesc] = useState<string>()

  const [isDownloading, setIsDownloading] = useState(false)
  const [apiKey, setAPIKey] = useState<string>()
  const [tokenName, setTokenName] = useState<string>()
  const [tokenSymbol, setTokenSymbol] = useState<string>()

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
    { label: 'Filecoin', value: 'filecoin' },
    { label: 'Storj', value: 'storj' },
    { label: 'Arweave', value: 'arweave' }
  ];

  const props = {
    name: 'file',
    multiple: false,
    beforeUpload(file: any) {
      setSelectedFiles([file]);
      return false;
    }
  };

  async function mintNFT() {
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

    const metadataJSON = {
      name: nftName,
      description: nftDesc,
    }

    const mintOptions: any = {
      walletAddress: "0x5c14E7A5e9D4568Bb8B1ebEE2ceB2E32Faee1311",
      contractAddress: contractAddress,
      storageNetwork: "filecoin", // or "arweave"
      chain: "polygon",
      metadata: metadataJSON,
    }
    selectedFiles.forEach((selectedFile: any) => {
      mintOptions['file'] = selectedFile;
      filesHandler.mintNFT(mintOptions, (response: any, err: any) => {
        if (!!err) {
          console.error("Failed to mint NFTs", err);
          return
        }
        const txId = response.txId;
        console.log("NFT minting completed. Transaction id: ", txId);
        setMintedHash(`https://mumbai.polygonscan.com/tx/${txId}`);
      });
    });
  }

  async function deployContract() {
    if (!!!apiKey) {
      message.error({
        key: 'api-key-error',
        content: 'Please enter an API key'
      })
      return
    }

    const initParams: any = {
      apiKey: apiKey
    };

    setIsDeployingSmartContract(true)

    const deployContractHandler = await SlikMint.initialize(initParams);

    const contractOptions = {
      tokenName: tokenName,
      tokenSymbol: tokenSymbol,
      chain: "polygon",
      protocol: "ERC721"
    }
    deployContractHandler.deployContract(contractOptions, (response: any, err: any) => {
      setIsDeployingSmartContract(false);
      if (!!err) {
        console.error("Failed to deploy contract", err);
        return
      }
      console.log("The contract was deployed with id: ", response.contractId);
      setContractAddress(`https://etherscan.io/address/${response.contractId}`);
    })
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

  const renderDeploySmartContract = () => {
    return (
      <div>
        <p style={{ margin: 16 }}>Enter NFT Contract Details<br /></p>
        <div>
          <Input
            placeholder="Enter Token Name"
            style={{ borderRadius: '8px', margin: 16, height: 44, width: '50%' }}
            onChange={(event) => setTokenName(event.target.value)} />

          <Input
            placeholder="Enter Token Symbol"
            style={{ borderRadius: '8px', margin: 16, height: 44, width: '50%' }}
            onChange={(event) => setTokenSymbol(event.target.value)} />
        </div>
        <div>
          <Button
            type="primary"
            loading={isDeployingContract}
            style={{ margin: 16 }}
            onClick={() => deployContract()}>
            Deploy Contract
          </Button>
        </div>
        <div>
          {!!contractAddress ? <Alert
            description={`Contract address is: ${contractAddress}`}
            type="success"
            style={{ borderRadius: '8px', margin: 16, width: '50%' }}
          /> : <div></div>}
        </div>
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

  const renderMintNFT = () => {
    return (
      <div>
        {renderDraggerDiv()}
        {renderProgressBar()}

        <div>
          <Input
            placeholder="Enter NFT Name"
            style={{ borderRadius: '8px', margin: 16, height: 44, width: '50%' }}
            onChange={(event) => setNftName(event.target.value)} />

          <Input
            placeholder="Enter NFT Description"
            style={{ borderRadius: '8px', margin: 16, height: 44, width: '50%' }}
            onChange={(event) => setNftDesc(event.target.value)} />
        </div>

        <Button
          type="primary"
          loading={isUploading}
          style={{ margin: 16 }}
          onClick={() => mintNFT()}>
          Upload and mint NFT
        </Button>

        <div>
          {!!mintedHash ? <Alert
            description={`Minted NFT transaction hash: ${mintedHash}`}
            type="success"
            style={{ borderRadius: '8px', margin: 16, width: '50%' }}
          /> : <div></div>}
        </div>
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
          <p style={{ margin: 16 }}>Slik Mint Demo App<br /></p>

          <Steps direction="vertical" current={2} progressDot>
            <Step title="Register API Key" description={renderAPIKeyRegistration()} />
            <Step title="Deploy a NFT smart contract" description={renderDeploySmartContract()} />
            <Step title="Mint a NFT" description={renderMintNFT()} />
          </Steps>
          {renderNetworkDetails()}
        </Col>
      </Row>
    </div>
  );
}

export default App;

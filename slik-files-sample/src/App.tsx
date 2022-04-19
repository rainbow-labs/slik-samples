import { useEffect, useState } from 'react';
import './App.css';
import { SlikFiles } from 'slik-files';
import Icon, { AppstoreOutlined, DeleteOutlined, EditOutlined, FileAddOutlined, FireOutlined, MessageOutlined, MoreOutlined, PlusOutlined, ShareAltOutlined, UnorderedListOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, Checkbox, Empty, Menu, message, PageHeader, Popover, Radio, Row, Space, Typography, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Text } = Typography;

function App() {
  const [selectedFiles, setSelectedFiles] = useState<any>([])
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(["filecoin"]);

  const initParams: any = {
    apiKey: 'aRc7TO9fkyuJZJr51H1gAVLt0z1wrMdXNlIoP5QJS3c='
  };

  function onChange(selectedValues: any) {
    setSelectedNetworks(selectedValues);
  }

  const networkOptions = [
    { label: 'FileCoin', value: 'filecoin' },
    { label: 'Storj', value: 'storj' },
    { label: 'Arweave', value: 'arweave' },
    { label: 'S3', value: 's3' },
    { label: 'GCS', value: 'gcs' },
  ];

  const props = {
    name: 'file',
    multiple: true,
    beforeUpload(file: any) {
      const currentSelectedFiles = selectedFiles;
      currentSelectedFiles.push(file);
      setSelectedFiles([...currentSelectedFiles]);
      return false;
    }
  };

  async function uploadFile() {
    if (!!!selectedNetworks || selectedNetworks.length === 0) {
      message.error("Please select a network");
      return;
    }
    
    const filesHandler = await SlikFiles.initialize(initParams);
    let uploadOptions: any = {
      isEncrypted: false,
      networks: selectedNetworks,
      walletAddress: "0x5c14E7A5e9D4568Bb8B1ebEE2ceB2E32Faee1311"
    }
    selectedFiles.forEach((selectedFile: any) => {
      uploadOptions['file'] = selectedFile;
      filesHandler.uploadFile(uploadOptions, (fileId: string, err: any) => {
        console.log("The unique identifier of the file uploaded: ", fileId);
      });
    });
    setSelectedFiles([]);
  }

  const renderDraggerDiv = () => {
    return (
      <Dragger
        {...props} fileList={selectedFiles}
        style={{ backgroundColor: 'transparent', width: "70%", margin: "auto" }}>
        <Empty
          image={<div />}
          description={
            <Row align='middle' justify='center'>
              <Col>
                <div
                  className='tip-status-card'
                >
                  <Text style={{ fontSize: '24px' }}>Drag & Drop your folder</Text>
                </div>
              </Col>
            </Row>
          }
        />
      </Dragger>
    )
  }

  return (
    <div className="App">
      <p style={{ margin: 16 }}>Slik Files Demo App<br /></p>
      <p style={{ margin: 16 }}> Choose Network<br /></p>
      <Checkbox.Group style={{ margin: 16 }} options={networkOptions} defaultValue={['filecoin']} onChange={onChange} />
      {renderDraggerDiv()}
      <Button type="primary" style={{ margin: 16 }} onClick={() => {
        uploadFile()
      }}>Upload</Button>
    </div>
  );
}

export default App;

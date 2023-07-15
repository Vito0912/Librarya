'use client'

import MultiLevelSidebar from './components/multiLevelSidebar'
import NavBar from './components/navBar'
import UploadForm from './components/uploadForm';
import Frame from './pages/frame'
import { useState } from 'react';


export default function Home() {

  const [isOpen, setIsOpen] = useState(false); // Initial value of isOpen is set to false

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen); // Toggles the value of isOpen when called
  };

  const [isUploadOpen, setIsUploadOpen] = useState(false); // Initial value of isOpen is set to false

  const handleToggleUpload = () => {
    setIsUploadOpen(!isUploadOpen); // Toggles the value of isOpen when called
    console.log(isUploadOpen);
  };

  return (
    <Frame 
    key={'mainFrame'}
      children={[
        <>
          <NavBar key="navBar" handleToggleSidebar={handleToggleSidebar} handleUploadPopup={handleToggleUpload} />,
          {isUploadOpen ? <UploadForm key="uploadform" toggle={handleToggleUpload} /> : null},
          <MultiLevelSidebar key="levelsidebar" showSidebar={isOpen} />
        </>
      ]}
    />
    
  )
}

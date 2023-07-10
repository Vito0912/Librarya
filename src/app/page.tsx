'use client'

import MultiLevelSidebar from './components/multiLevelSidebar'
import NavBar from './components/navBar'
import Upload from './components/upload';
import Frame from './pages/frame'
import { useState } from 'react';


export default function Home() {

  const [isOpen, setIsOpen] = useState(false); // Initial value of isOpen is set to false

  const handleToggleSidebar = () => {
    setIsOpen(!isOpen); // Toggles the value of isOpen when called
  };

  const [isUploadOpen, setIsUploadOpen] = useState(false); // Initial value of isOpen is set to false

  const handleToggleUpload = () => {
    setIsUploadOpen(!isOpen); // Toggles the value of isOpen when called
  };

  return (
    <Frame 
    key={Math.random()}
      children={[
        <NavBar key="navBar" handleToggleSidebar={handleToggleSidebar} handleUploadPopup={handleToggleUpload} />,
        <Upload key="upload" showUpload={isUploadOpen} setShowUpload={handleToggleUpload} />,
        <MultiLevelSidebar key="levelsidebar" showSidebar={isOpen} />
        
      ]}
    />
    
  )
}

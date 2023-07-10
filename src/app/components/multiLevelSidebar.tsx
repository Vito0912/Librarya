import React from 'react';

import SidebarElement from './sidebarElements';

// Probs
interface MultiLevelSidebarProps {
  showSidebar: boolean;
}

const MultiLevelSidebar: React.FC<MultiLevelSidebarProps> = ({showSidebar}) => {
  return (


      <aside
        key={2131}
        id="sidebar-multi-level-sidebar"
        className={`fixed top-[4rem] left-0 z-40 w-64 h-screen transition-transform md:translate-x-0 ${showSidebar === true ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 pt-10">
          <ul key={'sidebarList'} className="space-y-2 font-medium">
            
                <SidebarElement key='media' title='Medien' hoverText='Alle Medien' url='#' imagePath='./vercel.svg'subElements={
                    [
                        <SidebarElement key='documents' title='Dokumente' hoverText='Alle Bücher, Dokumente und PDFs' url='#'/>,
                        <SidebarElement key='audio' title='Audio' hoverText='Alle Hörbucher' url='#'/>,
                        <SidebarElement key='video' title='Video' hoverText='Alle Filme' url='#'/>
                    ]
                } />
                <SidebarElement key='sync' title='Sync Status' hoverText='Der aktuelle Status der Syncronisation des Fortschritts der Medien' url='#' imagePath='./vercel.svg'/>
            
          </ul>
        </div>
      </aside>
  );
};

export default MultiLevelSidebar;

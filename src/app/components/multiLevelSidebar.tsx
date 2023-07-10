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
          <ul key={Math.random()} className="space-y-2 font-medium">
            
                <SidebarElement key='media' title='Medien' hoverText='Alle Medien' url='#' imagePath='./vercel.svg'subElements={
                    [
                        <SidebarElement key='documents' title='Dokumente' hoverText='Alle Bücher, Dokumente und PDFs' url='#'/>,
                        <SidebarElement key='audio' title='Audio' hoverText='Alle Hörbucher' url='#'/>,
                        <SidebarElement key='video' title='Video' hoverText='Alle Filme' url='#'/>
                    ]
                } />
                <SidebarElement key='sync' title='Sync Status' hoverText='Der aktuelle Status der Syncronisation des Fortschritts der Medien' url='#' imagePath='./vercel.svg'/>
                <SidebarElement  key={Math.random()}title='Home3' hoverText='Home' url='#' imagePath='./vercel.svg'/>
                <SidebarElement key={Math.random()} title='Home 4' hoverText='Home' url='#' imagePath='./vercel.svg'/>
                <SidebarElement key={Math.random()} title='Home 5' hoverText='Home' url='#' imagePath='./vercel.svg'/>
                <SidebarElement key={Math.random()} title='Home 6' hoverText='Home' url='#' imagePath='./vercel.svg'/>
                <SidebarElement key={Math.random()} title='Home 7' hoverText='Home' url='#' imagePath='./vercel.svg'/>
                <SidebarElement key={Math.random()} title='Home 8' hoverText='Home' url='#' imagePath='./vercel.svg'/>
                <SidebarElement key={Math.random()} title='Home 9' hoverText='Home' url='#' imagePath='./vercel.svg' subElements={
                    [
                        <SidebarElement key={Math.random()} title='Home 10' hoverText='Home' url='#'/>,
                        <SidebarElement key={Math.random()} title='Home 11' hoverText='Home' url='#'/>
                    ]
                }
                />
                <SidebarElement key={Math.random()} title='Home 12' hoverText='Home' url='#' imagePath='./vercel.svg' subElements={
                    [

                        <SidebarElement key={Math.random()} title='Home 14' hoverText='Home' url='#'/>,
                        <SidebarElement key={Math.random()} title='Home 14' hoverText='Home' url='#'/>,
                        <SidebarElement key={Math.random()} title='Home 15' hoverText='Home' url='#'/>,
                        <SidebarElement key={Math.random()} title='Home 16' hoverText='Home' url='#'/>,
                        <SidebarElement key={Math.random()} title='Home 17' hoverText='Home' url='#'/>,
                    ]
                }
                />
            
          </ul>
        </div>
      </aside>
  );
};

export default MultiLevelSidebar;

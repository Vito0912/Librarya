'use client'

import React, { useState } from 'react';
import Image from 'next/image'
import { randomBytes } from 'crypto';


interface SidebarElementProps {
    title: string;
    hoverText: string;
    url: string;
    imagePath?: string;
    subElements?: React.ReactElement<SidebarElementProps>[];
}

const SidebarElement: React.FC<SidebarElementProps> = ({ title, hoverText, url, imagePath, subElements }) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

     const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <li key={'list_' + title}>
        { !subElements && (<a
             key={'a_' + title}
            href={url}
            className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${imagePath == undefined ?? 'pl-[50px]'}`}
            title={hoverText}>
            

    
            {imagePath != undefined ? (
            <Image
                src={imagePath ?? ''}
                alt={title}
                width={24}
                height={24}
                priority
            />
            ) : <div></div>}

            <span className={`${imagePath !== undefined ? 'ml-3' : 'ml-12 text-left whitespace-nowrap'}`}>{title}</span>
        </a>)}

        { subElements && (
                            <button
                            key={'button_' + title}
                            type="button"
                            className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                            onClick={toggleDropdown}
                        >

                        <Image
                        src={imagePath ?? ''}
                        alt={title}
                        width={24}
                        height={24}
                        priority
                        />
                    
                        <span className="flex-1 ml-3 text-left whitespace-nowrap">{title}</span>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  </button>
        )}
        
        {subElements && (
            
            <ul key={Math.random()} id="dropdown-example" className={`py-2 space-y-2 ${isDropdownOpen ? '' : 'hidden'}`}>
                {subElements.map((element, index) => element)}
            </ul>
        )}
        </li>
    );
};



export default SidebarElement;
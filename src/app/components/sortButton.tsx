import React, { useState } from 'react';
import Image from 'next/image'

interface sortButtonProps {
    title: string;
    hoverText: string;
    url: string;
    imagePath: string;
}

const SortButton: React.FC<sortButtonProps> = ({ title, hoverText, url, imagePath }) => {
    return (
        
        <button 
            data-tooltip-target="default-table-example-full-screen-tooltip"
            className="flex items-center p-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg toggle-full-view hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 dark:bg-gray-800 focus:outline-none dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <span 
                    className="sr-only">{hoverText}</span>
                        <Image
                        src={imagePath ?? ''}
                        alt={title}
                        width={24}
                        height={24}
                        priority
                        />
                </button>
    
    );
}

export default SortButton;
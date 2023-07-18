'use client'
import React, {useState, useEffect} from "react";
import SortButton from "../components/sortButton";
import Book from "../components/book";
import axios from "axios";
import { Conversion } from  "../../function/utils/helpers/conversion";

type FrameProps = {
    children: React.ReactElement[]
}


const Frame = ({children}: FrameProps) => {


    const [bookInformations, setbookInformations] = useState<any[]>([]);

    const [bookStats, setBookStats] = useState<any>();


    useEffect(() => {
      async function fetchbookInformations() {
        try {
          const response = await axios.get('/api/media');

        
          const bookInformation = response.data

          setbookInformations(bookInformation);

        } catch (error) {
            console.log(error);
        }
      }

      async function fetchBookStats() {
        try {
          const response = await axios.get('/api/media/stats');

        
          const bookStats = response.data
          setBookStats(bookStats);

        } catch (error) {
            console.log(error);
        }
      }

      fetchbookInformations();
      fetchBookStats();
    }, []);
  

    return (
        <main className="bg-gray-900 h-auto w-screen">
            {children.map((child, index) => (
                <React.Fragment key={index}>
                    {child}
                </React.Fragment>
            ))}

        <div className="p-4 md:ml-64 h-auto pt-20">

            <div className="h-[3rem] mb-4">
                <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">Bücher</h1>   
            </div>

            <div className="h-[3rem] mb-4">
                <div className="flex">
                    <div id="sort" className="flex-initial flex items-center gap-2">
                    <SortButton title="Sort 1" hoverText="Sort" url="#" imagePath="./sort_all.svg" />
                    <SortButton title="Sort 2" hoverText="Sort" url="#" imagePath="./sort_all.svg" />
                    <SortButton title="Sort 3" hoverText="Sort" url="#" imagePath="./sort_all.svg" />
                    <SortButton title="Sort 4" hoverText="Sort" url="#" imagePath="./sort_all.svg" />
                    </div>
                    <div id="statistics" className="flex-auto flex justify-end gap-4">
                            <div id="statistics-1" className="bg-gray-800 px-2 rounded-lg">
                                <div>
                                <span>Books: {bookStats != null ? (bookStats.bookCount ?? 0) : 0}</span>
                                </div>
                                <div>
                                <span>Series: {bookStats != null ? (bookStats.seriesCount ?? 0) : 0}</span>
                                </div>
                            </div>
                            <div id="statistics-2" className="bg-gray-800 px-2 rounded-lg">
                                <div>
                                <span>Tags: {bookStats != null ? (bookStats.tagCount ?? 0) : 0}</span>
                                </div>
                                <div>
                                <span>Size: {bookStats != null ? (Conversion.formatSize(bookStats.size ?? 0)): 0}</span>
                                </div>
                            </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            
                    
                {(bookInformations != undefined && bookInformations != null) ? bookInformations.map((bookInfo, index) => (
                    <Book key={bookInfo.id} id={bookInfo.id} title={bookInfo.title} authors={bookInfo.author_sort} />
                )) : null}

            </div>

            </div>

        </main>
    );
}

export default Frame;
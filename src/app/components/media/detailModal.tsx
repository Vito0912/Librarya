import axios from "axios";
import { useEffect } from "react";

interface Props {
    id: number;
}

const DetailModal: React.FC<Props> = ({id}) => {

  useEffect(() => {
    async function fetchDetailMedia() {
      try {
        const response = await axios.get('/api/media/' + id + "/detail");

      
        const bookInformation = response.data

      } catch (error) {
          console.log(error);
      }
    }
  }, []);

  return (
    <>
        <div
          className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              
            </div>
          </div>
        </div>
      </>
  );
      }
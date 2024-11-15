import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Navigate,useNavigate } from "react-router-dom";

function HomePage() {
  const [cars, setCars] = useState(null);
  const navigate=useNavigate();
  const onChange = (index) => {
    console.log('Changed to slide:', index);
  };

  const onClickItem = (index) => {
    console.log('Clicked on item:', index);
  };

  const onClickThumb = (index) => {
    console.log('Clicked on thumbnail:', index);
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    axios.get('http://localhost:5000/user/getAllCars', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      console.log(res.data, 'hello');
      setCars(res.data.cars);
    })
    .catch(err => {
      if (err.response.data.message === 'Invalid token.') {
        localStorage.removeItem('jwtToken');
        Navigate('/login');
        console.log('doing');
      }
      console.log(err);
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-[12vh] h-[calc(100vh-4rem)] overflow-y-auto p-10">
        {cars == null ? (
          <div className="flex items-center justify-center w-full h-full" role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <div className="flex flex-col md:grid md:grid-cols-3 lg:grid-cols-4 gap-5 items-center h-full w-full">
            {cars.map(car => (
              <div className="max-w-sm bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700" key={car._id}>
                <a href="#">
                  <div id="controls-carousel" className="relative w-full" data-carousel="static">
                    <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                      <Carousel showArrows={true} onChange={onChange} onClickItem={onClickItem} onClickThumb={onClickThumb}>
                        {car.images && car.images.length > 0 ? (
                          car.images.map((image, index) => {
                            const arrayBuffer = new Uint8Array(image.data.data);
                            const base64String = btoa(arrayBuffer.reduce((data, byte) => data + String.fromCharCode(byte), ''));

                            return (
                              <div key={index}>
                                <img src={`data:${image.contentType};base64,${base64String}`} alt={`Car image ${index + 1}`} />
                                
                              </div>
                            );
                          })
                        ) : (
                          <p>No images available</p>
                        )}
                      </Carousel>
                    </div>
                  </div>
                </a>
                <div className="p-5">
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{car.title}</h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{car.description}</p>
                  <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={()=>{navigate(`/car/${car._id}`)}}>
                    View Car
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;

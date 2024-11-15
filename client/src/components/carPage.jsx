import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Assuming you have a Navbar component
import { Carousel } from 'react-responsive-carousel'; // Make sure to install and import the carousel package
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import styles for the carousel

function CarPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    axios
      .get(`https://internship-6xtt.onrender.com/user/search/?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCar(res.data.car);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.data.message === 'Invalid token.') {
          localStorage.removeItem('jwtToken');
          navigate('/login');
        } else {
          setError('Failed to fetch car details');
          setLoading(false);
        }
        console.error(err);
      });
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full" role="status">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (car == null) {
    return (
      <div className="text-center text-red-500">
        No car details available
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Carousel for images */}
      <Carousel showArrows={true}>
        {car.images && car.images.length > 0 ? (
          car.images.map((image, index) => {
            const arrayBuffer = new Uint8Array(image.data.data);
            const base64String = btoa(
              arrayBuffer.reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            return (
              <div key={index}>
                <img
                  src={`data:${image.contentType};base64,${base64String}`}
                  alt={`Car image ${index + 1}`}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
            );
          })
        ) : (
          <p>No images available</p>
        )}
      </Carousel>

      {/* Car title, description, and tags */}
      <div className="mt-5">
        <h1 className="text-4xl font-bold text-gray-800">{car.title}</h1>
        <p className="text-lg text-gray-600 mt-3">{car.description}</p>

        <div className="mt-5">
          <h2 className="text-xl font-semibold text-gray-800">Tags:</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {car.tags && car.tags.length > 0 ? (
              car.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span>No tags available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarPage;


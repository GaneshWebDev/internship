import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  
  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize useForm hook
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      // Send data to your API (replace '/api/login' with your actual endpoint)
      const response = await axios.post('http://localhost:5000/user/signIn', {
        email: data.email,
        password: data.password,
      },
      {
        headers: {
          'Content-Type': 'application/json',  // Ensure the server knows it's JSON
        },
      });
       console.log(response.data.token)
        // Store token and expiration time
        localStorage.setItem('jwtToken', response.data.token);
        if(localStorage.getItem('jwtToken')){
                      // Redirect to home page or dashboard
                    navigate('/');
        }
    } catch (err) {
        if(err.status==401){
            setError('Invalid email or password ');
        }else if(err.status==404){
            setError('User not found Please SignUp')
        }
      console.log(err.status)
    } finally {
      setLoading(false);
    }
  };

  // Redirect to Signup page
  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center  min-h-screen">
      {/* Left Half: Image */}
      <div className="w-full md:w-1/2 mt-5 md:mt-0 flex items-center justify-center  bg-cover bg-center ">
        <img src='pngwing.com.png' className='h-[20vh] md:h-auto' alt="Signup illustration" />
      </div>

      {/* Right Half: Login Form */}
      <div className="w-full h-1/2 md:h-full md:w-1/2  p-8 flex flex-col justify-center ">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <form className="bg-gray-100 px-10 py-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <button
          onClick={handleSignupRedirect}
          className="mt-4 text-blue-500 text-center hover:underline"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

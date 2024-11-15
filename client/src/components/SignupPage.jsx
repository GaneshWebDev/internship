// SignupPage.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(
        'https://internship-6xtt.onrender.com/user/signUp',
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            'Content-Type': 'application/json', // Ensure the server knows it's JSON
          },
        }
      );

      if (response.status === 201) {
        // Redirect to login page on successful signup
        navigate('/login');
      } else {
        alert('Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Signup failed');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Half: Image */}
      <div className="w-full md:w-1/2 flex items-center justify-center  bg-cover bg-center">
        <img src='pngwing.com.png' className='h-[20vh] md:h-auto' alt="Signup illustration" />
      </div>

      {/* Right Half: Signup Form */}
      <div className="w-full md:w-1/2  p-8 flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='bg-gray-100 py-5 px-10'>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', { required: 'Please confirm your password' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none">
            Sign Up
          </button>
        </form>
        <button
          onClick={handleLoginRedirect}
          className="mt-4 text-blue-500 text-center hover:underline"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default SignupPage;

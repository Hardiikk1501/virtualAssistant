import React from 'react';
import bg from '../assets/AI_man.jpeg';
import { TbEyeglass2Filled, TbEyeglassOff } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';

function SignUp() {
  const navigate = useNavigate();
  const { serverUrl, userData, setUserData } = React.useContext(UserDataContext);

  const [showPassword, setShowPassword] = React.useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSignUp = async () => {


    //Testing purpose
      console.log({
    name,
    email,
    password,
  });

    // Basic Validation
    if (!name || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
        navigate('/signin');
      console.log('Sign up successful:', response.data);
    
      // Clear Form
      setName('');
      setEmail('');
      setPassword('');

      // Set user data
      setUserData(response.data);

    } catch (err) {
      console.error(
        'Error during sign up:',
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='w-full min-h-screen bg-cover bg-center bg-no-repeat relative flex items-center justify-center px-4'
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Dark Overlay */}
      <div className='absolute inset-0 bg-black/60'></div>

      {/* Form Container */}
      <form
        className='relative z-10 w-full max-w-md backdrop-blur-md bg-gray-800/10 border border-white/20 rounded-3xl p-8 shadow-2xl'
        onSubmit={(e) => {
          e.preventDefault();
          handleSignUp();
        }}
      >
        {/* Heading */}
        <h2 className='text-4xl font-bold text-white text-center mb-2'>
          Create Account
        </h2>

        <p className='text-gray-300 text-center mb-8'>
          Join your AI Assistant today
        </p>

        {/* Username */}
        <div className='mb-5'>
          <label
            className='block text-gray-200 font-medium mb-2'
            htmlFor='username'
          >
            Username
          </label>

          <input
            id='username'
            type='text'
            placeholder='Enter username'
            autoComplete='username'
            className='w-full px-4 py-3 rounded-3xl bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400'
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className='mb-5'>
          <label
            className='block text-gray-200 font-medium mb-2'
            htmlFor='email'
          >
            Email
          </label>

          <input
            id='email'
            type='email'
            placeholder='Enter email'
            autoComplete='email'
            className='w-full px-4 py-3 rounded-3xl bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className='mb-6'>
          <label
            className='block text-gray-200 font-medium mb-2'
            htmlFor='password'
          >
            Password
          </label>

          <div className='relative'>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter password'
              autoComplete='new-password'
              className='w-full px-4 py-3 pr-12 rounded-3xl bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl hover:text-cyan-400 transition'
            >
              {showPassword ? (
                <TbEyeglassOff />
              ) : (
                <TbEyeglass2Filled />
              )}
            </button>
          </div>
        </div>

        {/* error info  */}
        {error && (
          <p className='mb-4 text-red-400 bg-red-900/20  rounded-lg  text-center'>
            * {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type='submit'
          disabled={loading}
          className='w-full py-3 rounded-b-full bg-linear-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {/* Footer */}
        <p className='text-center text-gray-300 mt-6'>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/signin')}
            className='text-blue-400 hover:underline cursor-pointer'
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
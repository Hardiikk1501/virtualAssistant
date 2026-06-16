import React from 'react';
import bg from '../assets/bg.png';
import { TbEyeglass2Filled, TbEyeglassOff } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';

function SignIn() {
  const navigate = useNavigate();
  const { serverUrl, userData, setUserData} = React.useContext(UserDataContext);

  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSignIn = async () => {
    // Clear old error
    setError('');

    // Testing purpose
    console.log({
      email,
      password,
    });

    // Validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email: email.trim(),
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log('Sign in successful:', response.data);
      // Update user data in context
      setUserData(response.data.user);
      // Clear form
      setEmail('');
      setPassword('');


      // Redirect after login
      navigate('/customize');

    } catch (err) {
      console.error(
        'Error during sign in:',
        err.response?.data || err.message
      );

      setUserData(null); // Clear any existing user data on error

      setError(
        err.response?.data?.message ||
          'Signin failed. Please try again.'
      );
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
        className='relative z-10 w-full max-w-md backdrop-blur- bg-gray-800/10 border border-white/20 rounded-3xl p-8 shadow-2xl'
        onSubmit={(e) => {
          e.preventDefault();
          handleSignIn();
        }}
      >
        {/* Heading */}
        <h2 className='text-4xl font-bold text-white text-center mb-2'>
          Welcome Back
        </h2>

        <p className='text-gray-300 text-center mb-8'>
          Sign in to your AI Assistant
        </p>

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
              autoComplete='current-password'
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

        {/* Error Message */}
        {error && (
          <p className='mb-4 text-red-400 bg-red-900/20 p-2 rounded-lg text-center'>
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type='submit'
          disabled={loading}
          className='w-full py-3 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
         
       >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Footer */}
        <p className='text-center text-gray-300 mt-6'>
          Want to create a new account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className='text-blue-400 hover:underline cursor-pointer'
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
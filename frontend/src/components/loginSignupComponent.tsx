import { UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, confirmSignUp,fetchUserAttributes, signOut } from '@aws-amplify/auth';
import { useRecoilState } from "recoil";
import { userIdState, isAuthenticatedState} from "../recoil/atoms";


export default function LoginSignupComponent() {
  const [page, setPage] = useState('login'); // Default to login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState(''); // For confirm signup
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // const { setIsAuthenticated } = useAuth();
  const [, setUserId] = useRecoilState(userIdState);
  const [, setIsAuthenticated] = useRecoilState(isAuthenticatedState);


  // Navigate to the main page after successful login
  useEffect(() => {
    if (page === 'main') {
      navigate('/main');
    }
  }, [page, navigate]);

  // Handle form submission
  const handleSubmit = async (e:any) => {
    e.preventDefault();

    if (page === 'login') {
      try {
        // Login with Cognito
        const signInOutput = await signIn({ username, password });
        console.log("Sign in output:", signInOutput);

        if(signInOutput.isSignedIn == false)
        {
          throw new Error("Please Verify your Account (Check your Email for the Code)")
        }

        const user_ats = await fetchUserAttributes();

        setUserId((user_ats?.sub as string))
        alert('Login successful!');
        setIsAuthenticated(true);
        setPage('main'); // Navigate to the main page
      } catch (err:any) {
        console.error('Login error:', err);
        setError(err.message || 'An error occurred during login.');
      }
    } else if (page === 'signup') {
      try {
        // Sign up with Cognito
        await signUp({
          username,
          password,
          options: {
            userAttributes: {
              email: username,
            },
          },
        });
        alert('Signup successful! Please check your email for the verification code.');
        setPage('confirm-signup'); // Switch to confirm signup page
      } catch (err:any) {
        console.error('Signup error:', err);
        setError(err.message || 'An error occurred during signup.');
      }
    } else if (page === 'confirm-signup') {
      try {
        // Confirm Sign Up with verification code
        await confirmSignUp({username, confirmationCode});
        alert('Signup confirmed! You can now log in.');
        setPage('login'); // Switch to the login page
      } catch (err:any) {
        console.error('Confirm signup error:', err);
        setError(err.message || 'An error occurred during confirmation.');
      }
    }
  };

  useEffect(()=>{
    signOut();
  },[])

  return (
    <div className="min-h-screen w-full bg-[#1A0B2E] flex items-center justify-center overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#9D4EDD] blur-[128px]" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#7B2CBF] blur-[128px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#5A189A] blur-[128px]" />
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full max-w-md border-2 rounded-xl shadow-lg border-gray-100">
            {/* Login/Signup form container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-full p-12 rounded-2xl bg-[#2D1B44]/30 backdrop-blur-xl shadow-2xl"
            >
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent"
              >
                {page === 'login' ? 'Login' : page === 'signup' ? 'Sign Up' : 'Confirm Signup'}
              </motion.h1>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {(page === 'login' || page === 'signup' || page === 'confirm-signup') && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative group"
                  >
                    <UserCircle className="absolute left-0 top-2 h-6 w-6 text-purple-300 transition-colors group-hover:text-purple-200" />
                    <input
                      type="text"
                      placeholder="Email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-transparent border-b-2 border-purple-700/50 text-white placeholder:text-purple-300/50 
                      focus:border-purple-500 focus:outline-none transition-all duration-300
                      hover:border-purple-600/70"
                    />
                  </motion.div>
                )}

                {(page === 'login' || page === 'signup') && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative"
                  >
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-transparent border-b-2 border-purple-700/50 text-white placeholder:text-purple-300/50 
                      focus:border-purple-500 focus:outline-none transition-all duration-300
                      hover:border-purple-600/70"
                    />
                  </motion.div>
                )}

                {page === 'confirm-signup' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      placeholder="Verification Code"
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value)}
                      className="w-full px-4 py-2 bg-transparent border-b-2 border-purple-700/50 text-white placeholder:text-purple-300/50 
                      focus:border-purple-500 focus:outline-none transition-all duration-300
                      hover:border-purple-600/70"
                    />
                  </motion.div>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 via-purple-400 to-pink-400 
                  text-white font-medium tracking-wide hover:opacity-90 transition-all duration-300
                  shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 border-none focus:outline-none"
                >
                  {page === 'login' ? 'Login' : page === 'signup' ? 'Sign Up' : 'Confirm Signup'}
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-center mt-6"
                >
                  {page === 'login' ? (
                    <>
                    <p
                      onClick={() => {
                        setError('');
                        setPage('signup');
                      }}
                      className="text-sm text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
                    >
                      Don't have an account? Sign Up
                    </p>
                    <p
                      onClick={() => {
                        setError('');
                        setPage('confirm-signup');
                      }}
                      className="text-sm mt-2 text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
                    >
                      Signed Up? Verify your account
                    </p>
                    </>
                    
                    
                  ) : page === 'signup' ? (
                    <p
                      onClick={() => {
                        setError('');
                        setPage('login');
                      }}
                      className="text-sm text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
                    >
                      Already have an account? Login
                    </p>
                  ) : (
                    <p
                      onClick={() => {
                        setError('');
                        setPage('signup');
                      }}
                      className="text-sm text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
                    >
                      Didn't receive a code? Sign Up Again
                    </p>
                  )}
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

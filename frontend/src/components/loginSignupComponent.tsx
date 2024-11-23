import { UserCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import {useState} from 'react'

export default function LoginSignupComponent() {

    const [page, setPage] = useState("login");


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
        <div className="w-full max-w-md">
          {/* Login form container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full p-12 rounded-2xl bg-[#2D1B44]/30 backdrop-blur-xl shadow-2xl"
          >
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-white mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent"
            >
              Welcome
            </motion.h1>
            
            <form className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group"
              >
                <UserCircle className="absolute left-0 top-2 h-6 w-6 text-purple-300 transition-colors group-hover:text-purple-200" />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full pl-10 pr-4 py-2 bg-transparent border-b-2 border-purple-700/50 text-white placeholder:text-purple-300/50 
                    focus:border-purple-500 focus:outline-none transition-all duration-300
                    hover:border-purple-600/70"
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 bg-transparent border-b-2 border-purple-700/50 text-white placeholder:text-purple-300/50 
                    focus:border-purple-500 focus:outline-none transition-all duration-300
                    hover:border-purple-600/70"
                />
              </motion.div>
              
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
                {page === "login" ? "Login" : "Sign Up"}
              </motion.button>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center mt-6"
              >
                {page === "login" ? (
                <p
                    onClick={() => setPage("signup")} // Switch to signup page
                    className="text-sm text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
                >
                    Don't have an account? Sign Up
                </p>
            ) : (
                <p
                    onClick={() => setPage("login")} // Switch to login page
                    className="text-sm text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
                >
                    Already have an account? Login
                </p>
            )}
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
      </div>
    </div>
  )
}


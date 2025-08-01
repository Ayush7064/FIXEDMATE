import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();

  console.log(user);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavLinks = (isMobile = false) => (
    <>
      <Link to="/services" className="text-gray-600 text-lg hover:text-[#0D80F2] font-medium" onClick={isMobile ? toggleMenu : undefined}>
        Find Services
      </Link>
      {/* Logic for User */}
      {isAuthenticated && user?.role === 'user' && (
        <Link to="/my-bookings" className="text-gray-600 text-lg hover:text-[#0D80F2] font-medium" onClick={isMobile ? toggleMenu : undefined}>
          My Bookings
        </Link>
      )}
      {/* Logic for Service Provider */}
      {isAuthenticated && user?.role === 'provider' && (
        <Link to="/provider/bookings" className="text-gray-600 text-lg hover:text-[#0D80F2] font-medium" onClick={isMobile ? toggleMenu : undefined}>
          Bookings
        </Link>
      )}
      <Link to="/help" className="text-gray-600 text-lg hover:text-[#0D80F2] font-medium" onClick={isMobile ? toggleMenu : undefined}>
        Help
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center px-4 py-3 md:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-[#0D80F2] transition-colors duration-300" aria-label="FixMate Home">
          <motion.div whileHover={{ rotate: 360, transition: { duration: 0.5 } }}>
            <Sparkles size={20} style={{ color: '#0D80F2' }} />
          </motion.div>
          <span className="text-2xl">FixMate</span>
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-600 hover:text-[#0D80F2] transition-colors duration-300">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {renderNavLinks()}
          {isAuthenticated ? (
            <>
              {/* Profile Avatar */}
              <Link to="/profile" className="avatar">
                <div className="w-10 rounded-full ring-1 ring-offset-2 ring-blue-400">
                  <img src={user?.profilePic?.url || `https://ui-avatars.com/api/?name=${user?.name}&background=0D80F2&color=fff`} alt="Profile" className='w-10 rounded-full ring-1 ring-offset-2 ring-blue-400' />
                </div>
              </Link>
              {/* Original Logout Button */}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05, backgroundColor: '#0A6ADB' }}
                className="btn btn-sm text-lg text-white hover:bg-[#0D80F2] hover:opacity-90 rounded-lg px-4 py-1"
                style={{ backgroundColor: '#0D80F2' }}
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#0A6ADB' }}
                  className="btn btn-sm text-lg text-white hover:bg-[#0D80F2] hover:opacity-90 rounded-lg px-4 py-1"
                  style={{ backgroundColor: '#0D80F2' }}
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/register" className="btn btn-outline px-4 py-1 rounded-lg btn-sm text-black text-lg border-[#0D80F2] hover:bg-[#0D80F2] hover:text-white font-medium">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="flex flex-col gap-2 px-4 pb-4 md:hidden bg-white shadow-md"
          >
            {renderNavLinks(true)}
            <div className="divider my-1"></div>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-gray-700 text-lg hover:text-[#0D80F2] font-medium" onClick={toggleMenu}>Profile</Link>
                <button
                  className="btn btn-sm w-full text-lg text-white hover:bg-[#0D80F2] hover:opacity-90 rounded-lg px-4 py-1 mt-2"
                  style={{ backgroundColor: '#0D80F2' }}
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" onClick={toggleMenu}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="btn btn-sm w-full text-lg text-white hover:bg-[#0D80F2] hover:opacity-90 rounded-lg px-4 py-1"
                    style={{ backgroundColor: '#0D80F2' }}
                  >
                    Login
                  </motion.button>
                </Link>
                <Link
                  to="/register"
                  className="btn btn-outline w-full rounded-lg btn-sm text-black text-lg border-[#0D80F2] hover:bg-[#0D80F2] hover:text-white font-medium"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;

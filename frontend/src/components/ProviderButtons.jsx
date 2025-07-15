import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';





function ProviderButtons() {
    const navigate = useNavigate();
  return (
    <div className="flex mt-10 gap-4 justify-center">
  <button
   onClick={() => navigate('/services')}
   className="px-5 py-2 text-xl rounded-lg bg-[#b1b2b6] text-black font-semibold hover:bg-[#e5eaf2] transition">
    Find Services Nearby
  </button>
  
  <button
      type="button"
      onClick={() => navigate('/register')}
      className="px-5 py-2 text-xl rounded-lg bg-[#0084FF] text-gray-100 font-semibold hover:bg-[#006fe0] transition"
    >
        Join as Provider
    </button>
</div>

  )
}

export default ProviderButtons;
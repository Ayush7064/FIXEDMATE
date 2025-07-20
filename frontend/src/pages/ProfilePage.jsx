import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore'; // Assuming path is correct
import { Mail, Phone, ArrowRight } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuthStore();

  // If the user data is not yet loaded, show a loading state.
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // A simple check to see if the profile is "complete" for a provider.
  // This logic can be expanded as needed.
  const isProfileComplete = user.phone && user.name;
  const profileCompletionPercentage = isProfileComplete ? 100 : 50;

  return (
    <div className="bg-slate-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">My Profile</h1>
          <p className="text-slate-500 mt-2 text-lg">View and manage your personal information.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Profile Card (Left) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-blue-500 ring-offset-base-100 ring-offset-4">
                  {/* CORRECTED: Removed duplicate attributes from img tag */}
                  <img 
                    src={user.profilePic?.url || `https://ui-avatars.com/api/?name=${user.name}&background=0D80F2&color=fff&size=128`} 
                    alt="Profile" 
                    className="w-24 rounded-full ring ring-blue-500 ring-offset-base-100 ring-offset-4"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">{user.name}</h2>
                <p className="text-slate-500 capitalize">{user.role.replace('-', ' ')}</p>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Personal Information</h3>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600">{user.email}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="text-slate-600">{user.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Complete Profile Card (Right) - Only for Providers */}
          {/* CORRECTED: Ensured this card is a sibling within the grid and the parent div closes correctly */}
          {user.role === "provider" && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
              
              {/* Top section with text and progress bar */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700">Profile Completion</h3>
                <p className="text-sm text-slate-500 mt-1">Keep your profile updated for the best experience.</p>
                
                <div className="my-4">
                  <progress 
                    className="progress progress-primary w-full" 
                    value={profileCompletionPercentage} 
                    max="100"
                  ></progress>
                  <p className="text-right text-sm font-medium text-primary">{profileCompletionPercentage}% Complete</p>
                </div>
              </div>
              
              {/* Bottom section with the link/button */}
              <Link to={`/provider/profile/${user.id}`} className="btn btn-primary w-full mt-4">
                {isProfileComplete ? 'Edit Profile' : 'Complete Your Profile'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              
            </div>
          )}
        </div> {/* This is the correct closing tag for the grid */}

      </div>
    </div>
  );
};

export default ProfilePage;

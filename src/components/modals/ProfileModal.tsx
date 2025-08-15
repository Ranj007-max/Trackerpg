import React, { useState } from 'react';
import Modal from './Modal';
import { UserProfile } from '../../types';
import { MBBS_YEARS } from '../../constants';

interface ProfileModalProps {
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  currentProfile: UserProfile;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, onSave, currentProfile }) => {
  const [profile, setProfile] = useState<UserProfile>(currentProfile);
  const [isLocked, setIsLocked] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name) {
      alert("Please enter your name.");
      return;
    }
    onSave(profile);
    onClose();
  };

  return (
    <Modal title={isLocked ? "Your Profile" : "Edit Your Profile"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="absolute top-4 right-4 flex items-center">
            <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark mr-2">{isLocked ? 'Locked' : 'Unlocked'}</span>
            <button type="button" onClick={() => setIsLocked(!isLocked)} className="p-2 rounded-full hover:bg-secondary-light dark:hover:bg-secondary-dark transition-colors">
                {isLocked ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 4a1 1 0 100 2h2a1 1 0 100-2H8z" clipRule="evenodd" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 100-2h2a1 1 0 100 2H9zm2 4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /></svg>
                )}
            </button>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Student Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={profile.name}
            onChange={handleChange}
            className="w-full bg-primary-light dark:bg-primary-dark border border-border-color rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
            placeholder="e.g., Dr. Jane Doe"
            autoFocus
            disabled={isLocked}
          />
        </div>
        <div>
          <label htmlFor="targetYear" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">NEET PG Target Year</label>
          <input
            id="targetYear"
            name="targetYear"
            type="text"
            value={profile.targetYear}
            onChange={handleChange}
            className="w-full bg-primary-light dark:bg-primary-dark border border-border-color rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
            placeholder="e.g., 2025"
            disabled={isLocked}
          />
        </div>
        <div>
          <label htmlFor="mbbsYear" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Current MBBS Year</label>
          <select
            id="mbbsYear"
            name="mbbsYear"
            value={profile.mbbsYear}
            onChange={handleChange}
            className="w-full bg-primary-light dark:bg-primary-dark border border-border-color rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
            disabled={isLocked}
          >
            {MBBS_YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-secondary-light dark:bg-secondary-dark hover:bg-primary-light dark:hover:bg-primary-dark transition-colors border border-border-color">Cancel</button>
          {!isLocked && <button type="submit" className="px-4 py-2 rounded-md bg-accent-light dark:bg-accent-dark hover:opacity-90 text-white transition-colors font-semibold">Save Profile</button>}
        </div>
      </form>
    </Modal>
  );
};

export default ProfileModal;

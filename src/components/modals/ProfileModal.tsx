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
    <Modal title="Edit Your Profile" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Student Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={profile.name}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="e.g., Dr. Jane Doe"
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="targetYear" className="block text-sm font-medium text-slate-300 mb-1">NEET PG Target Year</label>
          <input
            id="targetYear"
            name="targetYear"
            type="text"
            value={profile.targetYear}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="e.g., 2025"
          />
        </div>
        <div>
          <label htmlFor="mbbsYear" className="block text-sm font-medium text-slate-300 mb-1">Current MBBS Year</label>
          <select
            id="mbbsYear"
            name="mbbsYear"
            value={profile.mbbsYear}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {MBBS_YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 transition-colors">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-md bg-cyan-500 hover:bg-cyan-600 transition-colors font-semibold">Save Profile</button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileModal;

import React, { useState } from 'react';
import Modal from './Modal';
import { Lecture, LectureStatus } from '../../types';
import { PLATFORMS } from '../../constants';

interface AddOrEditLectureModalProps {
  onClose: () => void;
  onSave: (lecture: Partial<Lecture>, bulkCount: number) => void;
  lecture?: Lecture;
}

const AddOrEditLectureModal: React.FC<AddOrEditLectureModalProps> = ({ onClose, onSave, lecture }) => {
  const isEditMode = !!lecture;
  const [formData, setFormData] = useState({
    name: lecture?.name || '',
    date: lecture?.date || new Date().toISOString().split('T')[0],
    platform: lecture?.platform || PLATFORMS[0],
    faculty: lecture?.faculty || '',
    status: lecture?.status || LectureStatus.NotStarted,
    videoUrl: lecture?.videoUrl || '',
    tags: lecture?.tags?.join(', ') || '',
  });
  const [bulkCount, setBulkCount] = useState<number | ''>(1);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBulkCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setBulkCount('');
    } else {
      const num = parseInt(value, 10);
      if (!isNaN(num) && num > 0) {
        setBulkCount(num);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBulkCount = bulkCount === '' || bulkCount < 1 ? 1 : bulkCount;
    if(finalBulkCount > 1 && !formData.name) {
        alert("Lecture name prefix is required for bulk add.");
        return;
    }
    if(finalBulkCount === 1 && !formData.name){
        alert("Lecture name is required.");
        return;
    }
    const finalData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };
    onSave({ id: lecture?.id, ...finalData }, finalBulkCount);
    onClose();
  };

  return (
    <Modal title={isEditMode ? 'Edit Lecture Details' : 'Add Lecture(s)'} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Lecture Name {Number(bulkCount) > 1 && '(Prefix)'}</label>
          <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className="w-full bg-background-primary border border-border-color rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent" autoFocus />
        </div>

        {!isEditMode && (
          <div>
            <label htmlFor="bulkCount" className="block text-sm font-medium text-text-secondary mb-1">Number of Lectures</label>
            <input id="bulkCount" name="bulkCount" type="number" min="1" value={bulkCount} onChange={handleBulkCountChange} className="w-full bg-background-primary border border-border-color rounded-md py-2 px-3" />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-text-secondary mb-1">Platform</label>
              <select id="platform" name="platform" value={formData.platform} onChange={handleChange} className="w-full bg-background-primary border border-border-color rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent">
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="faculty" className="block text-sm font-medium text-text-secondary mb-1">Faculty</label>
              <input id="faculty" name="faculty" type="text" value={formData.faculty} onChange={handleChange} className="w-full bg-background-primary border border-border-color rounded-md py-2 px-3" placeholder="e.g., Dr. Rakesh Nair" />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-text-secondary mb-1">Date</label>
              <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} className="w-full bg-background-primary border border-border-color rounded-md py-2 px-3" />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-text-secondary mb-1">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full bg-background-primary border border-border-color rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent">
                {Object.values(LectureStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
        </div>
        
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-text-secondary mb-1">Video URL (Optional)</label>
          <input id="videoUrl" name="videoUrl" type="url" value={formData.videoUrl} onChange={handleChange} className="w-full bg-background-primary border border-border-color rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="https://t.me/your_video_link" />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-text-secondary mb-1">Tags (comma-separated)</label>
          <input id="tags" name="tags" type="text" value={formData.tags} onChange={handleChange} className="w-full bg-background-primary border border-border-color rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="e.g., High Yield, Volatile, Must-do" />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-background-secondary hover:bg-background-primary transition-colors border border-border-color">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-md bg-accent hover:opacity-90 text-white transition-colors font-semibold">
            {isEditMode ? 'Save Changes' : `Add ${Number(bulkCount) > 1 ? `${bulkCount} Lectures` : 'Lecture'}`}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddOrEditLectureModal;

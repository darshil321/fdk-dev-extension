import React, { useState } from 'react';
import { Button } from 'paul-fds-ui';
import { Icons } from 'paul-icons-react';
import './MediaUploader.css';

const MediaUploader = ({ media = [], onMediaChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
  };

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;

    // Convert FileList to Array and process each file
    const filesArray = Array.from(files);
    const imageFiles = filesArray.filter(file => file.type.startsWith('image/'));

    // Create URL objects for preview
    const newMedia = imageFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size
    }));

    // Add to existing media
    onMediaChange([...media, ...newMedia]);
  };

  const handleRemoveMedia = (indexToRemove) => {
    const updatedMedia = media.filter((_, index) => index !== indexToRemove);
    onMediaChange(updatedMedia);
  };

  const handleReorderMedia = (fromIndex, toIndex) => {
    const updatedMedia = [...media];
    const [movedItem] = updatedMedia.splice(fromIndex, 1);
    updatedMedia.splice(toIndex, 0, movedItem);
    onMediaChange(updatedMedia);
  };

  return (
    <div className="media-uploader">
      {media.length > 0 ? (
        <div className="media-grid">
          {media.map((item, index) => (
            <div key={index} className="media-item">
              <img src={item.url || item} alt={`Media ${index + 1}`} />
              <div className="media-actions">
                {index > 0 && (
                  <Button
                    kind="tertiary"
                    icon={<Icons name="arrow-left" />}
                    onClick={() => handleReorderMedia(index, index - 1)}
                    title="Move left"
                  />
                )}
                {index < media.length - 1 && (
                  <Button
                    kind="tertiary"
                    icon={<Icons name="arrow-right" />}
                    onClick={() => handleReorderMedia(index, index + 1)}
                    title="Move right"
                  />
                )}
                <Button
                  kind="tertiary"
                  icon={<Icons name="trash" />}
                  onClick={() => handleRemoveMedia(index)}
                  title="Remove"
                  className="remove-media-btn"
                />
              </div>
            </div>
          ))}

          {/* Add more media button */}
          <div
            className={`media-dropzone ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <label htmlFor="file-upload" className="upload-label">
              <Icons name="plus" size={24} />
              <span>Add</span>
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      ) : (
        <div
          className={`empty-media-dropzone ${isDragging ? 'dragging' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <label htmlFor="file-upload" className="upload-label">
            <Icons name="image" size={48} />
            <span>Drag & drop images here or click to browse</span>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default MediaUploader;

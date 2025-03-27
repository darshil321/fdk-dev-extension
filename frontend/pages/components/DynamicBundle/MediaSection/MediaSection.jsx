import React, { useState } from "react";
import { Button, Input } from "paul-fds-ui";
import FormCard from "../../common/FormCard/FormCard";
import SvgIcon from "../../Icons/LeftArrow";
import "./MediaSection.css";

const AddMediaModal = ({ isOpen, onClose, onAdd }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAdd({ url, alt: "Media image" });
      setUrl("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="media-modal-overlay">
      <div className="media-modal">
        <div className="media-modal-header">
          <h3>Add Media URL</h3>
          <Button kind="tertiary" onClick={onClose}>
            <SvgIcon name="close" />
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            label="Media URL"
            placeholder="Enter media URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <div className="media-modal-actions">
            <Button kind="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button kind="primary" type="submit">
              Add
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MediaSection = ({ media = [], onMediaChange }) => {
  const [isRearranging, setIsRearranging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultImageUrl = "https://via.placeholder.com/120";

  const mockMedia = [
    { url: "/images/empty.png", alt: "Product image 1" },
    { url: "/images/empty.png", alt: "Pizza image" },
    { url: "/images/empty.png", alt: "Pizza image 2" },
    { url: "/images/empty.png", alt: "Chicken wings" },
    { url: "/images/empty.png", alt: "Nuggets" },
    { url: "/images/empty.png", alt: "Soda can" }
  ];

  const displayMedia = media.length > 0 ? media : mockMedia;

  const handleImageError = (e) => {
    e.target.src = defaultImageUrl;
  };

  const handleAddMedia = (newMedia) => {
    onMediaChange([...media, newMedia]);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    const crt = e.target.cloneNode(true);
    crt.style.opacity = "0.5";
    document.body.appendChild(crt);
    e.dataTransfer.setDragImage(crt, 0, 0);
    setTimeout(() => {
      document.body.removeChild(crt);
    }, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const items = [...displayMedia];
    const draggedItem = items[draggedIndex];

    items.splice(draggedIndex, 1);
    items.splice(index, 0, draggedItem);

    setDraggedIndex(index);

    if (media.length > 0) {
      onMediaChange(items);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const deleteMedia = (index) => {
    const updatedMedia = [...displayMedia];
    updatedMedia.splice(index, 1);
    onMediaChange(updatedMedia);
  };

  return (
    <FormCard>
      <div className="media-header">
        <h3 className="media-title">Media</h3>
        <Button
          kind="secondary"
          className="add-media-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Media
        </Button>
      </div>

      <div className="media-content">
        {displayMedia.length === 0 ? (
          <div className="empty-media">No media uploaded yet</div>
        ) : (
          <>
            <div className="media-grid">
              {displayMedia.map((item, index) => (
                <div
                  key={index}
                  className={`media-item ${draggedIndex === index ? 'dragging' : ''}`}
                  draggable={isRearranging}
                  onDragStart={(e) => isRearranging && handleDragStart(e, index)}
                  onDragOver={(e) => isRearranging && handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  <img
                    src={item.url}
                    alt={item.alt || `Media ${index + 1}`}
                    onError={handleImageError}
                  />

                  {isRearranging && (
                    <div className="media-item-overlay">
                      <Button
                        kind="tertiary"
                        icon={<SvgIcon name="trash" />}
                        onClick={() => deleteMedia(index)}
                        className="delete-media-btn"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="rearrange-container">
              <Button
                type="button"
                kind="secondary"
                onClick={(e) => {
                   e.preventDefault()
                  setIsRearranging(!isRearranging);
               }}
                className="rearrange-btn"
              >
                <div className="rearrange-content">
                  {isRearranging ? (
                    <>
                      <SvgIcon name="check" />
                      <span>Done</span>
                    </>
                  ) : (
                    <>
                      <SvgIcon name="move" />
                      <span>Rearrange</span>
                    </>
                  )}
                </div>
              </Button>
            </div>
          </>
        )}
      </div>

      <AddMediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddMedia}
      />
    </FormCard>
  );
};

export default MediaSection;

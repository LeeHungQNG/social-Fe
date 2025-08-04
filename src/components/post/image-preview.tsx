import { Box, Dialog, DialogContent, IconButton, ImageList, ImageListItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { useState } from 'react';

interface IPreviewImageProps {
  imagePreview: string[];
  onRemove?: (index: number) => void;
}

const ImagePreview = ({ imagePreview, onRemove }: IPreviewImageProps) => {
  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');

  const handleClickOpen = (img: string) => {
    setSelectedImg(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImg('');
  };
  return (
    <>
      <ImageList sx={{ mb: 0 }} cols={imagePreview.length === 1 ? 1 : imagePreview.length === 2 ? 2 : 3}>
        {imagePreview.map((item, index) => (
          <ImageListItem key={index} onClick={() => handleClickOpen(item)}>
            <Box
              sx={{
                width: '100%',
                height: 300,
                position: 'relative', // BẮT BUỘC KHI DÙNG fill
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              {item && (
                <Image
                  src={item}
                  alt={`preview image ${index + 1}`}
                  loading="lazy"
                  fill
                  unoptimized
                  style={{
                    borderRadius: 8,
                    objectFit: 'cover',
                  }}
                />
              )}

              {onRemove && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // tránh trigger click mở ảnh
                    onRemove(index);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 3,
                    color: 'white',
                    background: 'rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      background: 'rgba(0, 0, 0, 0.5)',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          </ImageListItem>
        ))}
      </ImageList>
      <Dialog open={open} onClose={handleClose} maxWidth="xl">
        <DialogContent>
          <Box
            sx={{
              width: '50vw',
              height: '50vh',
              position: 'relative', // cần thiết khi dùng fill
            }}
          >
            {selectedImg && (
              <Image
                src={selectedImg}
                alt="Preview"
                loading="lazy"
                fill
                unoptimized
                style={{
                  objectFit: 'contain',
                  borderRadius: 8,
                }}
              />
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ImagePreview;

import useCreatePost from '@/libs/tanstack/post/useCreatePost';
import { TPost } from '@/libs/types/post.type';
import CloseIcon from '@mui/icons-material/Close';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ImageIcon from '@mui/icons-material/Image';
import { Box, Divider, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import BgColorSelector from './bg-color-selector';
import ImagePreview from './image-preview';
import useUpdatePost from '@/libs/tanstack/post/useUpdatePost';

interface ICreatePostModalProps {
  open: boolean;
  handleClose: () => void;
  initialValue: TPost | null;
}

const backgroundColors = [
  '#ffffff', // white (default)
  '#f0f2f5', // light gray
  '#e7f3ff', // light blue
  '#fff4e5', // light orange
  '#e8f4d9', // light green
  '#ffebee', // light red
  '#f3e5f5', // light purple
  '#fff8e1', // light yellow
];

const PostModel = ({ open, handleClose, initialValue }: ICreatePostModalProps) => {
  const [selectedBgColor, setSelectedBgColor] = useState(backgroundColors[0]);
  const [showBgColorSelector, setShowBgColorSelector] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imagesFile, setImagesFile] = useState<File[]>([]);

  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [content, setContent] = useState('');
  // use for update post
  const [mediaFiles, setMediaFiles] = useState<IMediaFile[]>([]);

  const createPostMutation = useCreatePost({ files: imagesFile, handleClose });
  const updatePostMutation = useUpdatePost({
    id: initialValue?._id ?? '',
    files: imagesFile,
    handleClose,
    mediaFiles,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImagesFile([...imagesFile, ...filesArray]);

      const newImagePreview = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreview([...imagePreview, ...newImagePreview]);
    }
  };

  const handleRemoveImg = (index: number) => {
    const newImagePreview = [...imagePreview];
    // clean blob url
    URL.revokeObjectURL(newImagePreview[index]);
    newImagePreview.splice(index, 1);
    setImagePreview(newImagePreview);

    const oldImageCount = mediaFiles.length;
    if (index >= oldImageCount) {
      const newImagesFile = [...imagesFile];
      const imageRemoveIndex = index - oldImageCount;
      newImagesFile.splice(imageRemoveIndex, 1);
      setImagesFile(newImagesFile);
    } else {
      const newImagesFile = [...imagesFile];
      newImagesFile.splice(index, 1);
      setImagesFile(newImagesFile);
    }

    if (initialValue) {
      const newMediaFiles = [...mediaFiles];
      newMediaFiles.splice(index, 1);
      setMediaFiles(newMediaFiles);
    }
  };

  const handleSubmit = () => {
    const DATA_SUBMIT = {
      content,
      backgroundColor: selectedBgColor,
    };

    if (initialValue) {
      updatePostMutation.mutate(DATA_SUBMIT);
    } else {
      createPostMutation.mutate(DATA_SUBMIT);
    }

    setSelectedBgColor(backgroundColors[0]);
    setShowBgColorSelector(false);
    setImagePreview([]);
    setContent('');
  };

  useEffect(() => {
    if (!open) {
      // Clean up preview images to prevent memory leak
      imagePreview.forEach((url) => URL.revokeObjectURL(url));

      setSelectedBgColor(backgroundColors[0]);
      setShowBgColorSelector(false);
      setImagePreview([]);
      setImagesFile([]);
      setContent('');
      setMediaFiles([]);
    }
  }, [open]);

  useEffect(() => {
    if (initialValue) {
      setSelectedBgColor(initialValue.backgroundColor);
      setImagePreview(initialValue.mediaFiles.map((item) => item.url));
      setContent(initialValue.content);
      setMediaFiles(initialValue.mediaFiles);
    } else {
      setSelectedBgColor(backgroundColors[0]);
      setImagePreview([]);
      setContent('');
      setMediaFiles([]);
      setImagesFile([]);
    }
  }, [initialValue]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2, textAlign: 'center', fontWeight: 'bold' }}>
        {initialValue ? 'Update Post' : 'Create Post'}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            bgcolor: (theme) => theme.palette.grey[200],
            '&:hover': {
              bgcolor: (theme) => theme.palette.grey[300],
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2 }}>
        <Box
          sx={{
            minHeight: '150px',
            backgroundColor: selectedBgColor,
            borderRadius: 1,
            p: 2,
            mb: 2,
          }}
        >
          <TextField
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            placeholder="What's on your mind?"
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: '1.2rem',
                backgroundColor: 'transparent',
              },
            }}
            sx={{ mb: 2 }}
          />
        </Box>

        {/* image preview */}
        {imagePreview.length > 0 && <ImagePreview imagePreview={imagePreview} onRemove={handleRemoveImg} />}

        {/* background color selector */}
        {showBgColorSelector && <BgColorSelector colors={backgroundColors} onSelect={setSelectedBgColor} selectedColor={selectedBgColor} />}

        <Box
          sx={{
            border: '1px solid #ddd',
            borderRadius: 2,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography>Add to your post</Typography>
          <Box>
            <input onChange={handleFileChange} ref={inputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} />
            <IconButton onClick={() => inputRef.current?.click()} color="primary" aria-label="Add image or video">
              <ImageIcon />
            </IconButton>
            <IconButton onClick={() => setShowBgColorSelector(!showBgColorSelector)} color="secondary" aria-label="Change background color">
              <FormatColorFillIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button
          disabled={!content}
          loading={createPostMutation.isPending || updatePostMutation.isPending}
          fullWidth
          onClick={handleSubmit}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          {initialValue ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default PostModel;

import { useAppDispatch, useAppSelector } from '@/libs/redux/hook';
import { updateUser } from '@/libs/redux/user/userSlice';
import useUpdateUser from '@/libs/tanstack/user/useUpdateUser';
import { Cancel, Edit, Save } from '@mui/icons-material';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const UserInfoSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

  const user = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();

  const updatedUserMutation = useUpdateUser();

  useEffect(() => {
    setName(user.name);
    setBio(user.bio || '');
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const res = await updatedUserMutation.mutateAsync({ id: user._id, data: { name, bio } });
    dispatch(updateUser({ name: res.data.name, bio: res.data.bio }));
    setIsEditing(false);
  };

  return (
    <>
      <Box sx={{ width: '100%', textAlign: 'center', mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          {isEditing ? (
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          ) : (
            <Typography variant="h4" fontWeight="bold">
              {name}
            </Typography>
          )}
        </Box>
        <Box>
          {isEditing ? (
            <TextField label="Bio" placeholder="Can be empty if you want" value={bio} onChange={(e) => setBio(e.target.value)} />
          ) : (
            <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
              {bio}
            </Typography>
          )}
        </Box>
      </Box>

      {isEditing ? (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Save />} sx={{ mb: 3 }} onClick={handleSave}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" startIcon={<Cancel />} sx={{ mb: 3 }} onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </Box>
      ) : (
        <Button variant="outlined" startIcon={<Edit />} sx={{ mb: 3 }} onClick={handleEdit}>
          Edit Profile
        </Button>
      )}
    </>
  );
};
export default UserInfoSection;

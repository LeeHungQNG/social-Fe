'use client';

import { useAppDispatch, useAppSelector } from '@/libs/redux/hook';
import { logout } from '@/libs/redux/user/userSlice';
import { Notifications, Search } from '@mui/icons-material';
import { AppBar, Badge, Box, Divider, IconButton, InputAdornment, Menu, MenuItem, TextField, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import dynamic from 'next/dynamic';
const CustomAvatar = dynamic(() => import('./custom-avatar'), { ssr: false });

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const router = useRouter();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    router.push('/profile');
    handleClose();
  };

  const handleLogout = () => {
    // clear data in localstorage and redux
    dispatch(logout());
    // redirect to login
    router.replace('/sign-in');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Social Media
        </Typography>
        <TextField
          placeholder="Search Friends"
          size="small"
          sx={{
            ml: 2,
            bgcolor: '#f0f2f5',
            borderRadius: 1,
            width: { xs: '100%', sm: 300 },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit">
          <Badge badgeContent={4} color="error">
            <Notifications />
          </Badge>
        </IconButton>
        <IconButton
          color="inherit"
          id="avatar-button"
          aria-controls={open ? 'avatar-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {/* <Avatar alt="User" src="/placeholder.svg?height=40&width=40" sx={{ width: 32, height: 32 }} /> */}
          <CustomAvatar avatarUrl={user.avatarUrl || ''} width={32} height={32} />
        </IconButton>
        <Menu
          id="avatar-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            list: {
              'aria-labelledby': 'avatar-button',
            },
          }}
        >
          <MenuItem onClick={handleProfile}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
              <CustomAvatar avatarUrl={user.avatarUrl || ''} width={28} height={28} />
              <Typography>{user.name}</Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
export default Header;

'use client';

import { useAppDispatch, useAppSelector } from '@/libs/redux/hook';
import { logout } from '@/libs/redux/user/userSlice';
import { Notifications, Search } from '@mui/icons-material';
import { AppBar, Badge, Box, Divider, IconButton, InputAdornment, Menu, MenuItem, TextField, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';

import dynamic from 'next/dynamic';
import useGetAllUser from '@/libs/tanstack/user/useGetAllUser';
const CustomAvatar = dynamic(() => import('./custom-avatar'), { ssr: false });

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const router = useRouter();

  // State
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  // Lấy danh sách user từ react-query
  const { data: allUsers } = useGetAllUser();
  const filteredUsers = allUsers.filter((user) => user.name.toLowerCase().includes(debouncedSearch.toLowerCase()));

  // Khi chọn user từ dropdown
  const handleSelectUser = (id: string) => {
    setSearchValue('');
    router.push(`/people?userId=${id}`);
  };

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

        {/* Search friend */}
        <Box sx={{ position: 'relative' }}>
          <TextField
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
          {debouncedSearch && filteredUsers.length > 0 && (
            <Box sx={{ position: 'absolute', top: '100%', left: '15px', right: 0, zIndex: 20, bgcolor: 'white', color: 'black', borderRadius: 1, boxShadow: 3 }}>
              {filteredUsers.map((user) => (
                <Box
                  key={user._id}
                  onClick={() => handleSelectUser(user._id)}
                  sx={{ p: 1, display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { bgcolor: '#f0f0f0' } }}
                >
                  <CustomAvatar avatarUrl={user.avatarUrl || ''} width={32} height={32} />
                  <Typography sx={{ ml: 1 }}>{user.name}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

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

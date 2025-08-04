'use client';
import theme from '@/app/theme';
import { Event, Home, Person, PersonAdd, Menu as MenuIcon } from '@mui/icons-material';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import MessageIcon from '@mui/icons-material/Message';
import PeopleIcon from '@mui/icons-material/People';
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, useMediaQuery } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const menuItems = [
  { text: 'Home', icon: <Home />, path: '/' },
  { text: 'Profile', icon: <Person />, path: '/profile' },
  { text: 'People', icon: <PeopleIcon />, path: '/people' },
  { text: 'Invitations', icon: <PersonAdd />, path: '/invitations' },
  { text: 'Friends', icon: <Diversity1Icon />, path: '/friends' },
  { text: 'Conversations', icon: <MessageIcon />, path: '/conversations' },
  { text: 'Events', icon: <Event />, path: '/events' },
];

const LeftSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isOpenDrawerMobile, setIsOpenDrawerMobile] = useState(false);

  const handleToggleDrawerMobile = () => {
    setIsOpenDrawerMobile(!isOpenDrawerMobile);
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => router.push(item.path)}>
              <ListItemIcon>
                {/* <Home color="primary" /> */}
                {React.cloneElement(item.icon, { color: pathname === item.path ? 'primary' : '' })}
                {/* {item.icon} */}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <>
      {isMobile && (
        <Toolbar sx={{ position: 'fixed', top: 0, left: -10, zIndex: 100000 }}>
          <IconButton onClick={handleToggleDrawerMobile} aria-label="open drawer" edge="start" sx={{ mr: 2, color: 'white' }}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      )}

      {/* Moblie */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            borderRight: 0,
            mt: 8,
          },
        }}
        open={isOpenDrawerMobile}
        onClick={handleToggleDrawerMobile}
      >
        {drawer}
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            borderRight: 0,
            mt: 8,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};
export default LeftSidebar;

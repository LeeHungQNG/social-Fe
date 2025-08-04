import { reactionObj } from '@/libs/constants/reaction.constant';
import useGetPostReactions from '@/libs/tanstack/reaction/useGetPostReactions';
import { TPost } from '@/libs/types/post.type';
import { TReactionType } from '@/libs/types/reaction.type';
import { Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { SyntheticEvent, useEffect, useState } from 'react';

interface IReactionModal {
  open: boolean;
  handleClose: () => void;
  // reactionsCount: Record<TReactionType, number>;
  post: TPost;
}

interface TabPanelProps {
  children?: React.ReactNode;
  current: TReactionType | 'all';
  value: TReactionType | 'all';
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, current, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== current} id={`simple-tabpanel-${current}`} aria-labelledby={`simple-tab-${current}`} {...other}>
      {value === current && <Box>{children}</Box>}
    </div>
  );
}

const ReactionModal = ({ open, handleClose, post }: IReactionModal) => {
  const [value, setValue] = useState<TReactionType | 'all'>('all');

  const handleChange = (event: SyntheticEvent, newType: TReactionType | 'all') => {
    setValue(newType);
  };

  const availableReaction = Object.entries(post.reactionsCount).filter(([_, count]) => count > 0) as [TReactionType, number][];

  // Khi post thay đổi, đảm bảo giá trị tab là hợp lệ
  useEffect(() => {
    const validTypes = availableReaction.map(([type]) => type);
    if (value !== 'all' && !validTypes.includes(value)) {
      setValue('all'); // reset nếu không còn hợp lệ
    }
  }, [post._id, availableReaction, value]);

  // React Query
  const { data: userReactions } = useGetPostReactions({ postId: post._id });

  return (
    <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={['all', ...availableReaction.map(([type]) => type)].includes(value) ? value : 'all'} onChange={handleChange} aria-label="basic tabs example">
            <Tab value={'all'} label={'All'} />;
            {availableReaction.map(([type]) => {
              return <Tab value={type} key={type} label={reactionObj[type]} />;
            })}
          </Tabs>
        </Box>
      </DialogTitle>
      <DialogContent>
        <CustomTabPanel value={'all'} current={value}>
          <MenuList>
            {userReactions.map((userReaction) => {
              return (
                <MenuItem key={userReaction._id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={userReaction.userAvatarUrl ?? ''}></Avatar>
                  <ListItemText>{userReaction.userName}</ListItemText>
                </MenuItem>
              );
            })}
          </MenuList>
        </CustomTabPanel>
        {availableReaction.map(([type]) => {
          return (
            <CustomTabPanel key={type} value={type} current={value}>
              {userReactions
                .filter((userReaction) => userReaction?.type === type)
                .map((user) => {
                  return (
                    <MenuItem key={user._id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={user.userAvatarUrl ?? ''}></Avatar>
                      <ListItemText>{user.userName}</ListItemText>
                    </MenuItem>
                  );
                })}
            </CustomTabPanel>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ReactionModal;

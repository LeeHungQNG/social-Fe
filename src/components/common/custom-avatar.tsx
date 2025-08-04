import { Avatar, useTheme } from '@mui/material';

interface ICustomAvatarProp {
  avatarUrl: string;
  width?: number;
  height?: number;
}

const CustomAvatar = ({ avatarUrl, width = 160, height = 160 }: ICustomAvatarProp) => {
  const theme = useTheme();
  return (
    <Avatar
      src={avatarUrl}
      alt={'avatar'}
      sx={{
        width,
        height,
        border: '4px solid white',
        boxShadow: theme.shadows[3],
      }}
    />
  );
};
export default CustomAvatar;

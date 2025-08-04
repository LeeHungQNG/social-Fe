import { IReactionUI, TReactionType } from '@/libs/types/reaction.type';
import { Box, Fade, Paper, Popper } from '@mui/material';

interface IReactionPopperProps {
  id: string | undefined;
  open: boolean;
  anchorEl: HTMLElement | null;
  reactions: IReactionUI[];
  onSelect: (reaction: TReactionType) => void;
}

const ReactionPopper = ({ id, open, anchorEl, reactions, onSelect }: IReactionPopperProps) => {
  return (
    <Popper id={id} open={open} anchorEl={anchorEl} placement="top-start" transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper sx={{ display: 'flex', p: 1 }}>
            {reactions.map((reaction) => (
              <Box
                key={reaction.name}
                onClick={() => onSelect(reaction.name)}
                sx={{
                  fontSize: '1.5rem',
                  p: 1,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'transparent',
                  transition: 'transform 0.2 ease',
                  '&:hover': {
                    transform: 'scale(1.25)',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                {reaction.emoji}
              </Box>
            ))}
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};
export default ReactionPopper;

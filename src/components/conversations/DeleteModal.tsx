import useDeleteConversation from '@/libs/tanstack/conversation/useDeleteConversation';
import useDeleteMessage from '@/libs/tanstack/message/useDeleteMessage';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface IDeleteModalProps {
  open: boolean;
  handleClose: () => void;
  messageId?: string;
  conversationId: string;
}

const DeleteModal = ({ open, handleClose, messageId, conversationId }: IDeleteModalProps) => {
  const deleteMessage = useDeleteMessage({ conversationId, handleClose });
  const deleteConversation = useDeleteConversation({ handleClose });
  const handleDelete = () => {
    if (messageId) {
      deleteMessage.mutate(messageId);
    } else {
      deleteConversation.mutate(conversationId);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{messageId ? 'Are you sure to delete this message?' : 'Are you sure to delete this conversation?'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">This action cannot be undo</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleDelete} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DeleteModal;

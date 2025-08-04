import Header from '@/components/common/header';
import LeftSidebar from '@/components/common/left-sidebar';
import RightSidebar from '@/components/common/right-sidebar';
import ProtectedPage from '@/components/guard/protected.guard';
import { Box } from '@mui/material';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ProtectedPage />
      <Box sx={{ display: 'flex', bgcolor: '#f0f2f5', minHeight: '100vh' }}>
        {/* App Bar */}
        <Header />

        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 480px)` },
            mt: 8,
          }}
        >
          {children}
        </Box>

        {/* Right Sidebar */}
        <RightSidebar />
      </Box>
    </>
  );
}

import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import Swal from 'sweetalert2';
// mocks_
import account from '../../../_mock/account';
import { logout } from '../../../store/reducers/auth/authenticationSlice';
// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

const successMsg = (message = '') =>
  Swal.fire({
    title: `Success`,
    text: `${message}`,
    icon: 'success',
    timer: 3500,
    timerProgressBar: true,
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
  });

const errorMsg = (message = '') =>
  Swal.fire({
    title: `Error`,
    text: `${message}`,
    icon: 'error',
    iconColor: 'white',
    timer: 3500,
    timerProgressBar: true,
    toast: true,
    position: 'bottom-end',
    background: 'red',
    color: 'white',
    showConfirmButton: false,
  });
// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const logoutHandler = () => {
    dispatch(logout());

    navigate('/login')

    successMsg("Logged Out Successfully");
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        {user ? (
          <Avatar src={user?.avatar?.url} alt="photoURL" />
        ) : (
          (
            <Avatar src={account.photoURL} alt="photoURL" />
          )
        )}
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        {user ? (
          <>
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle2" noWrap>
                {`${user.fname}  ${user.lname}`}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {user.email}
              </Typography>
            </Box>
            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack sx={{ p: 1 }}>
              {MENU_OPTIONS.map((option) => (
                <MenuItem key={option.label} onClick={handleClose}>
                  {option.label}
                </MenuItem>
              ))}
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <MenuItem onClick={logoutHandler} sx={{ m: 1 }}>
              Logout
            </MenuItem>
          </>
        )
          : ((
            <>
              <Divider  />

              <MenuItem component={Link} to ="/login" sx={{ m: 1}}>
                Login
              </MenuItem>
            </>
          ))
        }



      </Popover>
    </>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Swal from 'sweetalert2';
// components
import Iconify from '../../components/iconify';
import { login,clearErrors } from '../../store/reducers/auth/authenticationSlice';
// ----------------------------------------------------------------------


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


export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  
  
  const location = useLocation();
  const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : '' 

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && redirect === "shipping") {
      successMsg('Logged In');
      navigate(`/${redirect}`, { replace: true });
    } 
    if(isAuthenticated) navigate("/");

    if (error) {
      dispatch(clearErrors());
      errorMsg(error);
    }
  }, [dispatch, isAuthenticated, error, navigate, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    

    dispatch(login({email,password}));
  };

  return (
    <>
     <form onSubmit={submitHandler}>
      <Stack spacing={3}>
        <TextField name="email"
         label="Email address"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
        
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" disabled={loading}>
        Login
      </LoadingButton>
      </form>
    </>
  );
}
 
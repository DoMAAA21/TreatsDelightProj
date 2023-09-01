import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
// @mui
import {  Stack, IconButton, InputAdornment, TextField,FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Swal from 'sweetalert2';
// components
import Iconify from '../../components/iconify';
import { registerUser, clearErrors } from '../../store/reducers/auth/authenticationSlice';
// ----------------------------------------------------------------------



const validationSchema = Yup.object({
    fname: Yup.string().required('First name is required'),
    lname: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    course: Yup.string().required('Course is required'),
    religion: Yup.string().required('Religion is required'),
});

const initialValues = {
    fname: '',
    lname: '',
    email: '',
    password: '',
    role: '',
    course: '',
    religion: '',
};
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
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);


    const location = useLocation();
    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : ''

    const { isAuthenticated, error, loading } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    
        if (error) {
            errorMsg(error)
            dispatch(clearErrors());
        }
    
    }, [dispatch, isAuthenticated, error, navigate, redirect]);

    const submitHandler = (data) => {
        const userData = {
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            password: data.password,
            course: data.course,
            religion: data.religion,
        }
        dispatch(registerUser(userData ));
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={submitHandler}
            >
                {(formik) => (
                    <Form encType="multipart/form-data">
                        <Stack spacing={3}>
                            <TextField
                                label="First Name"
                                name="fname"
                                {...formik.getFieldProps('fname')}
                                error={formik.touched.fname && Boolean(formik.errors.fname)}
                                helperText={formik.touched.fname && formik.errors.fname}
                            />

                            <TextField
                                label="Last Name"
                                name="lname"
                                {...formik.getFieldProps('lname')}
                                error={formik.touched.lname && Boolean(formik.errors.lname)}
                                helperText={formik.touched.lname && formik.errors.lname}
                            />


                            <FormControl fullWidth variant="outlined" margin="normal" error={formik.touched.course && Boolean(formik.errors.course)}>
                                <InputLabel htmlFor="role">Course</InputLabel>
                                <Select
                                    label="Course"
                                    name="course"
                                    {...formik.getFieldProps('course')}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="BSIT">Bachelor of Science in Information Technology</MenuItem>
                                    <MenuItem value="CE">Bachelor of Science in Civil Engineering</MenuItem>
                                </Select>
                                {formik.touched.course && formik.errors.course && 
                                <div style={{ color: 'red', fontSize: '12px', marginLeft: '15px' }}>
                                    {formik.errors.course}
                                </div>}
                            </FormControl>

                            <FormControl fullWidth variant="outlined" margin="normal" error={formik.touched.religion && Boolean(formik.errors.religion)}>
                                <InputLabel htmlFor="role">Religion</InputLabel>
                                <Select
                                    label="Religion"
                                    name="religion"
                                    {...formik.getFieldProps('religion')}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="Catholic">Catholic</MenuItem>
                                    <MenuItem value="Muslim">Muslim</MenuItem>
                                    <MenuItem value="Iglesia Ni Cristo">Iglesia Ni Cristo</MenuItem>
                                </Select>
                                {formik.touched.religion && formik.errors.religion && 
                                <div style={{ color: 'red', fontSize: '12px', marginLeft: '15px' }}>
                                    {formik.errors.religion}
                                </div>}

                            </FormControl>






                            <TextField
                                label="Email"
                                name="email"
                                {...formik.getFieldProps('email')}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />

                            <TextField
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                {...formik.getFieldProps('password')}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
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
                        <Stack sx={{ my: 2 }} />
                        <LoadingButton fullWidth size="large" type="submit" variant="contained" disabled={!formik.isValid || loading}>
                            Sign Up
                        </LoadingButton>
                    </Form>
                )}
            </Formik>
        </>
    );
}

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Card, CardContent, Container } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import axios from 'axios';
import Compressor from 'compressorjs';
import { newUserReset, newUser } from '../../../store/reducers/auth/newUserSlice';
import defaultAvatar from '../../../components/assets/defaultavatar.png';

const validationSchema = Yup.object({
    fname: Yup.string().required('First Name is required'),
    lname: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    religion: Yup.string().required('Religion is required'),
    course: Yup.string().required('Course is required'),
    role: Yup.string().required('Role is required'),
});


const successMsg = (message = '') =>
    Swal.fire({
        title: `Success`,
        text: `${message}`,
        icon: 'success',
        timer: 3000,
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
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
    });

const AddUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, success } = useSelector(state => state.newUser);
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
    const [selectedRole, setSelectedRole] = useState('');
    const [storeDropdown, setStoreDropdown] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);

    const fetchStores = () => {
        axios.get(`${process.env.REACT_APP_API}/api/v1/stores`)
            .then((response) => {
                console.log(response.data.stores)
                const storeData = response.data.stores;
                const options = storeData.map((store) => ({
                    value: store._id,
                    label: store.name,
                }));
                setStoreDropdown(options);
                setLoadingOptions(true);
            })
            .catch((error) => {
                console.error('Error fetching store data:', error);
                setLoadingOptions(false);
            });
    }

    const initialValues = {
        fname: '',
        lname: '',
        email: '',
        password: '',
        role: '',
        course: '',
        religion: '',
    };

    useEffect(() => {
        fetchStores();
        if (error) {


            errorMsg(error)
            dispatch(newUserReset())

        }

        if (success) {

            navigate('/dashboard/users');
            dispatch(newUserReset())
            successMsg('User created successfully');

        }
    }, [dispatch, error, success, navigate])




    const onSubmit = (data) => {

        const userData = {
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            password: data.password,
            course: data.course,
            religion: data.religion,
            role: data.role,
            avatar
        };
        if (data.role === "Employee" && data.store) {
            const selectedStoreValue = data.store.split('-');
            const storeId = selectedStoreValue[0];
            const storeName = selectedStoreValue[1];
            userData.storeId = storeId;
            userData.storeName = storeName;
        }

        dispatch(newUser(userData));
    };



    const onChange = (e) => {
        if (e.target.name === "avatar") {
            const file = e.target.files[0];

            if (file) {
                new Compressor(file, {
                    quality: 0.6,
                    maxWidth: 800,
                    maxHeight: 800,
                    success(result) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            if (reader.readyState === 2) {
                                setAvatarPreview(reader.result);
                                setAvatar(reader.result)
                            }
                        };
                        reader.readAsDataURL(result);
                    },
                    error(err) {
                        console.error('Image compression error:', err);
                    },
                });
            }
        }
    };





    return (
        <Grid >
            <Card>
                <CardContent>
                    <div>
                        <h2>Add User</h2>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {(formik) => (
                                <Form encType="multipart/form-data">
                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="First Name"
                                        name="fname"
                                        variant="outlined"
                                        {...formik.getFieldProps('fname')}
                                        error={formik.touched.fname && Boolean(formik.errors.fname)}
                                        helperText={formik.touched.fname && formik.errors.fname}
                                    />

                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Last Name"
                                        name="lname"
                                        variant="outlined"
                                        {...formik.getFieldProps('lname')}
                                        error={formik.touched.lname && Boolean(formik.errors.lname)}
                                        helperText={formik.touched.lname && formik.errors.lname}
                                    />

                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Email"
                                        name="email"
                                        variant="outlined"
                                        {...formik.getFieldProps('email')}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                    />

                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Password"
                                        type="password"
                                        name="password"
                                        variant="outlined"
                                        {...formik.getFieldProps('password')}
                                        error={formik.touched.password && Boolean(formik.errors.password)}
                                        helperText={formik.touched.password && formik.errors.password}
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
                                            <MenuItem value="Staff">
                                                <em>Staff</em>
                                            </MenuItem>
                                            <MenuItem value="BSIT">Bachelor of Science in Information Technology</MenuItem>
                                            <MenuItem value="CE">Bachelor of Science in Civil Engineering</MenuItem>
                                        </Select>
                                        {formik.touched.course && formik.errors.course && <div>{formik.errors.course}</div>}
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
                                            <MenuItem value="Iglesia ni Cristo">Iglesia Ni Cristo</MenuItem>
                                        </Select>
                                        {formik.touched.religion && formik.errors.religion && <div>{formik.errors.religion}</div>}
                                    </FormControl>

                                    <FormControl fullWidth variant="outlined" margin="normal" error={formik.touched.role && Boolean(formik.errors.role)}>
                                        <InputLabel htmlFor="role">Role</InputLabel>
                                        <Select
                                            label="Role"
                                            name="role"
                                            {...formik.getFieldProps('role')}
                                            onChange={(e) => {
                                                setSelectedRole(e.target.value);
                                                formik.handleChange(e);
                                            }}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="Employee">Employee</MenuItem>
                                            <MenuItem value="User">User</MenuItem>
                                        </Select>
                                        {formik.touched.role && formik.errors.role && <div>{formik.errors.role}</div>}
                                    </FormControl>


                                    {selectedRole === 'Employee' && loadingOptions ? (
                                        <FormControl
                                            fullWidth
                                            variant="outlined"
                                            margin="normal"
                                            error={formik.touched.store && Boolean(formik.errors.store)}
                                        >
                                            <InputLabel htmlFor="store">Store</InputLabel>
                                            <Select
                                                label="Store"
                                                name="store"
                                                {...formik.getFieldProps('store')}
                                                required={selectedRole === 'Employee'}
                                            >

                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {storeDropdown.map((option) => (
                                                    <MenuItem key={option.value} value={`${option.value}-${option.label}`}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : null}


                                    <FormControl fullWidth variant="outlined" margin="normal">
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <figure className="avatar mr-3 item-rtl">
                                                    <img
                                                        src={avatarPreview}
                                                        className="rounded-circle"
                                                        alt="Avatar Preview"
                                                        width={200}
                                                        height={200}
                                                    />
                                                </figure>
                                            </div>
                                            <div className="custom-file">
                                                <input
                                                    type="file"
                                                    name="avatar"
                                                    className="custom-file-input"
                                                    id="avatar"
                                                    accept="image/*"
                                                    onChange={onChange}
                                                    required
                                                    style={{ display: 'none' }}
                                                />
                                            </div>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                htmlFor="avatar"
                                                color="primary"
                                            >
                                                Choose Avatar
                                            </Button>
                                        </div>
                                    </FormControl>



                                    <Button
                                        id="submitButton"
                                        name="submitButton"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={!formik.isValid || loading}
                                        style={{ marginTop: '20px', width: '100%', display: 'block', margin: '0 auto' }}
                                    >
                                        Submit
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default AddUser;

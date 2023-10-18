import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Card, CardContent } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import Compressor from 'compressorjs';
import { newStoreReset, newStore } from '../../../store/reducers/store/newStoreSlice';
import defaultAvatar from '../../../components/assets/defaultavatar.png';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    slogan: Yup.string().required('Slogan is required'),
    stall: Yup.number().min(1, 'Minimum of 1').max(99, 'Maximum of 99'),
    location: Yup.string().required('Location is required'),
    active: Yup.boolean().required('Active or Not'),
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

const AddStore = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, success } = useSelector(state => state.newStore);
    const [logo, setLogo] = useState("");

    const [logoPreview, setLogoPreview] = useState(
        defaultAvatar
    );

    const initialValues = {
        name: '',
        slogan: '',
        stall: '',
        location: '',
        active: '',
    };

    useEffect(() => {
        if (error) {


            errorMsg(error)
            dispatch(newStoreReset())

        }

        if (success) {

            navigate('/dashboard/stores');
            dispatch(newStoreReset())
            successMsg('Store created successfully');

        }
    }, [dispatch, error, success, navigate])




    const onSubmit = (data) => {
        console.log(data.active)
        const storeData = {
            name: data.name,
            slogan: data.slogan,
            stall: data.stall,
            location: data.location,
            active: data.active,
            logo
        }
        dispatch(newStore(storeData));
    };


    const onChange = (e) => {
        if (e.target.name === "logo") {
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
                                setLogoPreview(reader.result);
                                setLogo(reader.result)
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
                        <h2>Add Store</h2>
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
                                        label="Name"
                                        name="name"
                                        variant="outlined"
                                        {...formik.getFieldProps('name')}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                        helperText={formik.touched.name && formik.errors.name}
                                    />

                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Slogan"
                                        name="slogan"
                                        variant="outlined"
                                        {...formik.getFieldProps('slogan')}
                                        error={formik.touched.slogan && Boolean(formik.errors.slogan)}
                                        helperText={formik.touched.slogan && formik.errors.slogan}
                                    />

                                    <TextField
                                        fullWidth
                                        type="number"
                                        margin="normal"
                                        label="Stall"
                                        name="stall"
                                        variant="outlined"
                                        {...formik.getFieldProps('stall')}
                                        error={formik.touched.stall && Boolean(formik.errors.stall)}
                                        helperText={formik.touched.stall && formik.errors.stall}
                                    />

                                    <TextField
                                        fullWidth
                                        margin="normal"
                                        label="Location"
                                        name="location"
                                        variant="outlined"
                                        {...formik.getFieldProps('location')}
                                        error={formik.touched.location && Boolean(formik.errors.location)}
                                        helperText={formik.touched.location && formik.errors.location}
                                    />



                                    <FormControl fullWidth variant="outlined" margin="normal" error={formik.touched.active && Boolean(formik.errors.active)}>
                                        <InputLabel htmlFor="role">Is Active</InputLabel>
                                        <Select
                                            label="Active"
                                            name="active"
                                            {...formik.getFieldProps('active')}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value="true">True</MenuItem>
                                            <MenuItem value="false">False</MenuItem>
                                        </Select>
                                        {formik.touched.active && formik.errors.active && <div>{formik.errors.active}</div>}
                                    </FormControl>


                                    <FormControl fullWidth variant="outlined" margin="normal">
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <figure className="avatar mr-3 item-rtl">
                                                    <img
                                                        src={logoPreview}
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
                                                    name="logo"
                                                    className="custom-file-input"
                                                    id="logo"
                                                    accept="image/*"
                                                    onChange={onChange}
                                                    required
                                                    style={{ display: 'none' }} // Hide the default file input
                                                />
                                            </div>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                htmlFor="logo"
                                                color="primary"
                                            >
                                                Choose Logo
                                            </Button>
                                        </div>
                                    </FormControl>

                                    <Button
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

export default AddStore;

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Card, CardContent } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { getStoreDetails, storeUpdated } from '../../../store/reducers/store/storeDetailsSlice';
import { updateStore,clearErrors,updateStoreReset } from '../../../store/reducers/store/storeSlice';
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

const EditStore = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { store } = useSelector(state => state.storeDetails)
    const { error, isUpdated, loading } = useSelector(state => state.store);
    const [logo, setLogo] = useState("");

    const [logoPreview, setLogoPreview] = useState(
        defaultAvatar
    );

    const initialValues =  store ? {
        name: store.name || '',
        slogan: store.slogan || '',
        stall: store.stall || '',
        location: store.location || '',
        active: store.active === true ? "true" : "false" || '',
       
    } :{

        name: '',
        slogan: '',
        stall: '',
        location: '',
        active: '',

    };

    useEffect(() => {


        if (store && store._id !== id) {

            dispatch(getStoreDetails(id))

        }
        if (store && store.logo && store.logo.url) {
            setLogoPreview(store.logo.url);
        }

        if (error) {
            errorMsg(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            successMsg('Store updated successfully');
            navigate('/dashboard/stores');
            dispatch(updateStoreReset());
            dispatch(storeUpdated());
        }


    }, [dispatch, error, isUpdated, navigate, id, store])




    const onSubmit = (data) => {
        const storeData = {
            name: data.name,
            slogan: data.slogan,
            stall: data.stall,
            location: data.location,
            active: data.active,
            logo
        }
        dispatch(updateStore({ id: store._id, storeData }));
    };

    const onChange = (e) => {
        if (e.target.name === "logo") {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setLogoPreview(reader.result);
                    setLogo(reader.result);
                }
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <Grid >
            <Card>
                <CardContent>
                    <div>
                        <h2>Edit Store</h2>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                            enableReinitialize
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

export default EditStore;

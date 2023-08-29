import React, { Fragment, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import {  Button, Skeleton, Box,Typography, TableCell } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import MetaData from '../../layouts/metadata'
import { fetchAllStores } from '../../../store/reducers/store/allStoresSlice';
import { deleteStore, deleteStoreReset } from '../../../store/reducers/store/storeSlice';
import { SkeletonTableLoader } from '../../layouts/skeletonLoaders';

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

const StoresList = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, stores } = useSelector(state => state.allStores);
  const { isDeleted } = useSelector(state => state.store)

  useEffect(() => {
    dispatch(fetchAllStores());

    // if(error){

    // }

    if (isDeleted) {
      console.log('deleted')

      successMsg('Store deleted successfully');

      navigate('/dashboard/stores');

      dispatch(deleteStoreReset())
    }
  }, [dispatch, error, isDeleted, navigate])

  

console.log(stores)

  const deleteStoreHandler = (id) => {


    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteStore(id))
        Swal.fire(
          'Deleted!',
          'Store has been deleted.',
          'success'
        )
      }
    })



  }



  const setStores = () => {

    const data = {

      columns: [

        {
          label: 'Store ID',
          field: 'id',
          sort: 'asc',
          className: 'text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'
        },

        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
        },
        {
          label: 'Slogan',
          field: 'slogan',
          sort: 'asc',
        },
        {
          label: 'Stall',
          field: 'stall',
          sort: 'asc',
        },
        {
          label: 'Location',
          field: 'location',
          sort: 'asc',
        },

        {
          label: 'Active',
          field: 'active',
          sort: 'asc',
        },

        {
          label: 'Actions',
          field: 'actions',
        },

      ],

      rows: []

    }

    stores.forEach(store => {

      data.rows.push({
        id: store._id,
        name: store.name,
        slogan: store.slogan,
        stall: store.stall,
        location: store.location,
        active: store.active.toString(),
        actions: <>
        <Link to={`/dashboard/edit-store/${store._id}`} className="btn btn-primary py-1 px-2">
            <Icon icon="uil:edit" width={30} height={30} />
        </Link>
        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteStoreHandler(store._id)}>
            <Icon icon="ic:twotone-delete" width={30} height={30} />
        </button>

        </>

      })

    })

    return data;

  }



  return (

    <>
      <MetaData title={'All Stores'} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #b0cca9, #ffffff)',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <div>
          <h2>All Stores</h2>
        </div>
        <div>
          <Button
            variant="contained"
            component={Link}
            to="/dashboard/add-store"
            style={{
              marginLeft: '10px', // Add margin-left to separate the button
            }}
          >
            Add Store
          </Button>
        </div>
      </div>
      {loading ? (
        <SkeletonTableLoader />
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <MDBDataTable
            data={setStores()}
            className="table table-striped"
            striped
            hover
          />
        </div>
      )}
    </>




  )

}


export default StoresList


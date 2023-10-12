import React, { Fragment, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import { TextField, FormControl, Button, Grid, Card, CardContent, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { Icon } from '@iconify/react';
import MetaData from '../../layouts/metadata'
import { fetchAllUsers } from '../../../store/reducers/auth/allUsersSlice';
import { deleteUser, deleteUserReset } from '../../../store/reducers/auth/userSlice';
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

const UsersList = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, users } = useSelector(state => state.allUsers);
  const { isDeleted } = useSelector(state => state.user)

  useEffect(() => {
    // Dispatch the async action to fetch users when the component mounts
    dispatch(fetchAllUsers());

    if (isDeleted) {
      console.log('deleted')

      successMsg('User deleted successfully');

      navigate('/dashboard/users');

      dispatch(deleteUserReset())
    }
  }, [dispatch, error, isDeleted, navigate])



  const deleteUserHandler = (id) => {


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
        dispatch(deleteUser(id))
        Swal.fire(
          'Deleted!',
          'User has been deleted.',
          'success'
        )
      }
    })



  }



  const setUsers = () => {

    const data = {

      columns: [

        {
          label: 'User ID',
          field: 'id',
          sort: 'asc',
          className: 'text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'
        },

        {
          label: 'Surname',
          field: 'lname',
          sort: 'asc',
        },
        {
          label: 'First Name',
          field: 'fname',
          sort: 'asc',
        },
        {
          label: 'Course',
          field: 'course',
          sort: 'asc',
        },
        {
          label: 'Religion',
          field: 'religion',
          sort: 'asc',
        },

        {
          label: 'Email',
          field: 'email',
          sort: 'asc',
        },

        {
          label: 'Role',
          field: 'role',
          sort: 'asc',
        },

        {
          label: 'Actions',
          field: 'actions',

        },

      ],

      rows: []

    }

    users.forEach(user => {

      data.rows.push({
        id: user._id,
        fname: user.fname,
        lname: user.lname,
        course: user.course,
        religion: user.religion,
        email: user.email,
        role: user.role,

        actions: <>

          <Link to={`/dashboard/edit-user/${user._id}`} className="btn btn-primary py-1 px-2">

            <Icon icon="uil:edit" width={30} height={30} />


          </Link>

          <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteUserHandler(user._id)}>

            <Icon icon="ic:twotone-delete" width={30} height={30} />

          </button>

        </>

      })

    })

    return data;

  }



  return (

    <>
      <MetaData title={'All Users'} />

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
          <h2>All Users</h2>
        </div>
        <div>
          <Button
            variant="contained"
            component={Link}
            to="/dashboard/add-user"
            style={{
              marginLeft: '10px', // Add margin-left to separate the button
            }}
          >
            Add User
          </Button>
        </div>
      </div>
      {loading ? (
        <SkeletonTableLoader/>
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
            data={setUsers()}
            className="table table-striped"
            striped
            hover
          />
        </div>
      )}
    </>




  )

}



export default UsersList


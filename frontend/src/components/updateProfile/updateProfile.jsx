/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect, useContext } from 'react';
import styles from './updateProfile.module.css';
import axios from 'axios';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import profileBanner from '../../assets/profile-banner.jpeg';
import { UserContext } from '../../ctx/UserContextProvider';

const UpdateUser = () => {
  const { user, token, updateUser } = useContext(UserContext);
  const validateSchema = yup.object().shape({
    name: yup.string().min(3, 'Name should be a minimum of 3 characters').required('Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),

    dob: yup.date().max(new Date(), 'Date of birth cannot be in the future').required('Date of birth is required'),
    gender: yup.string().required('Gender is required'),
    address: yup.string().required('Address is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });
  const navigate = useNavigate();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateSchema),
  });

  const [loading, setLoading] = useState(false);

  // Set form field values using setValue
  useEffect(() => {
    if (user) {
      setValue('name', user.fullName);
      setValue('email', user.email);
      setValue('phoneNumber', user.phoneNumber);
      setValue('gender', user.gender);
      setValue('dob', user.dob);
      setValue('address', user.address);
    }
  }, [user, setValue]);

  const handleProfileUpdate = async (value) => {
    try {
      setLoading(true);
      const updatedUserData = {
        name: value.name,
        email: value.email,
        phoneNumber: value.phoneNumber,
        dob: value.dob,
        gender: value.gender,
        address: value.address,
        password: value.password,
      };

      const response = await axios.put(`/api/users/update/${user._id}`, updatedUserData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response?.data?.message);
      // Update the user data in local storage
      updateUser({
        _id: user._id,
        fullName: value.name,
        email: value.email,
        phoneNumber: value.phoneNumber,
        gender: value.gender,
        dob: value.dob,
        address: value.address,
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err?.response?.data?.message === 'unAuthorized') {
        navigate('/');
      } else if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error('An error occurred!');
      }
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.signupCard}>
          <form onSubmit={handleSubmit(handleProfileUpdate)}>
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="name">
                Name
              </label>
              <input className={styles.input} type="text" id="name" name="name" {...register('name')} />
              {errors && errors?.name ? <p className={styles.errorMessage}>{errors?.name?.message}</p> : ''}
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input className={styles.input} type="email" id="email" name="email" {...register('email')} readOnly />
              {errors && errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
            </div>
            {/* Phone Input */}
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="phoneNumber">
                Phone Number
              </label>
              <input className={styles.input} type="text" id="phoneNumber" name="phoneNumber" {...register('phoneNumber')} readOnly />
              {errors && errors.phoneNumber && <p className={styles.errorMessage}>{errors.phoneNumber.message}</p>}
            </div>
            {/* Gender Input */}
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="gender">
                Gender
              </label>
              <select className={styles.input} id="gender" name="gender" {...register('gender')}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors && errors.gender && <p className={styles.errorMessage}>{errors.gender.message}</p>}
            </div>
            {/* Date of Birth Input */}
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="dob">
                Date of Birth
              </label>
              <input className={styles.input} type="date" id="dob" name="dob" {...register('dob')} />
              {errors && errors.dob && <p className={styles.errorMessage}>{errors.dob.message}</p>}
            </div>
            {/* Address Input */}
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="address">
                Address
              </label>
              <input className={styles.input} type="text" id="address" name="address" {...register('address')} />
              {errors && errors.address && <p className={styles.errorMessage}>{errors.address.message}</p>}
            </div>
            {/* Password Input */}
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <input className={styles.input} type="password" id="password" name="password" {...register('password')} />
              {errors && errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
            </div>
            {/* Error message */}
            {/* {error && <p className={styles.error}>{error}</p>} */}
            <button className={styles.button} type="submit">
              {loading && <div className="loader"></div>}
              Update
            </button>
          </form>
        </div>

        <div className={styles.imageContainer}>
          <img className={styles.image} src={profileBanner} />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UpdateUser;

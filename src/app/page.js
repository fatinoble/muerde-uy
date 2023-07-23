'use client';
import React, { useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      router.push('/product/catalog');
    } else {
      router.push('/user/login');
    }
  }, []);

  return (
    <div>
      <div styles={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        <CircularProgress color="primary" size={60} thickness={5} />
      </div>
    </div >
  );
}

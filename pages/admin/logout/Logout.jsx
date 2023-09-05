import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        localStorage.clear();
        router.push('/admin/login')
    }, []);

    return null; 
}

export default Logout;
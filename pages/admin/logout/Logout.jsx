import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        localStorage.removeItem('token_login_admin');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_mail');
        router.push('/admin/login')
    }, []);

    return null; 
}

export default Logout;
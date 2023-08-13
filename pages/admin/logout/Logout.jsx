import { useRouter } from 'next/router';

const Logout = () => {
    const router = useRouter();

    localStorage.removeItem('token_login_admin');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_mail');
    router.push('/admin/login')
}

export default Logout;
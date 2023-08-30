import Cookies from 'js-cookie';

const getApiUrl = () => {
  const testEnv = Cookies.get('test');
  return testEnv ? process.env.NEXT_PUBLIC_API_BASE_URL_TEST : process.env.NEXT_PUBLIC_API_BASE_URL;
}

export { getApiUrl };
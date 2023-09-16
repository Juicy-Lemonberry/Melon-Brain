// From https://startbootstrap.com/snippets/registration-page

import config from '@/config';
import TopNavbar from '@/components/TopNavbar';
import LoginForm from '@/components/loginform/LoginForm';

import '@/styles/RegisterLoginForm.scss';

function LoginPage() {

    return (
        <body>
            <TopNavbar />
            <LoginForm endpointUrl={`${config.API_BASE_URL}/api/login`} />
        </body>
    );
}

export default LoginPage;
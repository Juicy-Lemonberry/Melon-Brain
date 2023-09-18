// From https://startbootstrap.com/snippets/registration-page

import config from '@/config';
import RegisterForm from '@/components/registerform/RegisterForm';
import TopNavbar from '@/components/TopNavbar';

import '@/styles/RegisterLoginForm.scss';

function RegisterPage() {

    return (
        <body>
            <TopNavbar />
            <RegisterForm endpointUrl={`${config.API_BASE_URL}/api/users/register`} />
        </body>
    );
}

export default RegisterPage;
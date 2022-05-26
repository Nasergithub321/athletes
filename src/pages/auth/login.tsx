import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React,{ useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { userService, alertService } from 'services';

import Auth, { Group } from 'components/Auth';
import Layout from 'Layouts';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onCheckbox = () => {
    // v will be true or false
  };    
  const router = useRouter();

  // form validation rules 
  const validationSchema = Yup.object().shape({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required')
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const {  formState } = useForm(formOptions);
  const { errors } = formState;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
 
    event.preventDefault();
    return userService.login(username, password)
    .then((res) => {
      console.log(res);
      if(res.status != 200)
        alertService.error(res.en_message);
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl || '/';
        router.push(returnUrl.toString());
    })
    .catch(alertService.error);
  };

  
  return (
    <Layout title="Login">
      <Auth title="Login" subTitle="Hello! Login with your email">
        <form onSubmit={onSubmit}>
          <InputGroup fullWidth>
            <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Email Address" />
            <div className="invalid-feedback">{errors.username?.message}</div>
          </InputGroup>
          <InputGroup fullWidth>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}  placeholder="Password" />
            <div className="invalid-feedback">{errors.password?.message}</div>
          </InputGroup>
          <Group>
            <Checkbox checked onChange={onCheckbox}>
              Remember me
            </Checkbox>
            <Link href="/auth/request-password">
              <a>Forgot Password?</a>
            </Link>
          </Group>
          <Button disabled={formState.isSubmitting} status="Success" type="submit" shape="SemiRound" fullWidth>
              {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
              Login
          </Button>
        </form>
        <p>
          Don&apos;t have account?{' '}
          <Link href="/auth/register">
            <a>Register</a>
          </Link>
        </p>
      </Auth>
    </Layout>
  );
}

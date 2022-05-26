import { Card, CardBody } from '@paljs/ui/Card';
import { InputGroup } from '@paljs/ui/Input';
import Select from '@paljs/ui/Select';
import Col from '@paljs/ui/Col';
import Row from '@paljs/ui/Row';
import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from 'Layouts';
import axios from "axios";
import Link from 'next/link';
import { userService, alertService } from 'services';
import { Button } from '@paljs/ui/Button';
import { useRouter } from 'next/router';

const StyledSelect = styled(Select)`
  margin-bottom: 10px;
`;
const Input = styled(InputGroup)`
  margin-bottom: 10px;
`;
const StyledLink = styled.a`
    background: #3366ff;
    color: white;
    text-decoration: none;
    padding: 6px 25px;
    border-radius: 5px;
    margin-left:auto;
    cursor:pointer;
`;
const StyledHeader = styled.header`
    display: flex;
    align-items: center;
`;

 function InputPage (){
  const [name, setname] = useState('');
  const [password, setpassword] = useState('');
  const [email, setemail] = useState('');
  const [phone, setphone] = useState('');
  const [mobile, setmobile] = useState('');
  const [city, setcity] = useState(1);
  const [address, setaddress] = useState('');
  const [username, setusername] = useState('');
  const router = useRouter();

    const options = [
      { value: '1', label: 'Dubai' },
      { value: '2', label: 'Abo Dhabi' },
      { value: '3', label: 'Al-Sharejah' },
      { value: '4', label: 'Al Ain' },
      { value: '5', label: 'Ras Al-Khiemah' },
      { value: '6', label: 'Fujairah' },
      { value: '7', label: 'Ajman' },
      { value: '8', label: 'Umm al-Quwain'}
    ];
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
   
      event.preventDefault();
      axios({
        method: 'post',
        headers : { 'Content-type': 'application/json' },
        url: '/api/clubs/add',
        data: {
              'token':userService.userValue.token,
              'name':name,
              'email':email,
              'password':password,
              'mobile':mobile,
              'phone':phone,
              'city':city,
              'username':username,
              'address':address,
              'role_id':2
          },
      }).then((results) => {
            if(results.status != 200)
               alertService.error(results.data.en_message);
            else{
                alertService.success('Added Succesfully !');
                
              router.push('/clubs/list');
            }
  
        })
        .catch((error) => {
          console.log(error)
        })
    };
    
  return (
    <Layout title="Input">
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
              <StyledHeader >
                 New Club
                <Link href="/clubs/add" >
                  <StyledLink >Home</StyledLink>
                </Link>
              </StyledHeader>
            <CardBody>
                <form onSubmit={onSubmit}>
                <Row>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                      <Input fullWidth size="Large">
                        <input value={name} onChange={(e) => setname(e.target.value)} type="text" placeholder="Name" name="name" />
                      </Input>
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                      <Input fullWidth size="Large">
                        <input value={email} onChange={(e) => setemail(e.target.value)} type="text" placeholder="Email" name="email" />
                      </Input>
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                      <Input fullWidth size="Large">
                        <input value={password} onChange={(e) => setpassword(e.target.value)} type="password" placeholder="Password" name="password" />
                      </Input>
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                      <Input fullWidth size="Large">
                        <input value={username} onChange={(e) => setusername(e.target.value)} type="text" placeholder="Username" name="username" />
                      </Input>
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                      <Input fullWidth size="Large">
                        <input value={mobile} onChange={(e) => setmobile(e.target.value)} type="text" placeholder="Mobile" name="mobile" />
                      </Input>
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                      <Input fullWidth size="Large">
                        <input value={phone} onChange={(e) => setphone(e.target.value)} type="text" placeholder="Phone" name="phone" />
                      </Input>
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                        <StyledSelect value={city} onChange={(e:any) => setcity(e.value)} size="Large" fullWidth name="city" placeholder="Select" options={options} />
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                      <Input fullWidth size="Large">
                          <textarea value={address} onChange={(e) => setaddress(e.target.value)} rows={5} placeholder="Address" name="address" />
                      </Input>
                    </Col>
                    <Button  status="Success" type="submit" shape="SemiRound" fullWidth>
                        Add
                    </Button>
                 </Row>
                </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};
export default InputPage;

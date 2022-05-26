import { Card, CardBody } from '@paljs/ui/Card';
import { InputGroup } from '@paljs/ui/Input';
import Select from '@paljs/ui/Select';
import Col from '@paljs/ui/Col';
import Row from '@paljs/ui/Row';
import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from 'Layouts';
import axios from "axios";
import { userService, alertService } from 'services';
import { Button } from '@paljs/ui/Button';
import { useRouter } from 'next/router';

const StyledSelect = styled(Select)`
  margin-bottom: 10px;
`;
const Input = styled(InputGroup)`
  margin-bottom: 10px;
`;
const StyledHeader = styled.header`
    display: flex;
    align-items: center;
`;

 function InputPage (){
  const [name, setname] = useState('');
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [email, setemail] = useState('');
  const [phone, setphone] = useState('');
  const [mobile, setmobile] = useState('');
  const [verified_sponsor, setverified_sponsor] = useState('');
  const [city, setcity] = useState(1);
  const [role_id, setrole_id] = useState(1);
  const [role_options, setrole_options] = useState([]);
  const [establishment_id, setestablishment_id] = useState(0);
  const [establishment_options, setestablishment_options] = useState([]);
  const [address, setaddress] = useState('');
  const [photo, setphoto] = useState('');
  const [showMe, setshowMe] = useState(false);
  const [Loaded, seLoaded] = useState(false);
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
    if(!Loaded)
    {
      axios({
        method: 'post',
        headers : { 'Content-type': 'application/json' },
        url: '/api/users/roles',
        data: {'token':userService.userValue.token},
      }).then((results) => {
          const tempData : Record<string, any>[][] = [];
  
          for (const row of results.data.data)
            tempData.push({value:row.id,label:row.name});
  
          setrole_options(tempData);
          seLoaded(true);
  
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
   
      event.preventDefault();
      axios({
        method: 'post',
        headers : { 'Content-type': 'application/json' },
        url: '/api/users/add',
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
              'role_id':role_id,
              'photo':photo
          },
      }).then((results) => {
            if(results.status != 200)
               alertService.error(results.en_message);
            else if(results.success == true){
                alertService.success('Added Succesfully !');
                
              router.push('/users/list');
            }
  
        })
        .catch((error) => {
          console.log(error)
        })
    };
    const showEstablishments = (value) => {
      setrole_id(value)
      if(value == 5)
      {
        setshowMe(true);
        axios({
          method: 'post',
          headers : { 'Content-type': 'application/json' },
          url: '/api/establishments/all',
          data: {'token':userService.userValue.token,'offset':0,'limit':10000},
        }).then((results) => {
            const tempData : Record<string, any>[][] = [];
    
            for (const row of results.data.data)
              tempData.push({value:row.id,label:row.en_name});
    
              setestablishment_options(tempData);
            seLoaded(true);
    
          })
          .catch((error) => {
            console.log(error)
          })
      }else
        setshowMe(false);
    }
  return (
    <Layout title="Input">
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
              <StyledHeader >
                 New User
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
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                        <StyledSelect value={city} size="Large" onChange={(e) => setcity(e.value)} fullWidth name="city" placeholder="Cities" options={options} />
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                        <StyledSelect value={role_id} size="Large" onChange={(e) => showEstablishments(e.value)} fullWidth name="role_id" placeholder="Types" options={role_options} />
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 12 }} style={{display: showMe?"block":"none"}}>
                        <StyledSelect value={establishment_id} size="Large" onChange={(e) => setestablishment_id(e.value)} fullWidth name="establishment_id" placeholder="Establishments" options={establishment_options} />
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                      <Input fullWidth size="Large">
                          <textarea value={address} onChange={(e) => setaddress(e.target.value)} rows={5} placeholder="Address" name="address" />
                      </Input>
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                      <Input fullWidth size="Large">
                        <input onChange={(e) => setphoto(e.target.value)} type="file" name="Image"  />
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

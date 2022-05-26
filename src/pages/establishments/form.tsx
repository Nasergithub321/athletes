import { Card, CardBody } from '@paljs/ui/Card';
import { InputGroup } from '@paljs/ui/Input';
import Select from '@paljs/ui/Select';
import Col from '@paljs/ui/Col';
import Row from '@paljs/ui/Row';
import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from 'Layouts';
import axios from "axios";
import Image from 'next/image';
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
const StyledImage = styled(Image)`
  max-width:100%;max-height:100px
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
  const [id, setid] = useState(0);
  const [clubs, setclubs] = useState([]);
  const [name, setname] = useState('');
  const [description, setdescription] = useState('');
  const [club_id, setclub_id] = useState('62');
  const [price_per_hour, setprice_per_hour] = useState('');
  const [Loaded, seLoaded] = useState(false);
  const router = useRouter();

  if(router.query.id !== undefined && id == 0)
  {
    var url = '/api/establishments/update';
    axios({
      method: 'post',
      headers : { 'Content-type': 'application/json' },
      url: '/api/establishments/getOne',
      data: {'token':userService.userValue.token,'id':router.query.id},
    }).then((results) => {
      
        if(results.data.data !== null){
          setid(results.data.data.id);
          setname(results.data.data.en_name);
          setdescription(results.data.data.ar_name);
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }else
    var url = '/api/establishments/updaaddte';
    
  if(!Loaded){
    axios({
      method: 'post',
      headers : { 'Content-type': 'application/json' },
      url: '/api/clubs/all',
      data: {'token':userService.userValue.token},
    }).then((results) => {
        const tempData : Record<string, any>[][] = [];

        for (const row of results.data.data)
          tempData.push({value:row.id,label:row.first_name});

          setclubs(tempData);
         seLoaded(true);

      })
      .catch((error) => {
        console.log(error)
      })
    }
    const options = [
      { value: '1', label: 'Abo Dhabi' },
      { value: '2', label: 'Dubai' },
      { value: '3', label: 'Al-Sharejah' },
      { value: '4', label: 'Ras Al-Khiemah' },
      { value: '5', label: 'Al Ain' },
      { value: '6', label: 'Fujairah' },
      { value: '7', label: 'Ajman' },
      { value: '8', label: 'Umm al-Quwain'}
    ];
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
   
      event.preventDefault();
      axios({
        method: 'post',
        headers : { 'Content-type': 'application/json' },
        url: '/api/establishments/add',
        data: {
              'token':userService.userValue.token,
              'en_name':name,
              'en_desciption':description,
              'club_id':club_id,
              'city_id':1,
              'price_per_hour':price_per_hour
          },
      }).then((results) => {
            if(results.status != 200)
               alertService.error(results.en_message);
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
                 New Establishment
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
                        <input value={price_per_hour} onChange={(e) => setprice_per_hour(e.target.value)} type="text" placeholder="price Per Hour" name="email" />
                      </Input>
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                        <StyledSelect value={club_id} size="Large" fullWidth name="club_id" placeholder="Select" options={clubs} />
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                      <Input fullWidth size="Large">
                          <textarea value={description} onChange={(e) => setdescription(e.target.value)} rows={5} placeholder="Descrition" name="descrition" />
                      </Input>
                    </Col>
                    <Button  status="Success" type="submit" shape="SemiRound" fullWidth>
                        Login
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

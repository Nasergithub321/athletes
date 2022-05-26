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
  const [en_name, seten_name] = useState('');
  const [ar_name, setar_name] = useState('');
  const [Loaded, seLoaded] = useState(false);
  const router = useRouter();

  if(router.query.id !== undefined && id == 0)
  {
    var url = '/api/currencies/update';
    axios({
      method: 'post',
      headers : { 'Content-type': 'application/json' },
      url: '/api/currencies/getOne',
      data: {'token':userService.userValue.token,'id':router.query.id},
    }).then((results) => {
      
        if(results.data.data !== null){
          setid(results.data.data.id);
          seten_name(results.data.data.en_name);
          setar_name(results.data.data.ar_name);
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }else
    var url = '/api/currencies/add';
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
   
      event.preventDefault();
      axios({
        method: 'post',
        headers : { 'Content-type': 'application/json' },
        url: url,
        data: {
              'token':userService.userValue.token,
              'id':id,
              'en_name':en_name,
              'ar_name':ar_name
          },
      }).then((results) => {
            if(results.status != 200)
               alertService.error(results.en_message);
            else{
                alertService.success('Added Succesfully !');
                
              router.push('/currencies/list');
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
                 New Currency
              </StyledHeader>
            <CardBody>
                <form onSubmit={onSubmit}>
                <Row>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                      <Input fullWidth size="Large">
                        <input value={en_name} onChange={(e) => seten_name(e.target.value)} type="text" placeholder="English Name" name="en_name" />
                      </Input>
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                      <Input fullWidth size="Large">
                        <input value={ar_name} onChange={(e) => setar_name(e.target.value)} type="text" placeholder="Arabic name" name="ar_name" />
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

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
  const [title, settitle] = useState('');
  const [body, setbody] = useState('');
  const [ar_title, setar_title] = useState('');
  const [ar_body, setar_body] = useState('');
  const [type, settype] = useState('');
  const [image, setimage] = useState('');
  const [reciever_id, setreciever_id] = useState(0);
  const [users, setusers] = useState([]);
  const [Loaded, seLoaded] = useState(false);
  const router = useRouter();

    const options = [
      { value: '1', label: 'AD' },
      { value: '2', label: 'Sponsor' },
      { value: '3', label: 'Active Booking' },
      { value: '4', label: 'Expired Booking' }
    ];
    if(!Loaded){
      axios({
        method: 'post',
        headers : { 'Content-type': 'application/json' },
        url: '/api/users/all',
        data: {'token':userService.userValue.token},
      }).then((results) => {
          const tempData : Record<string, any>[][] = [];
  
          for (const row of results.data.data)
              tempData.push({value:row.id,label:row.first_name});
  
          setusers(tempData);
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
        url: '/api/notifications/add',
        data: {
              'token':userService.userValue.token,
              'title':title,
              'body':body,
              'ar_title':ar_title,
              'ar_body':ar_body,
              'type':type,
              'image':image,
              'reciever_id':reciever_id
          },
      }).then((results) => {
            if(results.status != 200)
               alertService.error(results.en_message);
            else{
                alertService.success('Added Succesfully !');
                
              router.push('/notifications/list');
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
                 New Notification
              </StyledHeader>
            <CardBody>
                <form onSubmit={onSubmit}>
                <Row>
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                      <Input fullWidth size="Large">
                        <input value={title} onChange={(e) => settitle(e.target.value)} type="text" placeholder="Title" name="title" />
                      </Input>
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                      <Input fullWidth size="Large">
                        <input value={ar_title} onChange={(e) => setar_title(e.target.value)} type="text" placeholder="Arabic Title" name="ar_title" />
                      </Input>
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                        <StyledSelect value={type} onChange={(e) => settype(e.value)} size="Large" fullWidth name="type" placeholder="Type" options={options} />
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                        <StyledSelect value={reciever_id} onChange={(e) => setreciever_id(e.value)} size="Large" fullWidth name="reciever_id" placeholder="Reciever" options={users} />
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                      <Input fullWidth size="Large">
                        <textarea value={body} onChange={(e) => setbody(e.target.value)} placeholder="Body" name="body" ></textarea>
                      </Input>
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                      <Input fullWidth size="Large">
                        <textarea value={ar_body} onChange={(e) => setar_body(e.target.value)} placeholder="Arabic Body" name="ar_body" ></textarea>
                      </Input>
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                      <Input fullWidth size="Large">
                        <input value={image} onChange={(e) => setimage(e.target.value)} placeholder="Image" name="image" type="file" />
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

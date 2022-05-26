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
  const [user_id, setuser_id] = useState('');
  const [amount, setamount] = useState('');
  const [currency_id, setcurrency_id] = useState('');
  const [move_type, setmove_type] = useState('');
  const [description, setdescription] = useState('');
  const [balance_type, setbalance_type] = useState(1);
  const [hold, sethold] = useState('');
  const [users, setusers] = useState([]);
  const [currencies, setcurrencies] = useState([]);
  const [types, settypes] = useState([]);
  const [Loaded, seLoaded] = useState(false);
  const router = useRouter();

  const move_types = [
    { value: '1', label: 'Move into account' },
    { value: '2', label: 'Move from account' }
  ];
  const hold_options = [
    { value: '0', label: 'Not Hold' },
    { value: '1', label: 'Hold' }
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
      });
    axios({
      method: 'post',
      headers : { 'Content-type': 'application/json' },
      url: '/api/wallet/types',
      data: {'token':userService.userValue.token},
    }).then((results) => {
        const tempData : Record<string, any>[][] = [];

        for (const row of results.data.data)
            tempData.push({value:row.id,label:row.en_name});

        settypes(tempData);
        seLoaded(true);

      })
      .catch((error) => {
        console.log(error)
      })
    axios({
      method: 'post',
      headers : { 'Content-type': 'application/json' },
      url: '/api/currencies/all',
      data: {'token':userService.userValue.token},
    }).then((results) => {
        const tempData : Record<string, any>[][] = [];

        for (const row of results.data.data)
            tempData.push({value:row.id,label:row.en_name});

        setcurrencies(tempData);
        seLoaded(true);

      })
      .catch((error) => {
        console.log(error)
      })
  }
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
   
      event.preventDefault();
      const data ={
          'token':userService.userValue.token,
          "user_id":user_id,
          "move_in":0,
          "move_out":0,
          "currency_id":currency_id,
          "move_type":move_type,
          "description":description,
          "balance_type":balance_type,
          "hold":hold
        };
        if(parseInt(move_type) == 1)
          data.move_in = amount;
        else
          data.move_out = amount;
      axios({
        method: 'post',
        headers : { 'Content-type': 'application/json' },
        url: '/api/wallet/add',
        data: data,
      }).then((results) => {
            if(results.status != 200)
               alertService.error(results.en_message);
            else{
                alertService.success('Added Succesfully !');
                
              router.push('/wallet/list');
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
                 New Transaction
              </StyledHeader>
            <CardBody>
                <form onSubmit={onSubmit}>
                <Row>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                        <StyledSelect value={user_id} onChange={(e) => setuser_id(e.value)} size="Large" fullWidth name="user_id" placeholder="User" options={users} />
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                      <Input fullWidth size="Large">
                        <input value={amount} onChange={(e) => setamount(e.target.value)} type="text" placeholder="Amount" name="amount" />
                      </Input>
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                        <StyledSelect value={currency_id} onChange={(e) => setcurrency_id(e.value)} size="Large" fullWidth name="currency_id" placeholder="Currency" options={currencies} />
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                        <StyledSelect value={move_type} onChange={(e) => setmove_type(e.value)} size="Large" fullWidth name="move_type" placeholder="Move Type" options={move_types} />
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                        <StyledSelect value={balance_type} onChange={(e) => setbalance_type(e.value)} size="Large" fullWidth name="balance_type" placeholder="Balance Type" options={types} />
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 6 }}>
                        <StyledSelect value={hold} onChange={(e) => sethold(e.value)} size="Large" fullWidth name="hold" placeholder="Hold" options={hold_options} />
                    </Col>
                    <Col breakPoint={{ xs: 12, md: 12 }}>
                      <Input fullWidth size="Large">
                          <textarea value={description} onChange={(e) => setdescription(e.target.value)} rows={5} placeholder="Description" name="description" />
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

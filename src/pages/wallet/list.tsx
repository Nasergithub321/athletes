import { Card, CardBody } from '@paljs/ui/Card';
import Col from '@paljs/ui/Col';
import Row from '@paljs/ui/Row';
import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from 'Layouts';
import MUIDataTable from 'mui-datatables';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { userService,alertService } from 'services';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
  const [MUIdata, setMUIdata] = useState<string[][]>([['','Loading Data...']]);
  const [Loaded, seLoaded] = useState(false);

  if(!Loaded){
    axios({
      method: 'post',
      headers : { 'Content-type': 'application/json' },
      url: '/api/wallet/all',
      data: {'token':userService.userValue.token},
    }).then((results) => {
        const tempData : Record<string, any>[][] = [];

        for (const row of results.data.data)
          tempData.push([row.user.first_name,row,row.currency.en_name,row.description,row.type.en_name,row.hold,row.created_at,row.id]);

        setMUIdata(tempData);
        seLoaded(true);

      })
      .catch((error) => {
        console.log(error)
      })
  }

  const Delete = (e,id:any)=>{
    axios({
      method: 'post',
      headers : { 'Content-type': 'application/json' },
      url: '/api/wallet/delete',
      data: {'token':userService.userValue.token,'balance_id':id},
    }).then((results) => {
      alertService.error(results.data.en_message);
      window.location.reload()
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const columns = [
    {
      name: "User",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "Amount",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if(value.move_in == 0)
            return (<div style={{color:'red'}}>{value.move_out} Out</div>);
          else
          return (<div style={{color:'green'}}>{value.move_in} In</div>);
        },
      }
    },
    {
      name: "Currency",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "Description",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "Type",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "Hold",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if(value == 1)
            return (
              <div>Hold</div>
            );
          else
            return (
              <div>In Account</div>
            );
        },
      }
    },
    {
      name: "Created At",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "Options",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div>
                  <FontAwesomeIcon onClick={(e) => Delete(e,value)} icon={faTrash} size="lg" color="red"  cursor="pointer" className='fa-fw'/>
              </div>
            );
        },
      }
    }
   ];

  const MUIoptions = {
    filterType: "dropdown",
    responsive: "scroll"
  };
  const [checkbox, setCheckbox] = useState({
    1: false,
    2: false,
    3: false,
  });
  return (
    <Layout title="Input">
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
              <StyledHeader >
                 Input status
                <Link href="/wallet/add" >
                  <StyledLink >Add New</StyledLink>
                </Link>
              </StyledHeader>
            <CardBody>
              <MUIDataTable
                title={"ACME Employee list"}
                data={MUIdata}
                columns={columns}
                options={MUIoptions}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};
export default InputPage;

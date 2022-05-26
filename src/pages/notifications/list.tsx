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
      url: '/api/notifications/all',
      data: {'token':userService.userValue.token},
    }).then((results) => {
        const tempData : Record<string, any>[][] = [];

        for (const row of results.data.data)
          tempData.push([row.image,row.reciever.first_name,row.en_title,row.en_description,row.read,row.type_details.en_name,row.booking,row.id]);

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
      url: '/api/notifications/delete',
      data: {'token':userService.userValue.token,'notification_id':id},
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
      name: "Image",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if(value != '' && value !== null)
            return (
              <StyledImage src={value} width={'50'} height={'50'} />
            );
        },
      }
    },
    {
      name: "Reciever",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "Title",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "Descrription",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "Read",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if(value == 1)
            return (
              <div>Read</div>
            );
          else
            return (
              <div>Not Read</div>
            );
        },
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
      name: "Content",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if(value != null)
            return (
              <div>booking-{value.id}</div>
            );
        },
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
                <Link href={"/clubs/"+value} >
                  <FontAwesomeIcon icon={faPenToSquare} data-id={value} size="lg" color="green"  cursor="pointer" className='fa-fw'/>
                </Link>
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
                <Link href="/notifications/add" >
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

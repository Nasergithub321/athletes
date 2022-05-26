import { Card, CardBody } from '@paljs/ui/Card';
import Col from '@paljs/ui/Col';
import Row from '@paljs/ui/Row';
import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from 'Layouts';
import MUIDataTable from 'mui-datatables';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment,faBlog,faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
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
  const router = useRouter();
  const imgExtensions = ['png','jpg','jpeg','webp','svg','gif'];

  if(!Loaded)
  {
    axios({
      method: 'post',
      headers : { 'Content-type': 'application/json' },
      url: '/api/users/stories',
      data: {'token':userService.userValue.token,'user_id':router.query.id},
    }).then((results) => {
        const tempData : Record<string, any>[][] = [];

        for (const row of results.data.data)
          tempData.push([row.file,row.user.first_name,row.comment,row.file,row.created_at,row.id]);

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
      url: '/api/users/deleteStory',
      data: {'token':userService.userValue.token,'story_id':id},
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
          if(value != '' && value !== null){
            if(imgExtensions.includes(value.substring(value.lastIndexOf('.')+1,value.length)))
              return (
                <StyledImage src={value} width={'50'} height={'50'} />
              );
            else
              return (
                <video  loop style={{ width: '50px', height: '50px' }}>
                  <source src={value} />
                </video>
              );
          }
        },
      }
    },
    {
      name: "User",
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
      name: "Visible",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if(value != '' && value !== null){
            var current = new Date();
            current.setDate(current.getDate() - 1);
            var date = new Date(value);
            if(date > current)
              return (
                <div>Visible</div>
              );
            else
              return (
                <div>Hidden</div>
              );
          }
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
                  <FontAwesomeIcon onClick={(e) => Delete(e,value)} icon={faTrash} size="lg" color="red" title='Delete' cursor="pointer" className='fa-fw'/>
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
  return (
    <Layout title="Input">
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
              <StyledHeader >
                 Input status
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

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

  if(!Loaded)
  {
    axios({
      method: 'post',
      headers : { 'Content-type': 'application/json' },
      url: '/api/users/posts',
      data: {'token':userService.userValue.token,'user_id':router.query.id},
    }).then((results) => {
        const tempData : Record<string, any>[][] = [];

        for (const row of results.data.data)
          tempData.push([row.photo,row.user.first_name,row.description,row.likes.length,row.dislikes.length,row.created_at,row.id]);

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
      url: '/api/users/deletePost',
      data: {'token':userService.userValue.token,'post_id':id},
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
      name: "Likes",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div>
                {value}
              </div>
            );
        },
      }
    },
    {
      name: "Dislikes",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div>
                {value}
              </div>
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
                  <FontAwesomeIcon onClick={(e) => Delete(e,value)} icon={faTrash} size="lg" color="red" title='Delete' cursor="pointer" className='fa-fw'/>
                <Link href={"/users/comments?id="+value} >
                  <FontAwesomeIcon icon={faComment} data-id={value} size="lg" color="blue" title="Posts" cursor="pointer" className='fa-fw'/>
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

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
  const router = useRouter();

  if(!Loaded){
    if(router.query.id !== undefined)
      var url = '/api/sports/allBySport';
    else
      var url = '/api/sports/all';
    axios({
      method: 'post',
      headers : { 'Content-type': 'application/json' },
      url: url,
      data: {'token':userService.userValue.token,'id':router.query.id},
    }).then((results) => {
        const tempData : Record<string, any>[][] = [];

        for (const row of results.data.data)
          tempData.push([row.photo,row.en_name,row.parent_details,row.id]);

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
      url: '/api/sports/delete',
      data: {'token':userService.userValue.token,'category_id':id},
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
      name: "Name",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "Parent",
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          if(value != null)
            return value.en_name;
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
                <Link href="/sports/add" >
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

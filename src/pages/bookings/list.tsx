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
import Modal from 'components/Modal';

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
  const [ModalDetails, setModalDetails] = useState({amount: 0,card_type: '',completed: '',created_at: "",name: '',number: '',transaction_id: ''});
  const [showModal, setshowModal] = useState(false);

  if(!Loaded){
    axios({
      method: 'post',
      headers : { 'Content-type': 'application/json' },
      url: '/api/bookings/all',
      data: {'token':userService.userValue.token},
    }).then((results) => {
        const tempData : string[][] = [];

        for (const row of results.data.data)
          tempData.push([row.user.first_name,row.user.username,row.establishment.en_name,row.club.first_name,row.total_price,row.status_details.en_name,row.from_time,row.to_time,row.id,row.payment]);

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
      url: '/api/clubs/delete',
      data: {'token':userService.userValue.token,'club_id':id},
    }).then((results) => {
      alertService.error(results.data.en_message);
      window.location.reload()
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const ShowDetails = (e,id:any)=>{
    var results = {amount: 0,card_type: '',completed: '',created_at: "",name: '',number: '',transaction_id: ''}
    results = MUIdata.filter((row) => {
      return row[8] == id;
      // Use the toLowerCase() method to make it case-insensitive
    });
    setModalDetails(results[0][9]);
    setshowModal(true);
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
      name: "Username",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "Establishment",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "Club",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "Price",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "Status",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "From",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: "To",
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
                  <FontAwesomeIcon onClick={(e) => ShowDetails(e,value)} title="Payment Details" icon={faPenToSquare} data-id={value} size="lg" color="green"  cursor="pointer" className='fa-fw'/>
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
                <Link href="/clubs/add" >
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
          <Modal
          onClose={() => setshowModal(false)}
          show={showModal}
        >
          <h5 style={{marginTop:"10px",textAlign:"center",color:"#8f9bb3"}}>
            Booking Payment Details
          </h5>
            <Row style={{color:"black",margin:"0"}}>
              <Col breakPoint={{ xs: 12, md: 6 }} style={{padding:"20px 15px",borderBottom:"1px solid #3366ff"}}>
                <strong> Amount </strong>: {ModalDetails.amount}
              </Col>
              <Col breakPoint={{ xs: 12, md: 6 }} style={{padding:"20px 15px",borderBottom:"1px solid #3366ff"}}>
                <strong> Date </strong>: {ModalDetails.created_at}
              </Col>
              <Col breakPoint={{ xs: 12, md: 6 }} style={{padding:"20px 15px",borderBottom:"1px solid #3366ff"}}>
                <strong> Name </strong>: {ModalDetails.name}
              </Col>
              <Col breakPoint={{ xs: 12, md: 6 }} style={{padding:"20px 15px",borderBottom:"1px solid #3366ff"}}>
                <strong> Transaction </strong>: {ModalDetails.transaction_id}
              </Col>
              <Col breakPoint={{ xs: 12, md: 6 }} style={{padding:"20px 15px",borderBottom:"1px solid #3366ff"}}>
                <strong> Card Type </strong>: {ModalDetails.card_type}
              </Col>
              <Col breakPoint={{ xs: 12, md: 6 }} style={{padding:"20px 15px",borderBottom:"1px solid #3366ff"}}>
                <strong> Completed </strong>: {ModalDetails.completed}
              </Col>
            </Row>
        </Modal>
        </Col>
      </Row>
    </Layout>
  );
};
export default InputPage;

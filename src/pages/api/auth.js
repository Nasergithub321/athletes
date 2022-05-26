
import nc from "next-connect";
import cors from "cors";
import axios from "axios";
import {base_url} from 'constants/config';
import { fetchWrapper } from 'helpers';

export default async function handler(req, res) {

  try{
    return axios({
      method: 'post',
      headers : { 'Content-type': 'application/json' },
      url: base_url+'auth',
      data: {email: req.body.email,password: req.body.password},
    })
      .then((results) => {
        res.status(results.status).json(results.data)
      })
      .catch((error) => {
        res.status(error.status).json(error.response.data)
      })
   } catch (error) {
      console.error(error)
      return res.status(error.status || 500).end(error.message)
    }
}

import nc from "next-connect";
import cors from "cors";
import axios from "axios";
import {base_url} from 'constants/config';
import { userService } from 'services';

export default async function handler(req, res) {

  try{
    return axios({
      method: 'get',
      headers:{'Authorization': 'Bearer '+req.body.token},
      url: base_url+'Users/index?customorder=role_id asc,verified_sponsor desc, verified desc',
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
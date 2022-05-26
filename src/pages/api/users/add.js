
import nc from "next-connect";
import cors from "cors";
import axios from "axios";
import {base_url} from 'constants/config';
import { userService } from 'services';

export default async function handler(req, res) {

    return axios({
      method: 'post',
      headers:{'Authorization': 'Bearer '+req.body.token},
      url: base_url+'Users/Create',
      data: req.body,
    })
      .then((results) => {
        console.log(results)
        res.status(results.status).json(results.data)
      })
      .catch((error) => {
        console.log(error)
        console.log(req.body)
        res.status(error.status).json(error.response.data)
      })
}
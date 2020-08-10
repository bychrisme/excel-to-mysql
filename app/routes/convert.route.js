import express from 'express';
import convert from '../controllers/convert.controller';

const router = express.Router();

router.post("/convert", convert.index);

module.exports = router;
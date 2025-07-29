import express from 'express';
const router= express.Router();

import {getTransactionByUserId,
  createTransaction,
  deleteTransaction,
  getSummaryByUserId
} from "../controllers/transactionController.js"


router.get("/:userId",getTransactionByUserId);

router.post("/",createTransaction);

router.delete("/:id",deleteTransaction);

router.get("/summary/:userId",getSummaryByUserId);


export default router;

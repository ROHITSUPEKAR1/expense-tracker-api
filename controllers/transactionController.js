import { sql } from "../config/db.js";
import rateLimiter from "../middleware/ratelimiter.js"

 export async function getTransactionByUserId(req,res) {
    
  try {
    const { userId } = req.params;
    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error getting the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }

    
}

export async function createTransaction(req, res){
  const { success } = await rateLimiter.limit(req.ip);
  if (!success) {
    return res.status(429).json({ message: "Too many requests" });
  }

  try {
    const { title, amount, category, user_id } = req.body;
    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All Fields are required" });
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTransaction(req, res){
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid Transaction ID" });
    }

    const result = await sql`
      SELECT * FROM transactions WHERE id = ${id}
    `;
    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await sql`DELETE FROM transactions WHERE id = ${id}`;
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getSummaryByUserId (req, res) {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
    `;
    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income FROM transactions 
      WHERE user_id = ${userId} AND amount > 0
    `;
    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions 
      WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expenseResult[0].expenses
    });
  } catch (error) {
    console.log("Error getting the transaction summary", error);
    res.status(500).json({ message: "internal server error" });
  }
}
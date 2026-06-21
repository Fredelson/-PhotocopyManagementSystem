// ============================================
// ARAB UNITY SCHOOL
// Paper Purchase Controller
// ============================================

const { sql, poolPromise } = require("../config/db");

// GET /api/purchases
const getPurchases = async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT
        PurchaseId,
        PaperType,
        QuantityBoxes,
        TotalBundles,
        TotalSheets,
        PurchaseDate,
        CreatedAt
      FROM PaperPurchases
      ORDER BY PurchaseDate DESC, PurchaseId DESC
    `);

    res.json(result.recordset);
  } catch (error) {
    console.error("Get purchases error:", error);
    res.status(500).json({ message: "Server error while fetching purchases" });
  }
};

// POST /api/purchases
const addPurchase = async (req, res) => {
  const { paperType, quantityBoxes, purchaseDate } = req.body;

  if (!paperType || !quantityBoxes || !purchaseDate) {
    return res.status(400).json({
      message: "Paper type, quantity boxes, and purchase date are required",
    });
  }

  if (!["A4", "A3"].includes(paperType)) {
    return res.status(400).json({
      message: "Paper type must be A4 or A3",
    });
  }

  if (quantityBoxes <= 0) {
    return res.status(400).json({
      message: "Quantity boxes must be greater than 0",
    });
  }

  const transaction = new sql.Transaction(await poolPromise);

  try {
    await transaction.begin();

    const request = new sql.Request(transaction);

    const insertResult = await request
      .input("PaperType", sql.VarChar(10), paperType)
      .input("QuantityBoxes", sql.Int, quantityBoxes)
      .input("PurchaseDate", sql.Date, purchaseDate)
      .query(`
        INSERT INTO PaperPurchases (
          PaperType,
          QuantityBoxes,
          PurchaseDate
        )
        OUTPUT
          INSERTED.PurchaseId,
          INSERTED.PaperType,
          INSERTED.QuantityBoxes,
          INSERTED.TotalBundles,
          INSERTED.TotalSheets,
          INSERTED.PurchaseDate,
          INSERTED.CreatedAt
        VALUES (
          @PaperType,
          @QuantityBoxes,
          @PurchaseDate
        )
      `);

    const purchase = insertResult.recordset[0];

    await new sql.Request(transaction)
      .input("PaperType", sql.VarChar(10), paperType)
      .input("TotalSheets", sql.Int, purchase.TotalSheets)
      .query(`
        UPDATE PaperInventory
        SET
          CurrentStock = CurrentStock + @TotalSheets,
          LastUpdated = GETDATE()
        WHERE PaperType = @PaperType
      `);

    await transaction.commit();

    res.status(201).json({
      message: "Paper purchase added successfully",
      purchase,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Add purchase error:", error);
    res.status(500).json({ message: "Server error while adding purchase" });
  }
};

module.exports = {
  getPurchases,
  addPurchase,
};
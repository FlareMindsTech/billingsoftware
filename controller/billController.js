import mongoose from "mongoose";
import billSchema from "../models/bill.js"

function calculateItemsTotal(items) {
  return items.reduce((total, item) => {
    return total + (item.quantity * item.rate);
  }, 0);
}

export const CreateNewBill = async (req, res) => {
  try {
    let { customer_name, customer_mobile, customer_email, items, payment_status, payment_mode, remarks
      , invoice_number, gst_value
    } = req.body;
    try {
      const sub_total = calculateItemsTotal(items);

      const tax_amount = gst_value > 0 ? (sub_total * gst_value) / 100 : sub_total
      const total_amount = sub_total + tax_amount;
      let createBill = new billSchema({
        customer_name: customer_name,
        customer_mobile: customer_mobile,
        customer_email: customer_email,
        items: items,
        sub_total: sub_total,
        tax_amount: tax_amount,
        total_amount: total_amount,
        payment_status: payment_status,
        payment_mode: payment_mode,
        remarks: remarks,
        created_by: req.user._id,
        invoice_number: invoice_number,
        gst_value: gst_value,
        sgst: gst_value / 2,
        cgst: gst_value / 2
      });

      let newBill = await createBill.save();
      res.status(201).json({ message: `Bill created successfully`, data: newBill });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const updateBill = async (req, res) => {
  try {
    let { bill_id, ...rest } = req.body;

    // 1. Check bill exists
    console.log("Raw bill_id:", bill_id, typeof bill_id);
    const existBill = await billSchema.findOne({ _id: bill_id });
    console.log(existBill, 'ee')
    if (!existBill) {
      return res.status(400).json({ message: "Bill does not exist" });
    }

    // 2. Loop through body and update only defined keys
    for (let key in rest) {
      if (rest[key] !== undefined) {
        existBill[key] = rest[key];
      }
    }

    // 3. Recalculate if items or gst_value is present
    if (rest.items || rest.gst_value) {
      const items = rest.items || existBill.items;
      const gst = rest.gst_value ?? existBill.gst_value;

      const sub_total = calculateItemsTotal(items)
      const tax_amount = gst > 0 ? (sub_total * gst) / 100 : sub_total;
      const total_amount = sub_total + tax_amount;

      existBill.sub_total = sub_total;
      existBill.tax_amount = tax_amount;
      existBill.total_amount = total_amount;
      existBill.sgst = gst / 2;
      existBill.cgst = gst / 2
    }

    let updateBill = await existBill.save();
    if (!updateBill) {
      res.status(400).json({ message: "failed to update", error: updateBill });
    }
    res.status(200).json({ message: "Bill updated successfully", updatedBill: updateBill });




  }
  catch (error) {
    res.status(400).json({ message: error.message });

  }
}


export const listBill = async (req, res) => {
  try {
    const filter = {};

    for (let key in req.body) {
      if (req.body[key] !== undefined && req.body[key] !== "") {
        // Case-insensitive match for customer_name, email
        if (["customer_name", "customer_email"].includes(key)) {
          filter[key] = { $regex: req.body[key], $options: "i" };
        } else {
          filter[key] = req.body[key];
        }
      }
    }

    if (req.user.role !== 'Owner') {
      filter.created_by = req.user._id;
      filter.status = true;
    }


    const bills = await billSchema.find(filter).sort({ createdAt: -1 });
    if (!bills) {
      res.status(400).json({ message: "Failed to filter data", error: bills });
    }
    res.status(200).json({ data: bills });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const deleteBill = async (req, res) => {
  try {
    let { bill_id } = req.body;
    let exBill = await billSchema.findOne({ _id: bill_id });
    if (!exBill) {
      res.status(400).json({ message: "Bill not found" });
    }
    let deletebillData = await billSchema.updateOne(
      { _id: bill_id },
      { $set: { status: false } }
    );
    if (!deletebillData) {
      res.status(400).json({ message: "Bill deleted successfully" });
    }
    res.status(200).json({ data: deletebillData });
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}
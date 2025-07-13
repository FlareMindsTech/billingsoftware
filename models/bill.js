import mongoose from "mongoose";
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const itemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    rate: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 } // quantity * rate
});

const BillSchema = new mongoose.Schema(
    {
        s_no: {
            type: Number,
        },
        customer_name: {
            type: String,
            required: true,
            minlength: [3, "Name must be at least 3 characters long"]
        },
        customer_mobile: {
            type: String,
            required: true,
            match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"]
        },
        customer_email: {
            type: String,
            required: true,
            match: [/\S+@\S+\.\S+/, "Please enter a valid email address"]
        },
        items: {
            type: [itemSchema],
            required: true,
            validate: [arr => arr.length > 0, "At least one item is required"]
        },
        sub_total: {
            type: Number,
            required: true,
            min: 0
        },
        tax_amount: {
            type: Number,
            required: true,
            min: 0
        },
        total_amount: {
            type: Number,
            required: true,
            min: 0
        },
        payment_status: {
            type: String,
            required: true,
            enum: ["Paid", "Unpaid", "Partially Paid"]
        },
        payment_mode: {
            type: String,
            required: true,
            enum: ["Cash", "Card", "UPI", "Bank Transfer", "Other"]
        },
        paid_amount: {
            type: Number,
            default: 0
        },
        balance_amount: {
            type: Number,
            default: 0
        },
        remarks: {
            type: String
        },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        invoice_number: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            required: true,
            default: true
        },
        gst_value: {
            type: Number,
            required: true,
            default: 18 ,
            enum: [0, 5, 12, 18, 28]
        },
        sgst: {
            type: Number,
            default: 0
        },
        cgst: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

BillSchema.plugin(AutoIncrement, {
    inc_field: 's_no',
    id: 'bill_counter',
    start_seq: 1
});

export default mongoose.model("Bill", BillSchema);

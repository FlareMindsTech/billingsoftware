// generateInvoicePDF.js
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export const generateInvoicePDF = async (bill) => {
  const templatePath = path.resolve('./utils/invoiceTemplate.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  html = html
    .replace('{{customer_name}}', bill.customer_name)
    .replace('{{customer_address}}', bill.customer_address || '')
    .replace('{{date}}', new Date(bill.createdAt).toLocaleDateString('en-IN'))
    .replace('{{po_no}}', bill.po_no || '-')
    .replace('{{invoice_number}}', bill.invoice_number)
    .replace('{{vehicle_no}}', bill.vehicle_no || '-')
    .replace('{{total_amount}}', bill.total_amount)
    .replace('{{amount_in_words}}', bill.amount_in_words || '');

  const itemsHtml = bill.items.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.description}</td>
      <td>${item.quantity}</td>
      <td>${item.rate}</td>
      <td>${item.amount}</td>
    </tr>
  `).join('');

  html = html.replace('{{items_rows}}', itemsHtml);

  const outputDir = path.resolve('./invoices');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const timestamp = Date.now();
  const pdfPath = path.join(outputDir, `invoice_${bill.invoice_number}_${timestamp}.pdf`);

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({ path: pdfPath, format: 'A4' });
  await browser.close();

  return pdfPath;
};

import React from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateReceipt = async (orderId) => {
  try {
    // Fetch receipt data from API
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/receipt/${orderId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch receipt data');
    }

    const data = response.data.data;
    
    // Setup the PDF document - back to original size
    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 200] // Compact receipt size
    });

    // Set base font size
    doc.setFontSize(8);

    // Helper function to center text horizontally
    const centerText = (text, y) => {
      const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const x = (doc.internal.pageSize.getWidth() - textWidth) / 2;
      doc.text(text, x, y);
    };

    // Starting vertical position
    let yPos = 20;

    // Print restaurant header
    doc.setFontSize(12);
    centerText('Restaurant Name', yPos);
    doc.setFontSize(8);
    centerText('501 Crawford St', yPos + 5);
    centerText('Houston, TX 77002', yPos + 10);
    centerText('Phone: (713) 456-7890', yPos + 15);

    // Add divider after header
    yPos += 20;
    doc.line(10, yPos, 70, yPos);

    // Print order details
    yPos += 5;
    doc.text(`Order #: ${data.order_id}`, 10, yPos);
    yPos += 5;
    doc.text(`Date: ${format(new Date(data.time), 'MM/dd/yyyy hh:mm a')}`, 10, yPos);
    yPos += 5;
    doc.text(`Table #: ${data.table_number}`, 10, yPos);
    yPos += 5;
    doc.text(`Server: ${data.waiter_name}`, 10, yPos);

    // Add divider before items
    yPos += 5;
    doc.line(10, yPos, 70, yPos);

    // Print items header
    yPos += 5;
    doc.text('Item', 10, yPos);
    doc.text('Qty', 45, yPos);
    doc.text('Price', 60, yPos);

    // Print each item
    yPos += 5;
    data.items.forEach(item => {
      doc.text(item.name, 10, yPos);
      doc.text(item.quantity.toString(), 45, yPos);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 60, yPos);
      yPos += 4;
    });

    // Add divider before totals
    yPos += 2;
    doc.line(10, yPos, 70, yPos);
    yPos += 5;

    // Print price summary
    doc.text('Subtotal:', 40, yPos);
    doc.text(`$${data.subtotal}`, 60, yPos);
    yPos += 4;

    if (data.discount_amount > 0) {
      doc.text(`Discount (${data.discount_type}):`, 40, yPos);
      doc.text(`-$${data.discount_amount}`, 60, yPos);
      yPos += 4;
    }

    doc.text('Tax:', 40, yPos);
    doc.text(`$${data.tax_amount}`, 60, yPos);
    yPos += 4;

    doc.text(`Tip (${data.tip_percent}%):`, 40, yPos);
    doc.text(`$${data.tip_amount}`, 60, yPos);
    yPos += 6;

    // Print total
    doc.setFontSize(10);
    doc.text('Total:', 40, yPos);
    doc.text(`$${data.total}`, 60, yPos);
    yPos += 8;

    // Print loyalty points if customer exists
    if (data.customer_first_name) {
      doc.setFontSize(8);
      doc.text(`Points Earned: ${data.pointsEarned}`, 10, yPos);
      yPos += 4;
      doc.text(`Total Points: ${data.customer_points}`, 10, yPos);
      yPos += 6;
    }

    // Print thank you message
    doc.setFontSize(8);
    centerText('Thank you for dining with us!', yPos + 4);

    // Open PDF in new window
    const pdfOutput = doc.output('bloburl');
    window.open(pdfOutput, '_blank');

  } catch (err) {
    console.error('Error generating receipt:', err);
    alert('Error generating receipt');
  }
};

export default generateReceipt;
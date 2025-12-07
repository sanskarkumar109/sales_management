// backend/src/utils/dataLoader.js
const fs = require('fs');
const path = require('path');

const loadSalesData = () => {
  return new Promise((resolve, reject) => {
    const jsonPath = path.join(__dirname, '../../data/sales.json');

    if (!fs.existsSync(jsonPath)) {
      reject(new Error('JSON file not found. Please place sales.json in backend/data/'));
      return;
    }

    try {
      const rawData = fs.readFileSync(jsonPath, 'utf8');
      const salesData = JSON.parse(rawData);

      // Process and normalize the data
      const processedData = salesData.map(item => ({
        'Customer ID': item['Customer ID'] || item.customer_id || item.customerId,
        'Customer Name': item['Customer Name'] || item.customer_name || item.customerName,
        'Phone Number': item['Phone Number'] || item.phone_number || item.phoneNumber,
        'Gender': item['Gender'] || item.gender,
        'Age': parseInt(item['Age'] || item.age) || 0,
        'Customer Region': item['Customer Region'] || item.customer_region || item.region,
        'Customer Type': item['Customer Type'] || item.customer_type || item.customerType,
        'Product ID': item['Product ID'] || item.product_id || item.productId,
        'Product Name': item['Product Name'] || item.product_name || item.productName,
        'Brand': item['Brand'] || item.brand,
        'Product Category': item['Product Category'] || item.product_category || item.category,
        'Tags': item['Tags'] || item.tags,
        'Quantity': parseInt(item['Quantity'] || item.quantity) || 0,
        'Price per Unit': parseFloat(item['Price per Unit'] || item.price_per_unit || item.pricePerUnit) || 0,
        'Discount Percentage': parseFloat(item['Discount Percentage'] || item.discount_percentage || item.discountPercentage) || 0,
        'Total Amount': parseFloat(item['Total Amount'] || item.total_amount || item.totalAmount) || 0,
        'Final Amount': parseFloat(item['Final Amount'] || item.final_amount || item.finalAmount) || 0,
        'Date': item['Date'] || item.date,
        'Payment Method': item['Payment Method'] || item.payment_method || item.paymentMethod,
        'Order Status': item['Order Status'] || item.order_status || item.orderStatus,
        'Delivery Type': item['Delivery Type'] || item.delivery_type || item.deliveryType,
        'Store ID': item['Store ID'] || item.store_id || item.storeId,
        'Store Location': item['Store Location'] || item.store_location || item.storeLocation,
        'Salesperson ID': item['Salesperson ID'] || item.salesperson_id || item.salespersonId,
        'Employee Name': item['Employee Name'] || item.employee_name || item.employeeName
      }));

      console.log(`Loaded ${processedData.length} sales records from JSON`);
      resolve(processedData);
    } catch (error) {
      reject(new Error(`Failed to parse JSON file: ${error.message}`));
    }
  });
};

module.exports = {
  loadSalesData
};
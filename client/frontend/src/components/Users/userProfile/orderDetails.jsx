import React from "react";
import { jsPDF } from "jspdf";

const OrderDetails = ({ order, goBack }) => {
  const generateInvoice = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
  
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Invoice", pageWidth / 2, 20, { align: "center" });
  
    // Order Details
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Order Number: #${order.orderNumber}`, 20, 40);
    doc.text(`Status: ${order.status}`, 20, 50);
    doc.text(`Total Price: Rs ${order.totalPrice}`, 20, 60);
    doc.text(`Payment Status: ${order.paymentStatus}`, 20, 70);
    doc.text(`Date: ${new Date(order.createdAt).toDateString()}`, 20, 80);
  
    // Shipping Address
    doc.setFont("helvetica", "bold");
    doc.text("Shipping Address:", 20, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`, 20, 110);
    doc.text(`${order.shippingAddress.address}, ${order.shippingAddress.city}`, 20, 120);
    doc.text(`Postal Code: ${order.shippingAddress.postalCode}`, 20, 130);
    if (order.shippingAddress.country) {
      doc.text(`Country: ${order.shippingAddress.country}`, 20, 140);
    }
    doc.text(`Phone: ${order.shippingAddress.phone}`, 20, 150);
  
    // Table Headers
    let y = 170;
    doc.setFont("helvetica", "bold");
    doc.text("Ordered Items:", 20, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Item", 20, y);
    doc.text("Qty", 100, y);
    doc.text("Price", 140, y);
    doc.text("Total", 180, y);
    y += 10;
  
    doc.setFont("helvetica", "normal");
    doc.setLineWidth(0.5);
    doc.line(20, y, pageWidth - 20, y);
    y += 5;
  
    // Ordered Items Data
    order.orderItems.forEach((item) => {
      item.items.forEach((product) => {
        doc.text(product.product.name, 20, y);
        doc.text(`${product.qty}`, 100, y);
        doc.text(`Rs ${product.product.price}`, 140, y);
        doc.text(`Rs ${product.qty * product.product.price}`, 180, y);
        y += 10;
      });
    });
  
    // Footer
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Thank you for your purchase!", pageWidth / 2, y, { align: "center" });
  
    // Save PDF
    doc.save(`Invoice_${order.orderNumber}.pdf`);
  };
  return (
    <div className="p-6 bg-white rounded-lg text-white">
      <h2 className="text-3xl font-bold mb-4 text-center">Order Details</h2>
      
      <button 
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mb-4 transition duration-300 ease-in-out"
        onClick={goBack}
      >
        🔙 Back
      </button>
      {order.status === "delivered" && (
          <button 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 ml-2 rounded transition duration-300 ease-in-out"
           
         onClick={generateInvoice} >
            📄 Download Invoice
          </button>
        )}

      {/* Order Info & Shipping Address Side by Side */}
      <div className="border border-gray-300 p-4 rounded-lg bg-white text-gray-900 shadow-md flex justify-between items-start">
        {/* Order Details */}
        <div className="w-1/2">
          <h3 className="text-lg font-bold text-indigo-700">Order Number: #{order.orderNumber}</h3>
          <p className="text-gray-800 font-medium">📦 Status: <span className="text-blue-500">{order.status}</span></p>
          <p className="text-gray-800 font-medium">💰 Total Price: <span className="text-green-500">Rs {order.totalPrice}</span></p>
          <p className="text-gray-800 font-medium">💳 Payment Status: <span className="text-red-500">{order.paymentStatus}</span></p>
          <p className="text-gray-600">🗓 Date: {new Date(order.createdAt).toDateString()}</p>
        </div>

        {/* Shipping Address */}
        <div className="w-1/2 border-l-2 border-gray-300 pl-4">
          <h3 className="text-lg font-bold text-indigo-700">📍 Shipping Address</h3>
          <p className="text-gray-800 font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
          <p className="text-gray-800">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
          <p className="text-gray-800">📮 {order.shippingAddress.postalCode}</p>
          {order.shippingAddress.country && <p className="text-gray-800">🌍 {order.shippingAddress.country}</p>}
          <p className="text-gray-800">📞 {order.shippingAddress.phone}</p>
        </div>
      </div>

      <h3 className="mt-6 text-2xl font-semibold text-yellow-300">🛍 Ordered Items:</h3>
      
      {/* Ordered Items List */}
      <div className="mt-4 grid gap-4">
        {order.orderItems.map((item) =>
          item.items.map((product, idx) => (
            <div key={idx} className="flex items-center bg-orange-700 p-4 rounded-lg shadow-md transition transform hover:scale-105 duration-300 ease-in-out">
              <img
                src={product.product.images.length > 0 ? product.product.images[0] : "https://via.placeholder.com/100"}
                alt={product.product.name}
                className="w-16 h-16 rounded-full mr-4 border-2 border-white"
              />
              <div>
                <h4 className="text-lg font-bold text-white">{product.product.name}</h4>
                <p className="text-white">💰 Price: <span className="font-semibold">Rs {product.product.price}</span></p>
                <p className="text-white">🔢 Quantity: <span className="font-semibold">{product.qty}</span></p>
                <p className="text-white">🎨 Color: <span className="font-semibold">{product.color}</span></p>
                <p className="text-white">📏 Size: <span className="font-semibold">{product.size}</span></p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderDetails;

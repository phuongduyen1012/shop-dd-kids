import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderDetail, fetchCustomerById } from '../../api/post/post.api';

const ProductTable = () => {
  const { id } = useParams(); // Extract the order ID from the URL
  const [orderDetails, setOrderDetails] = useState(null);
  const [customer, setCustomer] = useState(null); // State to hold customer data
  const [, setError] = useState<string | null>(null); // State for error handling
  const [, setLoading] = useState(true);   // State for loading status

  // Fetch order details when the component mounts
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await getOrderDetail(id); // Call the API with the ID
        console.log('checccccccccccccccccck', response.data)
        setOrderDetails(response.data.data); // Set the fetched data to the state
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUserID = Number(JSON.parse(localStorage.getItem('tokens') ?? '{}').id);
        if (!currentUserID) {
          throw new Error('User ID not found');
        }

        const response = await fetchCustomerById(currentUserID);
        if (!response.data) {
          throw new Error('Invalid API response format');
        }

        setCustomer(response.data); // Set the customer data
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to fetch customer data'); // Handle errors
      } finally {
        setLoading(false); // Stop the loading state
      }
    };

    fetchData();
  }, []);
  const formatDateForDatetimeLocal = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `${(date.getMonth() + 1) < 10 ? '0' : ''}${date.getMonth() + 1}`;
    const day = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;
    const hours = `${date.getHours() < 10 ? '0' : ''}${date.getHours()}`;
    const minutes = `${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // Helper function to format prices
  const formatPrice = (price) => {
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
    const priceWithDot = formattedPrice.replace(/,([^,]*)$/, '.$1');
    return priceWithDot + ' VND';
  };

  if (!orderDetails) {
    return <p>Loading...</p>;
  }

  return (
<div className="container mx-auto p-4">
  <h2 className="text-lg font-bold mb-4 text-center">
    Thông tin chi tiết đơn hàng: {orderDetails.name}
  </h2>

  {customer && (
    <div className="mb-4">
      <h3 className="font-bold text-base md:text-lg">Thông tin khách hàng</h3>
      <p className="text-sm md:text-base">Tên: {customer.fullName}</p>
      <p className="text-sm md:text-base">Số điện thoại: {customer.phone}</p>
      <p className="text-sm md:text-base">Địa chỉ: {customer.address}</p>
      <p className="text-sm md:text-base">Hạng khách hàng: {customer.role}</p>
      <p className="text-sm md:text-base">
        Thời gian đặt hàng: {formatDateForDatetimeLocal(customer.createdAt)}
      </p>
    </div>
  )}

  <div className="overflow-x-auto">
    <table className="min-w-full bg-white">
      <thead>
        <tr className="w-full border-b">
          <th className="py-2 px-2 md:px-4 text-left text-sm md:text-base">Sản Phẩm</th>
          <th className="py-2 px-2 md:px-4 text-left text-sm md:text-base">Đơn Giá</th>
          <th className="py-2 px-2 md:px-4 text-left text-sm md:text-base">Số Lượng</th>
          <th className="py-2 px-2 md:px-4 text-left text-sm md:text-base">Số Tiền</th>
        </tr>
      </thead>
      <tbody>
        {orderDetails.OrderDetails.map((item) => (
          <tr key={item.ProductID} className="border-b">
            <td className="py-2 px-2 md:px-4">
              <div className="flex items-start">
                <img
                  alt={item.Product.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover mr-2 md:mr-4"
                  src={`../../../assets/images/uploads/product/${item.Product.locationPath}`}
                  width="100"
                  height="100"
                />
                <div>
                  <p className="text-sm md:text-base">{item.Product.name}</p>
                </div>
              </div>
            </td>
            <td className="py-2 px-2 md:px-4">
              <span className="text-red-500 text-sm md:text-base">{formatPrice(item.price)}</span>
            </td>
            <td className="py-2 px-2 md:px-4">
              <div className="flex items-center">
                <input
                  className="w-12 text-center border-t border-b text-sm md:text-base"
                  type="text"
                  value={item.quantity}
                  readOnly
                />
              </div>
            </td>
            <td className="py-2 px-2 md:px-4 text-red-500 text-sm md:text-base">
              {formatPrice(item.price * item.quantity)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="mt-4">
    <h3 className="font-bold text-sm md:text-base">
      Tổng Tiền:{" "}
      <span className="text-red-500 text-sm md:text-base">
        {formatPrice(orderDetails.Tota_amount)}
      </span>
    </h3>
    <p className="text-sm md:text-base">Trạng Thái Đơn Hàng: {orderDetails.order_status}</p>
    <p className="text-sm md:text-base">
      {orderDetails.payID === 1
        ? "Đơn hàng thanh toán bằng tiền mặt"
        : orderDetails.payID === 2
        ? "Đơn hàng của bạn đã thanh toán"
        : ""}
    </p>
  </div>
</div>

  );
};

export default ProductTable;

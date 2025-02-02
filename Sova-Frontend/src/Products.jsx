import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { load } from "@cashfreepayments/cashfree-js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantities, setQuantities] = useState(1);
  const [totalContribution, setTotalContribution] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  // Ref for the form element
  const formRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/products`);
        setProducts(response.data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
      }
    };

    loadProducts();
  }, []);

  // Close the form if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleQuantityChange = (delta) => {
    setQuantities((prevQuantity) => Math.max(1, prevQuantity + delta));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleClick = (event, product) => {
    event.preventDefault();
    setSelectedProduct(product);
    setQuantities(1); // Reset quantity to 1 for the selected product
    setShowForm(true); // Show the form when "Buy Now" is clicked
  };

  const calculateTotalPrice = (quantity, price) => {
    if (!price) return 0;

    const totalProductPrice = price * quantity;
    const gst = 0.18 * totalProductPrice;
    const deliveryCost =
      quantity <= 3 ? 100 : quantity <= 10 ? 250 : 500;

    const totalPrice = totalProductPrice + gst + deliveryCost;

    setTotalContribution(Math.floor(totalPrice));

    return totalPrice;
  };

  useEffect(() => {
    if (selectedProduct) {
      calculateTotalPrice(quantities, parseFloat(selectedProduct.price));
    }
  }, [selectedProduct, quantities]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, phone, email, address } = customerDetails;
    const quantity = quantities || 1;
    const totalAmount = calculateTotalPrice(quantity, parseFloat(selectedProduct.price));

    if (!name || !phone || !address || !email) {
      alert('Please fill all the details');
      return;
    }

    const orderId = `order_${Date.now()}`;
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/create-order`, {
        amount: totalAmount,
        orderId,
        customerId: "customer123", // You can replace this with an actual user ID
        customerPhone: phone,
        customerEmail: email
      });

      const cashfree = await load({ mode: "sandbox" });

      const checkoutOptions = {
        paymentSessionId: response.data.paymentSessionId,
        redirectTarget: "_modal",
      };

      cashfree.checkout(checkoutOptions);

      verifyPayment(orderId, name, phone, address, email, selectedProduct.name, totalAmount, quantity);
      setShowForm(false); // Close form after submission

    } catch (error) {
      console.error("Payment initialization failed", error);
    }
  };

  const verifyPayment = async (orderId, name, phone, address, email, productName, totalAmount, quantity) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/check-order-status`, { orderId });

      const paymentStatus = response.data.paymentStatus;
      if (paymentStatus === "SUCCESS") {
        alert("Payment Successful");

        const storeResponse = await axios.post(`${import.meta.env.VITE_BACKEND}/store-contribution`, {
          name,
          phone,
          address,
          email,
          productName,
          totalAmount,
          quantity
        });

        if (storeResponse.status === 200) {
          alert("Donation successfully recorded!");
        } else {
          alert("Failed to store donation data.");
        }
      } else {
        alert("Payment failed");
      }
    } catch (error) {
      console.error("Error verifying payment", error);
    }
  };

  return (
    <div className="web-products">
      <p className="web-heading">Our Products</p>
      <div id="product-wrapper" className="product-wrapper">
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="item-card">
              <img src={product.image} alt={product.name} loading="lazy" />
              <div className="card-info">
                <h3>{product.name}</h3>
                <div className="item-align">
                  <p><span className="detail">Length:</span>&nbsp;{product.length}</p>
                  <p><span className="detail">Features:</span>&nbsp;{product.features}</p>
                  <p><span className="detail">Description:</span>&nbsp;{product.description}</p>
                  <p><span className="detail">Price:</span>&nbsp;<strong>{product.price}</strong></p>
                </div>
                <button className="gift-btn" onClick={(e) => handleClick(e, product)}>Buy Now</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form for customer details */}
      {showForm && selectedProduct && (
        <div className="crazy-form-modal">
          <form ref={formRef} onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                id="name"
                name="name"
                value={customerDetails.name}
                onChange={handleFormChange}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                id="phone"
                name="phone"
                value={customerDetails.phone}
                onChange={handleFormChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                id="email"
                name="email"
                value={customerDetails.email}
                onChange={handleFormChange}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                id="address"
                name="address"
                value={customerDetails.address}
                onChange={handleFormChange}
              />
            </label>
            <p>Quantity:</p>

            {/* Quantity controls in the form */}
            <div className='quantity'>
            
            <button type="button" onClick={() => handleQuantityChange(-1)}>-</button>
            <span>{quantities}</span>
            <button type="button" onClick={() => handleQuantityChange(1)}>+</button>

            </div>
            

            <p>Total Amount: ₹{totalContribution.toFixed(2)}</p>
            <button type="submit">Proceed to Payment</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Products;
import { useState, useEffect } from 'react'
import axios from "axios"
import { load } from '@cashfreepayments/cashfree-js'
import './App.css';
import './Responisve.css'

function Payment() {
  const [cashfree, setCashfree] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState(1.00); // Set default amount  

  // Initialize Cashfree SDK
  useEffect(() => {
    const insitialzeSDK = async () => {
      const cf = await load({ mode: "sandbox" });
      setCashfree(cf);
    };

    insitialzeSDK();
  }, []);

  // Get payment session ID
  const getSessionId = async () => {
    try {
      const res = await axios.get("http://localhost:8000/payment", { params: { orderAmount: amount } });
      
      if (res.data && res.data.payment_session_id) {
        setOrderId(res.data.order_id);
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Verify Payment
  const verifyPayment = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/verify", { orderId });
      if (res && res.data) {
        alert("Payment verified");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Handle button click for payment
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const sessionId = await getSessionId();
      if (!sessionId) return;

      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      if (cashfree) {
        cashfree.checkout(checkoutOptions).then(async () => {
          console.log("Payment initialized");
           await verifyPayment();
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <h1>Cashfree Payment Gateway</h1>
      <div className="card">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          step="any"
          placeholder="Enter amount"
        />
        <button onClick={handleClick}>Pay Now</button>
      </div>
    </>
  )
}

export default Payment;
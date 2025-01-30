import { useEffect, useState } from "react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import "./App.css"; // Add your CSS styles
import "./Responisve.css"; // Add responsive styles

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [visibleRewards, setVisibleRewards] = useState({});
  const [formVisible, setFormVisible] = useState(false);
  const [donorTitle, setDonorTitle] = useState("");
  const [currentAmount, setCurrentAmount] = useState(0);
  const [totalContribution, setTotalContribution] = useState(0);
  const [originalAmount, setOriginalAmount] = useState(0); // Store original amount for increment/decrement logic
  const [cashfree, setCashfree] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
//   const [amount, setAmount] = useState(1.0);

  // Initialize Cashfree SDK
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const cf = await load({ mode: "production" }); // Ensure Cashfree SDK is loaded
        setCashfree(cf);
      } catch (error) {
        console.error("Failed to initialize Cashfree SDK:", error);
      }
    };
    initializeSDK();
  }, []);

  // Fetch payment session ID
  const getSessionId = async () => {
    try {
      const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        donorTitle: donorTitle,
        totalContribution: totalContribution,
      };
  
      const res = await axios.post(`${import.meta.env.VITE_BACKEND}/payment`, formData);
  
      if (res.data && res.data.payment_session_id) {
        setOrderId(res.data.order_id);
        return res.data.payment_session_id;
      } else {
        alert("Failed to retrieve payment session ID.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching session ID:", error);
      alert("Unable to start payment process. Please try again later.");
      return null;
    }
  };

  // Verify payment status
  const verifyPayment = async () => {
    try {
      console.log("Verifying payment...");
      const res = await axios.post(`${import.meta.env.VITE_BACKEND}/verify`, { orderId });

      if (res.data && res.data.payment_status === "SUCCESS") {
        alert("Payment verified successfully!");
      } else {
        alert("Payment verification failed or payment not completed.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Error occurred during payment verification. Please try again.");
    }
  };


  const validateReward = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND}/validate-reward`, {
        title: donorTitle,
        amount: totalContribution,
      });

      if (res.data && res.data.valid) {
        return true;
      } else {
        alert(res.data.message || "Invalid reward or amount.");
        return false;
      }
    } catch (error) {
      console.error("Reward validation failed:", error);
      alert("Error validating reward. Please try again.");
      return false;
    }
  };


  const validateForm = () => {
    const formFields = document.querySelectorAll('#userForm input, #userForm textarea');
    let allFieldsFilled = true;

    formFields.forEach(field => {
      if (!field.value) {
        allFieldsFilled = false;
        field.style.border = '2px solid red';
      } else {
        field.style.border = '';
      }
    });

    const phoneNumber = document.getElementById('phone').value;
    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(phoneNumber)) {
      allFieldsFilled = false;
      alert("Phone number must be exactly 10 digits and contain only numbers.");
      document.getElementById('phone').style.border = '2px solid red';
    }

    return allFieldsFilled;
  };


  // Handle payment initiation
  const handleClick = async (e) => {
    e.preventDefault();

    if (isProcessing) {
      alert("Payment is already in progress.");
      return;
    }

    if (!validateForm()) {
      alert("Please fill in all the details correctly.");
      return;
    }

    setIsProcessing(true);

    try {
      const isValidReward = await validateReward();
      if (!isValidReward) {
        setIsProcessing(false);
        return;
      }

      const sessionId = await getSessionId();
      if (!sessionId) {
        setIsProcessing(false);
        return;
      }

      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };


      const formData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        address: {
          street: document.getElementById("street").value,
          city: document.getElementById("city").value,
          state: document.getElementById("state").value,
          country: document.getElementById("country").value,
          zip: document.getElementById("zip").value,
        },
        email: document.getElementById("email").value,
        donorTitle: donorTitle,
        totalContribution: currentAmount,
        
      };
  
      // Send form data to the backend to store in Firebase
      await axios.post(`${import.meta.env.VITE_BACKEND}/store-contribution1`, formData);

      if (cashfree) {
        cashfree
            .checkout(checkoutOptions)
            .then(async (response) => {
                if (response.status === 200) {
                    console.log("Payment successful");
                    await verifyPayment();

                } else if (response.status === "canceled") {
                    alert("Payment canceled by user.");
                } else if (response.status === "FAILED") {
                    alert("Payment failed. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error during payment:", error);
                alert("An error occurred during the payment process.");
            });
    }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Fetch reward data from the backend
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND}/api/reward-content`)
      .then((response) => {
        setRewards(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reward data:", error);
      });
  }, []);

  // Toggle visibility of extra images for a specific reward
  const toggleVisibility = (index) => {
    setVisibleRewards((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle visibility for specific reward
    }));
  };

  // Open the donation form with reward details
  const handleOpenForm = (reward) => {
    setDonorTitle(reward.heading);
    setCurrentAmount(reward.price);
    setTotalContribution(reward.price);
    setOriginalAmount(reward.price);
    setFormVisible(true);
  };


  function useTypewriterEffect(text, speed = 100, resetDelay = 1000) {
    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText((prev) => prev + text[index]);
          setIndex((prev) => prev + 1);
        } else {
          setTimeout(() => {
            setDisplayText("");
            setIndex(0);
          }, resetDelay);
        }
      }, speed);
  
      return () => clearInterval(interval);
    }, [index]);
  
    return displayText;
  }

  // Decrease contribution amount
  const handleDecreaseAmount = () => {
    if (currentAmount > originalAmount) {
      const newAmount = currentAmount - originalAmount;
      setCurrentAmount(newAmount);
      setTotalContribution(newAmount);
    }
  };

  // Increase contribution amount
  const handleIncreaseAmount = () => {
    const newAmount = currentAmount + originalAmount;
    setCurrentAmount(newAmount);
    setTotalContribution(newAmount);
  };

  // Close the donation form
  const handleCloseForm = () => {
    setFormVisible(false);
  };

  // Handle clicks outside the form to close it
  const handleClickOutside = (event) => {
    if (
      formVisible &&
      !event.target.closest(".form-container") &&
      !event.target.classList.contains("donate-button")
    ) {
      setFormVisible(false);
    }
  };
  

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [formVisible]);

  const typewriterText = useTypewriterEffect("Become a part of this Mission");

  return (
    <section id="gift" className="rewards-section">
    <h2 className="rewards-title">{typewriterText}<span className="cursor">|</span></h2>
      

      <section className="certificate-section">
        <div className="certificate-card">
          <div className="certificate-description">
            <h3>Certificate of Appreciation</h3>
            <p>
              Every contributor is a hero in our mission to protect the hands
              that shape the world. To honor your generosity, we present this
              personalized Certificate of Appreciation along with some gifts as
              a token of gratitude for your invaluable contribution. Together,
              we are making a difference.
            </p>
            <div className="rewards-container">
              {rewards.length > 0 ? (
                rewards.map((reward, index) => (
                  <div key={index} className="reward-card">
                    <div className="reward-image">
                      <img
                        src={reward.mainrewardImage}
                        alt={reward.heading}
                        loading="lazy"
                      />
                    </div>
                    <div className="reward-content">
                      <h2
                        className={`r${index + 1}`}
                        style={{ color: "rgb(220, 86, 24)" }}
                      >
                        {reward.heading}
                      </h2>
                      <h3 className={`a${index + 1} hidden`}>
                        ₹{reward.price}
                      </h3>
                      <p>
                        <strong>This Package Includes:</strong>
                      </p>
                      <p>
                        {reward.mainrewardinfo} for you and {reward.contribution}
                      </p>
                      <button
                        className="donate-button"
                        onClick={() => handleOpenForm(reward)}
                      >
                        Contribute Now
                      </button>
                      <button
                        className="view-all-button"
                        onClick={() => toggleVisibility(index)}
                      >
                        {visibleRewards[index] ? "View Less" : "View All"}
                      </button>
                      {visibleRewards[index] && (
                        <div className="extra-images-card">
                          {reward.reward2img && (
                            <div className="image-card">
                              <img
                                src={reward.reward2img}
                                alt="Reward 2"
                                loading="lazy"
                              />
                              <p>{reward.reward2info}</p>
                            </div>
                          )}
                          {reward.reward3img && (
                            <div className="image-card">
                              <img
                                src={reward.reward3img}
                                alt="Reward 3"
                                loading="lazy"
                              />
                              <p>{reward.reward3info}</p>
                            </div>
                          )}
                          {reward.reward4img && (
                            <div className="image-card">
                              <img
                                src={reward.reward4img}
                                alt="Reward 4"
                                loading="lazy"
                              />
                              <p>{reward.reward4info}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No rewards available at the moment.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {formVisible && (
        <div id="formContainer" className="form-container">
          <button
            id="closeBtn"
            className="close-button"
            onClick={handleCloseForm}
          >
            ✖
          </button>
          <form id="userForm" className="form-content">
            <h2>Contributor Information</h2>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              required
            />
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              required
            />
            <label htmlFor="street">Street:</label>
        <input
          type="text"
          id="street"
          name="street"
          placeholder="Enter street address"
          required
        />

        <label htmlFor="city">City:</label>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="Enter your city"
          required
        />

        <label htmlFor="state">State:</label>
        <input
          type="text"
          id="state"
          name="state"
          placeholder="Enter your state"
          required
        />

        <label htmlFor="country">Country:</label>
        <input
          type="text"
          id="country"
          name="country"
          placeholder="Enter your country"
          required
        />

        <label htmlFor="zip">ZIP Code:</label>
        <input
          type="text"
          id="zip"
          name="zip"
          placeholder="Enter your ZIP code"
          required
        />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />
            <label htmlFor="title">Title</label>
            <div id="title" className="donortitle">
              {donorTitle}
            </div>
            <label htmlFor="amount">Contribution</label>
            <div className="amount-container">
              <button
                type="button"
                id="decreaseBtn"
                onClick={handleDecreaseAmount}
              >
                -
              </button>
              <h3 className="a8" id="amountDisplay">
                ₹{currentAmount}
              </h3>
              <button
                type="button"
                id="increaseBtn"
                onClick={handleIncreaseAmount}
              >
                +
              </button>
            </div>
            <button
              onClick={handleClick}
              style={{
                backgroundColor: "rgb(126, 73, 239)",
                fontFamily: "Poppins",
              }}
              type="submit"
              id="submitBtn"
            >
              Pay: ₹<span id="totalAmount">{totalContribution}</span>.00
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default Rewards;

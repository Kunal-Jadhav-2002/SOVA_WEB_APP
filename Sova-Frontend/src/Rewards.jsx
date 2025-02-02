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
  // const [showVerificationPopup, setShowVerificationPopup] = useState(false);
 
  const [orderId, setOrderId] = useState("");
//   const [amount, setAmount] = useState(1.0);

  
  




 
  

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


  

    const handleClick = async (event) => {

      event.preventDefault(); // Prevent form submission to allow for validation

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const address = document.getElementById("address").value.trim();
      const email = document.getElementById("email").value.trim();
  
      // Validate if all required fields are filled
      if (!name || !phone || !address || !email) {
          alert("All form details needs to be filled");
          return; // Stop execution if validation fails
      }

        const UorderId = `order_${Date.now()}`; // Unique order ID
        setOrderId[UorderId];
        const customerId = "customer123";
        const customerPhone = phone; // Replace with real data
        const customerEmail = email;

        
        try {
            // Create the order on the backend
            const response = await axios.post(`${import.meta.env.VITE_BACKEND}/create-order`, {
                amount:totalContribution,
                orderId: UorderId,
                customerId,
                customerPhone,
                customerEmail
                
            });

            // Initialize the Cashfree payment gateway
            const cashfree = await load({ mode: "sandbox" });

            const checkoutOptions = {
                paymentSessionId: response.data.paymentSessionId,
                redirectTarget: "_modal",
            };

            // Proceed to payment
            cashfree.checkout(checkoutOptions)

            // setShowVerificationPopup(true);

            // await verifyPayment();
            
            verifyPayment();
           
            handleCloseForm();
          
            
            
        } catch (error) {
            console.error("Payment initialization failed", error);
           
        }
    };


 
    const verifyPayment = async () => {
      try {
          // Call API to verify payment using Cashfree PGOrderFetchPayments
          const response = await axios.get(`${import.meta.env.VITE_BACKEND}/check-order-status`,{orderId : orderId});

          const paymentStatus = response.data.paymentStatus;
          if (paymentStatus === "SUCCESS") {
              
              alert("Payment Successful")

              const name = document.getElementById("name").value;
              const phone = document.getElementById("phone").value;
              const address = document.getElementById("address").value;
              const email = document.getElementById("email").value;
              const donorTitle = document.getElementById("title").textContent;
              const totalContribution = document.getElementById("totalAmount").textContent;

            // Validate form data
            if (!name || !phone || !address || !email || !donorTitle || !totalContribution) {
                alert("All fields are required!");
                return;
            }

            // Send data to backend
            const storeResponse = await axios.post(`${import.meta.env.VITE_BACKEND}/store-contribution`, {
                name,
                phone,
                address,
                email,
                donorTitle,
                totalContribution
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
            <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          name="address"
          placeholder="Enter Address"
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

      {/* {showVerificationPopup && (
        <div className="verification-popup">
          <div className="popup-content">
            <h3>Verifying Payment...</h3>
            <p>Please wait while we verify your transaction.</p>
          </div>
        </div>
      )} */}
    </section>
  );
};

export default Rewards;

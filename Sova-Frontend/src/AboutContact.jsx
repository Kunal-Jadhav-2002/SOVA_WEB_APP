import { useState } from 'react';
import axios from 'axios';

const AboutContact = () => {
  // State to hold form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create the form data object
    const formData = {
      name: name,
      email: email,
      message: message,
    };

    setLoading(true);
    setError('');

    // Send the form data to the server using Axios
    axios
      .post('http://localhost:8000/api/send-email', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        alert('Message sent successfully!');
        console.log(response.data);
        // Reset the form fields
        setName('');
        setEmail('');
        setMessage('');
      })
      .catch((error) => {
        setError('Failed to send the message. Please try again later.');
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section id="about" className="about-contact-us">
      <div className="about-container">
        <div className="about-left">
          <h2>About Us</h2>
          <p>We are a passionate team dedicated to providing the best quality gloves for your everyday tasks. Our mission is to ensure your hands are well-protected while making your life easier.</p>
          <div className="about-icons">
            <div className="icon">
              <i className="fas fa-heart"></i>
              <p>Passion</p>
            </div>
            <div className="icon">
              <i className="fas fa-users"></i>
              <p>Teamwork</p>
            </div>
            <div className="icon">
              <i className="fas fa-cogs"></i>
              <p>Innovation</p>
            </div>
          </div>
        </div>

        <div className="contact-right">
          <h2>Contact Us</h2>
          <p>If you have any questions or just want to reach out, we are here for you. Send us a message or follow us on our social media!</p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>

      <p>&copy; 2025 Sova Effortless Cleaning. All rights reserved.</p>

      <div className="social-media-links">
        <a href="https://www.facebook.com/profile.php?id=61572253852761" className="social-icon">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.youtube.com/channel/UCG8ytWI9Df6XBWDFiF_tfeA" className="social-icon">
          <i className="fab fa-youtube"></i>
        </a>
        <a href="https://www.instagram.com/sova_india?igsh=OXc4MWQ4cWdjazR3" className="social-icon">
          <i className="fab fa-instagram"></i>
        </a>
      </div>
    </section>
  );
};

export default AboutContact;
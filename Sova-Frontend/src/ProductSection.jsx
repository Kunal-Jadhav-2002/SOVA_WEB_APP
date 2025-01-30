import { useEffect, useState } from 'react';
import axios from 'axios';

const ProductSection = () => {
  const [features, setFeatures] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductFeatures = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/product-features'); // Replace with your actual API URL
        setFeatures(response.data); // Assumes the API returns an array of features
      } catch (err) {
        console.error('Error fetching product features:', err);
        setError('Failed to load product features');
      }
    };

    fetchProductFeatures();
  }, []);

  return (
    <section id="product" className="product">
      <div className="product-container">
        <h2>Why Sova Gloves ?</h2>
        <h3>Made in Bharat for Bharat.</h3>
        <div className="product-layout">
          <div className="features-left" id="features-left">
            {features.slice(0, 3).map((feature) => (
              <section key={feature.id} className="feature" id={feature.id}>
                <div className="feature-card">
                  <div className="video-wrapper">
                    {feature.video ? (
                      <video autoPlay loop muted>
                        <source src={feature.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img src={feature.image} alt={feature.title} />
                    )}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </section>
            ))}
          </div>
          <div className="product-image">
            <img
              className="product-img"
              src="images/daily shield.png"
              alt="Product Image"
            />
            <div className="product-placeholder"></div>
          </div>
          <div className="features-right" id="features-right">
            {features.slice(3).map((feature) => (
              <section key={feature.id} className="feature" id={feature.id}>
                <div className="feature-card">
                  <div className="video-wrapper">
                    {feature.video ? (
                      <video autoPlay loop muted>
                        <source src={feature.video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img src={feature.image} alt={feature.title} />
                    )}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
    </section>
  );
};

export default ProductSection;
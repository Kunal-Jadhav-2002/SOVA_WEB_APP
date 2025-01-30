import  { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products'); // Fetch product data
        setProducts(response.data); // Assuming the API returns an array of products
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="web-products">
      <p className="web-heading">Our Products</p>
      <div id="product-wrapper" className="product-wrapper">
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="item-card">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
              />
              <div className="card-info">
                <h3>{product.name}</h3>
                <div className="item-align">
                  <p>
                    <span className="detail">Length:</span>&nbsp;{product.length}
                  </p>
                  <p>
                    <span className="detail">Features:</span>&nbsp;{product.features}
                  </p>
                  <p>
                    <span className="detail">Description:</span>&nbsp;{product.description}
                  </p>
                  <p>
                    <span className="detail">Price:</span>&nbsp;<strong>{product.price}</strong>
                  </p>
                </div>
                <button className="gift-btn">Buy Now</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
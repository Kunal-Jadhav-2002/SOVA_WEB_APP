import { useState, useEffect } from 'react';
import axios from 'axios';

const DonorReviews = () => {
  const [donors, setDonors] = useState([]); // Store donors data
  const [currentIdx, setCurrentIdx] = useState(0); // Track current index
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  // Function to fetch the donor data
  const loadDonorReviews = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/donors');
      setDonors(response.data); // Set donors state with API response data
    } catch (error) {
      console.error('Error loading donor reviews:', error);
    }
  };

  // Fetch donor reviews on initial render
  useEffect(() => {
    loadDonorReviews();
  }, []);

  // Function to display filtered donors based on search
  const filteredDonors = donors.filter(donor =>
    donor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to display three donors at a time
  const displayDonors = () => {
    return filteredDonors.slice(currentIdx, currentIdx + 3).map(donor => (
      <div key={donor.id} className="donor-review">
        <div className="donor-photo">
          <img
            src="images/default-donor.jpg"
            alt={donor.name}
            loading="lazy"
          />
          <span className="donation-pin gold-pin"></span>
        </div>
        <div className="donor-details">
          <h3 className="donor-name">{donor.name}</h3>
          <p className="donation-amount">Donated: ₹{donor.totalContribution}</p>
          <p className="donor-review-text">{donor.donorTitle || 'Contributor'}</p>
        </div>
      </div>
    ));
  };

  // Navigate to the previous three donors
  const showPrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 3);
    }
  };

  // Navigate to the next three donors
  const showNext = () => {
    if (currentIdx + 3 < filteredDonors.length) {
      setCurrentIdx(currentIdx + 3);
    }
  };

  return (
    <div className="donor-reviews-section">
      <h2 className="section-title">Recent Contributors</h2>
      <input
        type="text"
        id="search-bar"
        placeholder="Search for your name..."
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        className="search-bar"
      />
      <div id="donor-reviews-container">
        {/* Display filtered donors */}
        {displayDonors()}
      </div>
      <div className="button-arrange">
        <button id="prev-btn" onClick={showPrevious} disabled={currentIdx === 0}>
          Previous
        </button>
        <button
          id="next-btn"
          onClick={showNext}
          disabled={currentIdx + 3 >= filteredDonors.length}
        >
          Next
        </button>
      </div>

      <p>
        If you are not able to see your name in the list, please refresh the page.
      </p>
    </div>
  );
};

export default DonorReviews;
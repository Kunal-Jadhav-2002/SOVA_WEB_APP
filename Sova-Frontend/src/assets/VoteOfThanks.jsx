

const VoteOfThanks = () => {
  return (
    <div>
      {/* Vote of Thanks Section */}
      <section className="vote-of-thanks">
        <div className="vote-header">
          <h2>Vote of Thanks</h2>
        </div>

       
      </section>

      {/* Customer Reviews Section */}
      <section className="customer-reviews-section">
        <div className="review-item2">
          
          <img src="images/default-donor.jpg" alt="Customer Photo" className="review-photo" />
          <div className="review-text">
            <h3 className="reviewer-name">Vilas Gaikwad</h3>
            <p className="review-comment">I have received the Sova gloves, and I am truly grateful. Working on the farm used to make my hands dry and rough, but now they stay protected. These gloves are very useful for farmers like us. A heartfelt thank you to all the donors!</p>
          </div>
        </div>

        <div className="review-item2">
          <img src="images/default-donor.jpg" alt="Customer Photo" className="review-photo" />
          <div className="review-text">
            <h3 className="reviewer-name">Suresh Kale</h3>
            <p className="review-comment">I work in the fields every day, and my hands used to suffer a lot. Now, with Sova gloves, they remain safe, and I also get protection from the cold. I sincerely thank everyone who supported this mission!</p>
          </div>
        </div>

        <div className="review-item2">
          <img src="images/default-donor.jpg" alt="Customer Photo" className="review-photo" />
          <div className="review-text">
            <h3 className="reviewer-name">Mahadev Pawar</h3>
            <p className="review-comment">I want to express my deep gratitude to the people who made it possible for me to receive these gloves. My hands now feel strong and protected, and working has become much easier. Because of kind people like you, farmers like us are getting the help we need. Thank you!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VoteOfThanks;
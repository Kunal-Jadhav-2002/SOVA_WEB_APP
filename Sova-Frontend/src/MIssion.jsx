import { useEffect, useState } from 'react';
import axios from 'axios';

const MissionSection = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/getVideos');
        setVideos(response.data.videos); // Assuming the API returns { videos: [...] }
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };

    fetchVideos();
  }, []); // Empty dependency array ensures it runs once on mount

  return (
    <section id="mission" className="mission">
      <div className="mission-card">
        <h2 id="mission-heading">Our Mission: Protecting the Hands That Shape Our Future</h2>
        <p id="mission-text">
          Every day, millions of unsung heroes—farmers, laborers, and workers—are on the front lines of life. Their hands,
          calloused and worn, are the driving force behind the crops we eat, the homes we live in, and the communities we thrive
          in. But these hands suffer in silence. They endure pain, injuries, and relentless toil without the protection they
          desperately need.
          <br />
          <br />
          At <strong>Sova</strong>, we don’t just make gloves. We create a lifeline. A lifeline for those whose hands bear the
          weight of the world. Our gloves are more than just tools—they are shields. Shields against harsh conditions, against
          injury, and against the strain of endless labor. We’re bringing a revolution in hand care, empowering those who build,
          grow, and create the world we live in.
          <br />
        </p>

        <section className="mission-images">
          <div className="mission-images-container">
          <img src="images/gloveuse1.jpeg" alt="Image 1" className="mission-image-card" />
          <img src="images/gloveuse2.jpeg" alt="Image 2" className="mission-image-card" />
          <img src="images/gloveuse3.jpeg" alt="Image 3" className="mission-image-card" />
          </div>
        </section>

        <p id='mission-text'> 
          <br />
          Imagine the power of gifting a pair of Sova gloves to someone who needs it. You’re not just giving gloves—you’re
          gifting protection, comfort, and dignity. Together, we can transform lives and ensure that every hand gets the care it
          deserves.
          <br />
          <br />
          Join us in this journey. Let’s make a stand for the hands that shape the future. Let’s protect them, empower them, and
          honor them with Sova gloves.
        </p>

        {/* Video Grid Section */}
        <div className="image-grid">
          {videos.map((video, index) => (
            <video
              key={index}
              id={`video${index + 1}`}
              className="mission-image"
              src={video}
              autoPlay
              loop
              muted
              preload="none"
            />
          ))}
        </div>

        <p className="Sources" id="sources">
          Sources:
        </p>
        <ul>
          <li>Silent Occupational Hazard: Carpal Tunnel Syndrome in Farmers - SIU School of Medicine</li>
          <li>Hand-arm vibration syndrome in laborers - National Center for Biotechnology Information</li>
          <li>The Importance of Ergonomics and Protective Gear for Farmers - Oregon State University Small Farms</li>
        </ul>
      </div>
    </section>
  );
};

export default MissionSection;
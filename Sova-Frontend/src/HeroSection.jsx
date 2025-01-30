import { useEffect, useState } from 'react';
import axios from 'axios';

const HeroSection = () => {
    const [heroContent, setHeroContent] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchHeroContent = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/hero-content'); // Use the full URL for the server endpoint
                setHeroContent(response.data);
            } catch (error) {
                console.error("Error fetching hero content:", error);
            }
        };

        fetchHeroContent();
    }, []);

    useEffect(() => {
        if (heroContent?.images?.length > 0) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroContent.images.length);
            }, 3000);

            return () => clearInterval(interval); // Cleanup interval on component unmount
        }
    }, [heroContent]);

    if (!heroContent) {
        return <p>Loading...</p>;
    }

    return (
        <div id="home" className="hero">
            <div className="hero-message">
                <p className="heading">{heroContent.heading}</p>
                <p className="author">{heroContent.author}</p>
                <p className="appeal">{heroContent.appeal}</p>
            </div>
            <div className="section2">
                <div className="content-container">
                    <div className="image-container">
                        <div className="image-carousel">
                            {heroContent.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Hero ${index + 1}`}
                                    style={{
                                        display: index === currentImageIndex ? 'block' : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="hero-description">
                        <p className="hero-heading">{heroContent.heroHeading}</p>
                        <p className="hero-info">{heroContent.heroInfo}</p>
                        <div className="video-container">
                            <video className="video" autoPlay loop muted>
                                <source src={heroContent.video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
import { useState } from 'react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "Why are Sova Gloves more than just gloves?",
      answer: "Sova Gloves are a revolution. They are designed to be a shield, offering not just protection but a sense of empowerment to the hands that shape our world—whether you’re a farmer, laborer, or homemaker. Sova Gloves protect your hands and dignify your work."
    },
    {
      question: "How can something as simple as gloves change lives?",
      answer: "Every day, millions of hardworking hands face pain, injury, and strain. Sova Gloves are designed to be the solution to this silent struggle. By offering comfort, protection, and durability, they ensure that these hands can continue their important work without fear of injury, making a tangible difference in lives."
    },
    {
      question: "Why should I trust Sova Gloves for my most demanding tasks?",
      answer: "Sova Gloves are not just about strength—they’re about care. Crafted for the toughest environments, they are built to endure harsh conditions like construction, farming, and dishwashing. Their durability and comfort make them the ultimate partner for your most challenging tasks. Feel the difference with every use!"
    },
    {
      question: "How can I be sure that Sova Gloves will last through the toughest days?",
      answer: "At Sova, we believe that quality is non-negotiable. Our gloves undergo rigorous testing to withstand the harshest conditions. Whether you’re lifting heavy materials, working in water, or facing abrasive surfaces, Sova Gloves will remain strong, durable, and reliable—every single day."
    },
    {
      question: "What does it mean to be part of the Sova mission?",
      answer: "Joining the Sova mission is more than just wearing gloves. It’s about supporting the hardworking hands that build, nurture, and create our world. It’s about showing that we care for the hands that often go unnoticed. By choosing Sova, you’re helping us create a movement of care and respect for the hands that matter the most."
    },
    {
      question: "How does Sova make me part of something bigger?",
      answer: "When you gift Sova Gloves, you’re not just protecting hands; you’re becoming a part of a global movement that empowers those who work tirelessly with their hands. You’re helping to change the narrative of care for hardworking individuals across the world. With Sova, you wear your purpose on their hands."
    }
  ];

  return (
    <section className="faq-section">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqItems.map((item, index) => (
          <div className="faq-item" key={index}>
            <div className="faq-question" onClick={() => toggleAnswer(index)}>
              <h3>{item.question}</h3>
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
            </div>
            <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
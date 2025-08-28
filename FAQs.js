import React, { useState } from 'react';

function FAQs() {
  const [activeId, setActiveId] = useState(null);

  const toggleAccordion = (id) => {
    setActiveId((prevId) => (prevId === id ? null : id));
  };

  const headingStyle = {
    fontWeight: '700',
    fontSize: '2.5rem',
    color: '#2c3e50',
    textAlign: 'center',
  };

  const faqs = [
    {
      id: 1,
      question: 'How do I buy a policy?',
      answer: 'You can browse available policies and purchase them after logging in.',
    },
    {
      id: 2,
      question: 'How do I file a claim?',
      answer: 'Go to your dashboard, select the policy, and click on "File a Claim".',
    },
    {
      id: 3,
      question: 'Can I cancel my policy?',
      answer: 'Yes, you can cancel your policy anytime from your account settings.',
    },
  ];

  return (
    <section className="py-5 bg-light">
      <style>
        {`
          .accordion-button:not(.collapsed) {
            background-color: #f8f9fa;
            color: #2c3e50;
            box-shadow: none;
            font-weight: 600;
          }

          .accordion-button:focus {
            box-shadow: none;
            border-color: transparent;
          }

          .accordion-item {
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 1rem;
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          }
        `}
      </style>

      <div className="container">
        <h2 className="mb-5" style={headingStyle}>Frequently Asked Questions</h2>
        <div className="accordion" id="faqAccordion">
          {faqs.map((faq) => (
            <div className="accordion-item" key={faq.id}>
              <h2 className="accordion-header" id={`faq${faq.id}`}>
                <button
                  className={`accordion-button ${activeId === faq.id ? '' : 'collapsed'}`}
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                >
                  {faq.question}
                </button>
              </h2>
              <div
                id={`collapse${faq.id}`}
                className={`accordion-collapse collapse ${activeId === faq.id ? 'show' : ''}`}
                aria-labelledby={`faq${faq.id}`}
              >
                <div className="accordion-body text-start">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQs;

import React from 'react';

function WhyChooseUs() {
  const headingStyle = {
    fontWeight: '700',
    fontSize: '2.5rem',
    color: '#2c3e50',
    textAlign: 'center',
  };

  const features = [
    {
      icon: 'bi-headset',
      title: '24/7 Support',
      description: "We're always here to help, anytime you need us.",
    },
    {
      icon: 'bi-people-fill',
      title: 'Trusted by Millions',
      description: 'Join a community of satisfied policyholders worldwide.',
    },
    {
      icon: 'bi-check2-circle',
      title: 'Easy Claims Process',
      description: 'Submit and track claims with just a few clicks.',
    },
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container text-center">
        <h2 className="mb-5" style={headingStyle}>Why Choose Us?</h2>
        <div className="row justify-content-center">
          {features.map((feature, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card h-100 border-0 shadow-sm p-4">
                <div className="mb-3">
                  <i className={`bi ${feature.icon} fs-1 text-primary`}></i>
                </div>
                <h5 className="fw-bold">{feature.title}</h5>
                <p className="text-muted">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;

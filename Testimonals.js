import React, { useEffect, useState } from "react";
import axios from "axios"; 

const headingStyle = {
  fontWeight: "700",
  fontSize: "2.5rem",
  color: "#2c3e50",
  textAlign: "center",
};

const cardStyle = {
  border: "none",
  borderRadius: "12px",
  backgroundColor: "#f8f9fa",
  transition: "transform 0.3s ease",
};

const quoteStyle = {
  fontStyle: "italic",
  color: "#34495e",
};

function Testimonials() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/feedback") 
      .then((res) => setFeedbacks(res.data))
      .catch((error) => console.error("Error fetching feedback:", error));
  }, []);

  const renderStars = (rating) => (
    <span className="text-warning fs-5">
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <h2 className="mb-5" style={headingStyle}>What Our Customers Say</h2>
        <div className="row justify-content-center">
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div
                  className="card shadow-sm h-100 p-4"
                  style={cardStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <blockquote className="blockquote mb-3" style={quoteStyle}>
                    <p>“{feedback.message}”</p>
                  </blockquote>
                  <footer className="blockquote-footer mb-2">
                    {feedback.name}, <cite>{feedback.email}</cite>
                  </footer>
                  {renderStars(feedback.rating)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No feedback available yet. Be the first to share your experience!</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;

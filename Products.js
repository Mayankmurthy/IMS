import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Products() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [policies, setPolicies] = useState({ auto: [], life: [] });

  useEffect(() => {
    axios.get("http://localhost:5000/api/home/storedpolicies")
      .then((res) => {
        const categorizedPolicies = { auto: [], life: [] };
        res.data.forEach(policy => {
          if (categorizedPolicies[policy.category]) {
            categorizedPolicies[policy.category].push({
              title: policy.policyName,
              desc: policy.policyDescription,
            });
          }
        });
        setPolicies(categorizedPolicies);
      })
      .catch(error => console.error("Error fetching policies:", error));
  }, []);

  const handleLearnMore = () => {
    if (isLoggedIn) {
      navigate("/policyform");
    } else {
      alert("Please sign in to view more details.");
      navigate("/signup");
    }
  };

  const renderCarousel = (id, slides) => (
    <div id={id} className="carousel slide shadow rounded" data-bs-ride="carousel">
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
            <div className="card h-100 border-0" style={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "#f8f9fa",
                minHeight: "220px",
                maxHeight: "220px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>
              <div className="card-body" style={{ flexGrow: 1 }}>
                <h5 className="card-title fw-bold">{slide.title}</h5>
                <p className="card-text text-muted" style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical"
                }}>{slide.desc}</p>
                <button onClick={handleLearnMore} className="btn btn-outline-primary mt-2">Learn More</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target={`#${id}`} data-bs-slide="prev">
        <span className="carousel-control-prev-icon" style={{ filter: "invert(1)" }} aria-hidden="true"></span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target={`#${id}`} data-bs-slide="next">
        <span className="carousel-control-next-icon" style={{ filter: "invert(1)" }} aria-hidden="true"></span>
      </button>
    </div>
  );

  return (
    <section className="py-5 bg-white">
      <div className="container">
        <h2 style={{ fontWeight: "700", fontSize: "2.5rem", color: "#2c3e50", textAlign: "center", marginBottom: "2rem" }}>
          Explore Our Insurance Options
        </h2>
        <div className="row text-center justify-content-center">
          <div className="col-md-6 mb-4">
            <h4 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#34495e", marginBottom: "1rem", marginTop: "1rem" }}>
              Auto Insurance
            </h4>
            {renderCarousel("autoCarousel", policies.auto)}
          </div>
          <div className="col-md-6 mb-4">
            <h4 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#34495e", marginBottom: "1rem", marginTop: "1rem" }}>
              Life Insurance
            </h4>
            {renderCarousel("lifeCarousel", policies.life)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Products;

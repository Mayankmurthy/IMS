import React, { useState, useEffect } from "react";
import { Card, Button, Carousel, Container, Row, Col, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import autoImage from "../../assets/autoinsurance.jpg";
import lifeImage from "../../assets/lifeinsurance.jpg";

export default function PolicyManagementModule({ isAdmin }) {
  const [autoPolicies, setAutoPolicies] = useState([]);
  const [lifePolicies, setLifePolicies] = useState([]);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const autoRes = await fetch("http://localhost:5000/api/policies?category=auto");
      const autoData = await autoRes.json();
      setAutoPolicies(autoData);
      console.log("Auto Policies:", autoData);

      const lifeRes = await fetch("http://localhost:5000/api/policies?category=life");
      const lifeData = await lifeRes.json();
      setLifePolicies(lifeData);
    } catch (error) {
      console.error("Error fetching policies:", error);
      alert("Failed to load policies. Please check the server.");
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [modalSource, setModalSource] = useState("");
  const [category, setCategory] = useState("auto");
  const [newPolicy, setNewPolicy] = useState({
    policyName: "",
    policyDescription: "",
    premium: "",
    policySpecs: "",
    customer: "",
    agent: "",
    validUntil: ""
  });
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [hovered1, setHovered1] = useState(false);
  const [hovered2, setHovered2] = useState(false);

  const openModal = (cat = null, source = "card") => {
    setModalSource(source);
    setEditingPolicy(null);
    setCategory(cat || "auto");
    setNewPolicy({ policyName: "", policyDescription: "", premium: "", policySpecs: "", customer: "", agent: "", validUntil: "" });
    setShowModal(true);
  };

  const openEditModal = (policy, source = "card") => {
    setEditingPolicy(policy);
    setCategory(policy.category);
    setNewPolicy({
      policyName: policy.policyName,
      policyDescription: policy.policyDescription,
      premium: policy.premium,
      policySpecs: policy.policySpecs.join(", "),
      customer: policy.customer || "",
      agent: policy.agent || "",
      validUntil: policy.validUntil ? new Date(policy.validUntil).toISOString().split("T")[0] : "",
    });
    setModalSource(source);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!newPolicy.policyName) {
      alert("Policy Name is required.");
      return;
    }
    if (!newPolicy.policyDescription) {
      alert("Policy Description is required.");
      return;
    }
    if (!newPolicy.premium) {
      alert("Premium is required.");
      return;
    }
    const processedSpecs = newPolicy.policySpecs.split(",").map((s) => s.trim()).filter(s => s !== '');
    if (processedSpecs.length === 0) {
      alert("Please enter at least one Policy Specification.");
      return;
    }
    if (!category) {
      alert("Policy category is missing. Please select 'Auto' or 'Life'.");
      return;
    }
    if (!newPolicy.validUntil) {
      alert("Please select a valid expiration date.");
      return;
    }

    const policyData = {
      policyName: newPolicy.policyName,
      policyDescription: newPolicy.policyDescription,
      premium: newPolicy.premium,
      policySpecs: processedSpecs,
      category: category,
      customer: newPolicy.customer || "--",
      agent: newPolicy.agent || "--",
      validUntil: newPolicy.validUntil,
    };

    console.log("Policy data being sent to backend:", policyData);

    try {
      let res;
      let message;

      if (editingPolicy) {
        res = await fetch(`http://localhost:5000/api/policies/${editingPolicy._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(policyData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to update policy due to unknown error.");
        }
        alert("Policy updated successfully!");
        message = `Policy "${policyData.policyName}" (ID: ${editingPolicy.displayId}) was updated in category "${category}"`;
      } else {
        res = await fetch("http://localhost:5000/api/policies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(policyData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to add policy due to unknown error.");
        }
        const addedPolicy = await res.json();
        alert("Policy added successfully!");
        message = `Policy "${policyData.policyName}" (ID: ${addedPolicy.displayId}) was added in category "${category}"`;
      }

      await fetch("http://localhost:5000/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });

      fetchPolicies();
      setShowModal(false);
      setEditingPolicy(null);
      setNewPolicy({ policyName: "", policyDescription: "", premium: "", policySpecs: "", customer: "", agent: "", validUntil: "" });
    } catch (error) {
      console.error("Error saving policy:", error);
      alert(`Error saving policy: ${error.message}`);
    }
  };

  const handleDeletePolicy = async (policyId, policyDisplayId) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete policy ${policyDisplayId}?`);
    if (confirmDelete) {
      let message = `Policy with Display ID ${policyDisplayId} was deleted`;
      try {
        const res = await fetch(`http://localhost:5000/api/policies/${policyId}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete policy");
        alert("Policy deleted successfully!");
        fetchPolicies();
      } catch (error) {
        console.error("Error deleting policy:", error);
        alert(`Error: ${error.message}`);
      }
      await fetch("http://localhost:5000/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });
    }
  };

  const handleCardClick = (policy, event) => {
    if (event.target.closest(".edit-button") || event.target.closest(".delete-button")) return;
    setSelectedPolicy(policy);
    setShowDetailsModal(true);
  };

  const handleBuyNow = async (item) => {
    const username = localStorage.getItem("authUser");
    const name = username ? JSON.parse(username).username : null;

    if (!name) {
      alert("Please sign in to purchase a policy.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/${name}/purchase-policy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyId: item._id }),
      });

      if (res.status === 409) {
        alert(`Policy "${item.policyName}" is already in your cart.`);
      } else if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to purchase policy");
      } else {
        alert(`Policy "${item.policyName}" purchased successfully by ${name}.`);
      }
    } catch (error) {
      console.error("Error purchasing policy:", error);
      alert(`Error purchasing policy: ${error.message}`);
    }
  };

  // --- START MODIFICATIONS HERE ---
  const renderCarousel = (items, term) => (
    <Carousel indicators={false} interval={null} controls={true}>
      {items.map((item) => (
        <Carousel.Item key={item._id}>
          <Card
            className="text-center shadow"
            style={{ position: "relative", cursor: "pointer", height: '450px' }} 
            onClick={(e) => handleCardClick(item, e)}
          >
            {isAdmin && (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  className="delete-button"
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    borderRadius: "65%",
                    padding: "5px",
                    zIndex: 2,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePolicy(item._id, item.displayId);
                  }}
                >
                  <i className="bi bi-x-circle"></i>
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  className="edit-button"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    borderRadius: "50%",
                    padding: "5px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                    zIndex: 2,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(item, "card");
                  }}
                >
                  Edit
                </Button>
              </>
            )}

            <Card.Img variant="top" src={term === "auto" ? autoImage : lifeImage} alt="Policy Image" style={{ height: '200px', objectFit: 'cover' }} />

            <Card.Body style={{
                minHeight: '150px', 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingBottom: '10px' 
            }}>
                <div> 
                    <Card.Title>{item.policyName}</Card.Title>
                    <Card.Text
                        style={{
                            height: '60px', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            display: '-webkit-box',
                            WebkitLineClamp: 3, 
                            WebkitBoxOrient: 'vertical',
                            fontSize: '0.9rem'
                        }}
                    >
                        {item.policyDescription}
                    </Card.Text>
                    <h5>{item.premium}</h5>
                </div>
              
              <div style={{ marginTop: 'auto' }}> 
                {!isAdmin && new Date() <= new Date(item.validUntil) && (
                  <Button 
                    className="btn btn-primary"
                    onClick={(e) => { e.stopPropagation(); handleBuyNow(item); }}
                  >
                    Buy Now
                  </Button>
                )}
                {new Date() > new Date(item.validUntil) && (
                  <span className="badge bg-danger">Expired</span>
                )}
                {isAdmin && item.displayId && (
                  <p className="text-muted mt-2 mb-0">ID: {item.displayId}</p> 
                )}
              </div>
            </Card.Body>
          </Card>
        </Carousel.Item>
      ))}
    </Carousel>
  );

  return (
    <Container className="my-4">
      <Row>
        <Col md={6}>
          <h4>Auto Insurance</h4>
          {renderCarousel(autoPolicies, "auto")}
          {isAdmin && (
            <Button className="mt-2 text-black" onClick={() => openModal("auto", "card")} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ backgroundColor: hovered ? "var(--primary)" : "var(--accent)", border: "none" }}>
              Add Auto Policy
            </Button>
          )}
        </Col>
        <Col md={6}>
          <h4>Life Insurance</h4>
          {renderCarousel(lifePolicies, "life")}
          {isAdmin && (
            <Button className="mt-2 text-black" onClick={() => openModal("life", "card")} onMouseEnter={() => setHovered1(true)} onMouseLeave={() => setHovered1(false)} style={{ backgroundColor: hovered1 ? "var(--primary)" : "var(--accent)", border: "none" }}>
              Add Life Policy
            </Button>
          )}
        </Col>
      </Row>

      {isAdmin && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-start">
            <Link to="/admin/policytable">
              <Button
                variant="secondary"
                className="text-black"
                onMouseEnter={() => setHovered2(true)}
                onMouseLeave={() => setHovered2(false)}
                style={{
                  backgroundColor: hovered2 ? "var(--primary)" : "var(--accent)",
                  border: "none"
                }}
              >
                Go to Policy Table
              </Button>
            </Link>
          </Col>
      </Row>

      )}

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingPolicy(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingPolicy
              ? `Edit ${category === "auto" ? "Auto" : "Life"} Policy`
              : `Add ${modalSource === "table" ? "Policy" : `${category === "auto" ? "Auto" : "Life"} Policy`}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Policy Name</Form.Label>
              <Form.Control
                type="text"
                value={newPolicy.policyName}
                onChange={(e) => {
                  const nameValue = e.target.value;
                  if (/^[a-zA-Z0-9 ]*$/.test(nameValue)) {
                    setNewPolicy({ ...newPolicy, policyName: nameValue });
                  }
                }}
                required
              />
              {newPolicy.policyName && !/^[a-zA-Z0-9 ]*$/.test(newPolicy.policyName) && (
                <small className="text-danger">Only letters and numbers allowed!</small>
              )}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Description / Validity</Form.Label>
              <Form.Control
                type="text"
                value={newPolicy.policyDescription}
                onChange={(e) => setNewPolicy({ ...newPolicy, policyDescription: e.target.value })}
                required
              />
              {!newPolicy.policyDescription && <small className="text-danger">This field cannot be empty!</small>}
            </Form.Group>

            {editingPolicy && selectedPolicy && selectedPolicy.displayId && (
              <Form.Group className="mb-2">
                <Form.Label>Display ID</Form.Label>
                <Form.Control
                  type="text"
                  value={editingPolicy.displayId}
                  readOnly
                  plaintext
                />
              </Form.Group>
            )}

            <Form.Group className="mb-2">
              <Form.Label>Valid Until</Form.Label>
              <Form.Control
                type="date"
                value={newPolicy.validUntil}
                onChange={(e) => setNewPolicy({ ...newPolicy, validUntil: e.target.value })}
                required
                min={new Date().toISOString().split("T")[0]}
              />
              {!newPolicy.validUntil && <small className="text-danger">Please select a valid expiration date.</small>}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Premium ($ per year)</Form.Label>
              <Form.Control
                type="text"
                value={newPolicy.premium}
                onChange={(e) => {
                  const premiumValue = e.target.value.replace(/\D/g, "");
                  setNewPolicy({ ...newPolicy, premium: premiumValue ? `$${premiumValue}/year` : "" });
                }}
                required
              />
              {!newPolicy.premium && <small className="text-danger">Enter a valid premium amount!</small>}
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Specs (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={newPolicy.policySpecs}
                onChange={(e) => setNewPolicy({ ...newPolicy, policySpecs: e.target.value })}
                required
              />
              {!newPolicy.policySpecs && <small className="text-danger">Please enter at least one specification.</small>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowModal(false); setEditingPolicy(null); }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Policy Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPolicy && (
            <>
              <p><strong>Policy ID:</strong> {selectedPolicy.displayId}</p>
              <p><strong>Policy Name:</strong> {selectedPolicy.policyName}</p>
              <p><strong>Description:</strong> {selectedPolicy.policyDescription}</p>
              <p><strong>Premium:</strong> {selectedPolicy.premium}</p>
              <p><strong>Valid Until:</strong> {new Date(selectedPolicy.validUntil).toLocaleDateString()}</p>
              <p><strong>Specifications:</strong></p>
              <ul>
                {selectedPolicy.policySpecs.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
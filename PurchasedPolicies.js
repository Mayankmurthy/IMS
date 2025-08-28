import React, { useState, useEffect } from "react";
import { Table, Container, Card, Pagination } from "react-bootstrap";

export default function PurchasedPolicies() {
  const [allCustomers, setAllCustomers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(2); 

  useEffect(() => {
    const fetchAllCustomersAndPolicies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/all-purchased-policies");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllCustomers(data); 
      } catch (err) {
        setError("Failed to fetch customer policies: " + err.message);
        console.error("Error fetching customer policies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCustomersAndPolicies();
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile); 
  }, []);

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = allCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const totalPages = Math.ceil(allCustomers.length / customersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationItems = () => {
    let items = [];
    const maxPageNumbersToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    if (endPage - startPage + 1 < maxPageNumbersToShow) {
        startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };


  if (loading) {
    return (
      <Container className="my-4 text-center">
        <p>Loading customer policies...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-4 text-center">
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h3 className="mb-4 text-center text-primary fw-bold">Customer Purchased Policies Overview</h3>

      {allCustomers.length === 0 ? (
        <div className="alert alert-info text-center py-3">
          No customers have purchased policies yet.
        </div>
      ) : (
        currentCustomers.map((customer) => (
          <Card className="mb-4 shadow-sm" key={customer._id}>
            <Card.Header className="bg-light d-flex flex-wrap justify-content-between align-items-center p-3">
              <h5 className="mb-0 text-break me-auto">
                Customer: <span className="text-primary">{customer.username}</span>
                {customer.email && <small className="ms-md-3 mt-1 mt-md-0 text-muted d-block d-md-inline">({customer.email})</small>}
              </h5>
              <span className="badge bg-info text-dark mt-2 mt-md-0 ms-md-3 py-2 px-3 fs-6">
                Policies: {customer.purchasedPolicies.length}
              </span>
            </Card.Header>
            <Card.Body className="p-0">
              {customer.purchasedPolicies.length === 0 ? (
                <div className="p-3 text-muted fst-italic">This customer has no purchased policies.</div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="d-none d-md-block table-responsive">
                    <Table bordered className="mb-0 text-center" style={{ borderColor: "var(--primary)" }}>
                      <thead>
                        <tr>
                          <th>Policy Display ID</th>
                          <th>Policy Name</th>
                          <th>Premium</th>
                          <th>Description</th>
                       
                          <th>Specs</th>
                          <th>Valid Until</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.purchasedPolicies.map((policy) => (
                          <tr key={policy._id}>
                            <td>{policy.displayId || "N/A"}</td>
                            <td>{policy.policyName || "N/A"}</td>
                            <td>{policy.premium || "N/A"}</td>
                            <td>{policy.policyDescription || "N/A"}</td>
                           
                            <td>
                              <ul className="mb-0 list-unstyled text-start ms-2 small">
                                {policy.policySpecs && policy.policySpecs.map((spec, index) => (
                                  <li key={index}><i className="bi bi-dot"></i> {spec}</li>
                                ))}
                              </ul>
                            </td>
                            <td>{policy.validUntil ? new Date(policy.validUntil).toLocaleDateString() : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {/* Mobile Card View for Policies */}
                  <div className="d-md-none p-3">
                    {customer.purchasedPolicies.map((policy) => (
                      <Card className="mb-3 shadow-sm" key={policy._id}>
                        <Card.Body>
                          <Card.Title className="text-primary h6 mb-2">
                            Policy: {policy.policyName || "N/A"}
                          </Card.Title>
                          <Card.Subtitle className="mb-2 text-muted small">
                            ID: {policy.displayId || "N/A"}
                          </Card.Subtitle>
                          <p className="card-text mb-1">
                            <strong>Premium:</strong> {policy.premium || "N/A"}
                          </p>
                          <p className="card-text mb-1">
                            <strong>Description:</strong> {policy.policyDescription || "N/A"}
                          </p>
                         
                          <p className="card-text mb-1">
                            <strong>Valid Until:</strong> {policy.validUntil ? new Date(policy.validUntil).toLocaleDateString() : 'N/A'}
                          </p>
                          {policy.policySpecs && policy.policySpecs.length > 0 && (
                            <div className="mt-2">
                              <strong>Specs:</strong>
                              <ul className="list-unstyled mb-0 ms-2 small">
                                {policy.policySpecs.map((spec, index) => (
                                  <li key={index}><i className="bi bi-dot"></i> {spec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        ))
      )}

      {/* Frontend Pagination Controls */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
          {renderPaginationItems()}
          <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      )}
    </Container>
  );
}
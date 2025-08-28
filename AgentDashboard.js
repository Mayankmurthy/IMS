import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AgentDashboard = () => {
  const [stats, setStats] = useState({
    customersRegisteredByMe: 0,
    assignedPolicies: 0,
    targetCustomers: 0,
    achievedCustomers: 0,
  });

  const [agentUsername, setAgentUsername] = useState(null);

  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const token = localStorage.getItem('token');

    if (authUser && token && authUser.username) {
      setAgentUsername(authUser.username);

      axios.get('http://localhost:5000/api/agent/dashboard/my-stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setStats({
          customersRegisteredByMe: res.data.customersRegisteredByMe || 0,
          assignedPolicies: res.data.assignedPolicies || 0,
          targetCustomers: res.data.targetCustomers || 0,
          achievedCustomers: res.data.achievedCustomers || 0,
        });
      })
      .catch(err => {
        console.error("Error:", err.response?.data || err.message);
        alert("Failed to load agent stats.");
      });
    }
  }, []);

  const getDisplayName = (username) =>
    username && username.includes('@') ? username.split('@')[0] : username;

  const customerPolicyData = [
    { name: 'Customers Registered', value: stats.customersRegisteredByMe },
    { name: 'Assigned Policies', value: stats.assignedPolicies },
  ];

  const COLORS1 = ['#0088FE', '#FFBB28'];

  return (
    <Container className="my-4">
      <h3 className="text-center mb-4">
        Welcome Agent {agentUsername ? `(${getDisplayName(agentUsername)})` : ''}
      </h3>

      <Row className="g-4 justify-content-center">
        <Col xs={12} sm={6} lg={4}>
          <Card className="text-center shadow-sm border-0 h-100">
            <Card.Body>
              <h6 className="text-muted">Customers Registered</h6>
              <h4 className="fw-bold text-primary">{stats.customersRegisteredByMe}</h4>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={4}>
          <Card className="text-center shadow-sm border-0 h-100">
            <Card.Body>
              <h6 className="text-muted">Assigned Policies</h6>
              <h4 className="fw-bold text-info">{stats.assignedPolicies}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-5">
        <Col xs={12} md={8} className="mx-auto">
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <h5 className="text-center mb-3">Customers Registered vs. Assigned Policies</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={customerPolicyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {customerPolicyData.map((entry, index) => (
                      <Cell key={index} fill={COLORS1[index % COLORS1.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AgentDashboard;

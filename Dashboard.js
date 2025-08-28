
import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState({
    policies: 0,
    claims: 0,
    approvals: 0,
    customers: 0,
    agents: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]); 

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/dashboard");
        setData(response.data);
        console.log("Dashboard data fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    const fetchRecentActivity = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/activity"); 
        setRecentActivity(response.data);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      }
    };

    fetchDashboardData();
    fetchRecentActivity(); 
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-center">Insurance Dashboard</h2>

      <div className="row mt-4">
        {[
          { label: "Total Policies", value: data.policies },
          { label: "No of Agents", value: data.agents },
          { label: "Pending Approvals", value: data.approvals },
          { label: "No of Customers", value: data.customers },
        ].map((item, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title">{item.label}</h5>
                <p className="card-text fs-4 fw-bold">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h3 className="text-center">Recent Activity</h3>
        <div className="card shadow-sm">
          <div className="card-body">
            {recentActivity.length > 0 ? (
              <ul className="list-group">
                {recentActivity.map((activity, index) => (
                  <li key={index} className="list-group-item">{activity.text}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-center">No recent activity found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

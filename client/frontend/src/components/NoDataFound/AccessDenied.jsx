import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Access Denied</h1>
      <p style={styles.text}>You do not have permission to view this page.</p>
      <Link to="/" style={styles.button}>Go to Home</Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
  },
  heading: {
    color: "red",
    fontSize: "28px",
    fontWeight: "bold",
  },
  text: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  button: {
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
  },
};

export default AccessDenied;

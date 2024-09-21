import React from 'react';

const AboutPage = () => {
  return (
    <div style={styles.container}>
      <section style={styles.headerSection}>
        <h1 style={styles.title}>About Us</h1>
        <p style={styles.description}>
          Welcome to our e-commerce platform! We aim to bring you the best products at affordable prices. 
          Our platform is designed to provide a seamless and secure shopping experience.
        </p>
        <p style={styles.description}>
          Our mission is to bring high-quality products from top brands to your doorstep. We value our customers 
          and are dedicated to providing excellent customer service and a wide range of products.
        </p>
        <p style={styles.description}>
          Thank you for shopping with us!
        </p>
      </section>

      <section style={styles.teamSection}>
        <h2 style={styles.teamTitle}>Meet Our Team</h2>
        <div style={styles.teamContainer}>
          <div style={styles.teamMember}>
            <h3 style={styles.memberName}>Huzaifa Quaid Johar</h3>
            <p style={styles.memberRole}>Hardworking</p>
          </div>

          <div style={styles.teamMember}>
            <h3 style={styles.memberName}>Muhammad Muneeb</h3>
            <p style={styles.memberRole}>Consistent</p>
          </div>

          <div style={styles.teamMember}>
            <h3 style={styles.memberName}>Muhammad Hassan</h3>
            <p style={styles.memberRole}>Innovative</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Basic styling to improve UI appearance
const styles = {
  container: {
    fontFamily: "'Arial', sans-serif",
    backgroundColor: '#f4f4f4',
    padding: '2rem',
    color: '#333',
    maxWidth: '100%',
    margin: '0 auto',
  },
  headerSection: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: '1rem',
    lineHeight: '1.6',
    marginTop: '1rem',
  },
  teamSection: {
    textAlign: 'center',
    marginTop: '2rem',
  },
  teamTitle: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
  },
  teamContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap', // Allows wrapping on smaller screens
    margin: '0 auto',
  },
  teamMember: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '200px',
    textAlign: 'center',
  },
  memberName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  memberRole: {
    fontSize: '0.9rem',
    color: '#666',
  },
};

export default AboutPage;

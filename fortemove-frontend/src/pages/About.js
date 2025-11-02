import React from "react";

const About = () => {
  return (
    <div className="container">
      <div className="form-container">
        <h1>About Fortemove</h1>
        <p>
          Fortemove is a leading HR services and consultation company dedicated
          to connecting talented professionals with businesses seeking
          exceptional talent. We specialize in providing comprehensive HR
          solutions tailored to meet the unique needs of both candidates and
          employers.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to transform the recruitment landscape by creating
          meaningful connections between talent and opportunity. We believe that
          the right match can propel both individuals and organizations toward
          unprecedented success.
        </p>

        <h2>Our Services</h2>
        <div className="features">
          <div className="feature">
            <h3>For Candidates</h3>
            <p>
              We help job seekers find positions that match their skills,
              experience, and career aspirations. Our platform provides access
              to a wide range of opportunities across various industries.
            </p>
          </div>

          <div className="feature">
            <h3>For Businesses</h3>
            <p>
              We offer comprehensive HR solutions including recruitment,
              consultation, and talent management services. Our experts help
              businesses build strong teams that drive growth and innovation.
            </p>
          </div>
        </div>

        <h2>Why Choose Us?</h2>
        <ul>
          <li>Extensive network of qualified professionals</li>
          <li>Industry expertise across multiple sectors</li>
          <li>Personalized approach to HR solutions</li>
          <li>Commitment to long-term success</li>
          <li>Transparent and efficient processes</li>
        </ul>
      </div>
    </div>
  );
};

export default About;

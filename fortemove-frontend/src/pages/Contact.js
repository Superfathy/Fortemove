import React from "react";

const Contact = () => {
  return (
    <div className="container">
      <div className="form-container">
        <h1>Contact Us</h1>
        <p>
          Have questions or need assistance? We're here to help. Reach out to us
          through any of the following channels:
        </p>

        <div className="features">
          <div className="feature">
            <h3>Email</h3>
            <p>info@fortemove.com</p>
          </div>

          <div className="feature">
            <h3>Phone</h3>
            <p>+1 (555) 123-4567</p>
          </div>

          <div className="feature">
            <h3>Address</h3>
            <p>
              123 Business District
              <br />
              City, State 12345
              <br />
              Country
            </p>
          </div>
        </div>

        <h2>Business Hours</h2>
        <p>
          Monday - Friday: 9:00 AM - 6:00 PM
          <br />
          Saturday: 10:00 AM - 4:00 PM
          <br />
          Sunday: Closed
        </p>

        <h2>Send Us a Message</h2>
        <form>
          <div className="form-group">
            <label htmlFor="contactName">Name</label>
            <input type="text" id="contactName" required />
          </div>

          <div className="form-group">
            <label htmlFor="contactEmail">Email</label>
            <input type="email" id="contactEmail" required />
          </div>

          <div className="form-group">
            <label htmlFor="contactSubject">Subject</label>
            <input type="text" id="contactSubject" required />
          </div>

          <div className="form-group">
            <label htmlFor="contactMessage">Message</label>
            <textarea id="contactMessage" rows="5" required></textarea>
          </div>

          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

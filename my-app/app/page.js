import React from 'react';
import Navbar from '../Components/Navbar/Navbar';

const Page = () => {
  return (
    <div>
      <Navbar />
      <section id="home" className="pt-16">
        <h1>Home Section</h1>
        <p>Welcome to the Home section.</p>

      </section>
      <section id="about" className="pt-16">
        <h1>About Us Section</h1>
        <p>Learn more about us in this section.</p>
      </section>
      <section id="contact" className="pt-16">
        <h1>Contact Us Section</h1>
        <p>Get in touch with us in this section.</p>
      </section>
      <section id="profile" className="pt-16">
        <h1>Profile Section</h1>
        <p>View your profile in this section.</p>
      </section>
    </div>
  );
};

export default Page;

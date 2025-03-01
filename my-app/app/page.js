import Home from "@/Components/Home/Home";
import AboutUs from "@/Components/Home/AboutUs";
import ContactUs from "@/Components/Home/ContactUs";

export default function Page() {
  return (
    <div>
      <section id="home">
        <Home />
      </section>
      <section id="about">
        <AboutUs />
      </section>
      <section id="contact">
        <ContactUs />
      </section>
    </div>
  );
}
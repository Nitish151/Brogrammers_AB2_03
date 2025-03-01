import Image from "next/image";
import Home from "@/Components/Home/Home";
import Navbar from "@/Components/Navbar/Navbar";
import AboutUs from "@/Components/Home/AboutUs";
import ContactUs from "@/Components/Home/ContactUs";
import Sidebar from "@/Components/Sidebar/Sidebar";

export default function Page() {
  return (
    <div>
      {/* Navbar - Fixed at the top, overlapping sidebar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="flex">
        {/* Sidebar - Fixed on the left */}
        <div className="fixed top-16 left-0 w-64 h-full bg-gray-100 shadow-md">
          <Sidebar />
        </div>

        {/* Main Content - Adjust padding to avoid overlap with sidebar */}
        <div className="flex-1 ml-64">
          <div className="pt-16">
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
        </div>
      </div>
    </div>
  );
}
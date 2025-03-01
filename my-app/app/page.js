import Image from "next/image";
import Home from "@/Components/Home/Home"
import Navbar from "@/Components/Navbar/Navbar";

export default function page() {
  return (
    <div>
      <Navbar/>
      <section id="home">
      <Home/>
      </section>
    </div>
  );
}
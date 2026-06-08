import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AuroraFeature from "@/components/AuroraFeature";
import About from "@/components/About";
import Services from "@/components/Services";
import Choose from "@/components/Choose";
import Work from "@/components/Work";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>SV Developers | Premium Construction & Development</title>
        <meta
          name="description"
          content="SV Developers - Building dreams into reality. Premium construction and development services with 25+ years of excellence."
        />
      </Helmet>

      <PageLoader />

      <div className="min-h-screen overflow-x-hidden">
        <Header />
        <Hero />
        <AuroraFeature />
        <About />
        <Services />
        <Choose />
        <Work />
        <Contact />
        <Footer />
      </div>
    </>
  );
};

export default Index;
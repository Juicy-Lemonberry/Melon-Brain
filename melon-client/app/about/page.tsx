//docker-compose -f docker-compose-windows.yml --env-file .env up --build
import TopNavbar from "@/components/TopNavbar";
import Footer from "@/components/Footer";
import Image from "next/image"
import "./About.css"

function About() {
  return (
    <>
    <TopNavbar/>    
    <section className="bg-success py-5">
        <div className="container">
            <div className="row align-items-center py-5">
                <div className="col-md-8 text-white">
                    <h1>About Us</h1>
                    <p>
                    Melon Brain, that serves as a platform for users to share their educational knowledge through blog-like posts. 
                    Melon Brain will create a community where users can not only share their knowledge, but create meaningful discussions by 
                    commenting on posts and asking questions. 
                    The main goal of Melon Brain is to create an interactive platform for knowledge sharing.
                    </p>
                </div>
                <div className="col-md-4">
                <Image
                            src="/images/melon_brain.png"
                            width={500}
                            height={500}
                            alt="Website icon"
                            layout="responsive"
                            />
                </div>
            </div>
        </div>
    </section>

      {/* Second section */}
      <section className="container py-5">
        <div className="row text-center pt-5 pb-3">
            <div className="col-lg-6 m-auto">
                <h1 className="h1">Our Services</h1>
                <p>
                    
                </p>
            </div>
        </div>
        <div className="row">

            <div className="col-md-6 col-lg-3 pb-5">
                <div className="h-100 py-5 services-icon-wap shadow">
                    <div className="h1 text-success text-center"><i className="fa fa-truck fa-lg"></i></div>
                    <h2 className="h5 mt-4 text-center">Educational Blog</h2>
                </div>
            </div>

            <div className="col-md-6 col-lg-3 pb-5">
                <div className="h-100 py-5 services-icon-wap shadow">
                    <div className="h1 text-success text-center"><i className="fas fa-exchange-alt"></i></div>
                    <h2 className="h5 mt-4 text-center">Topics Discussions</h2>
                </div>
            </div>

            <div className="col-md-6 col-lg-3 pb-5">
                <div className="h-100 py-5 services-icon-wap shadow">
                    <div className="h1 text-success text-center"><i className="fa fa-percent"></i></div>
                    <h2 className="h5 mt-4 text-center">Moderate and Report</h2>
                </div>
            </div>

            <div className="col-md-6 col-lg-3 pb-5">
                <div className="h-100 py-5 services-icon-wap shadow">
                    <div className="h1 text-success text-center"><i className="fa fa-user"></i></div>
                    <h2 className="h5 mt-4 text-center">24 Hours Services</h2>
                </div>
            </div>
        </div>
    </section>
    {/* <!-- End Section --> */}
    <Footer/>
    </>
  );
}

export default About;


// Components
import PageHeader from "../components/PageHeader/PageHeader";
import OverlayCard from "../components/OverlayCard/OverlayCard";
import TitleWithSubtitle from "../components/TitleWithSubtitle/TitleWithSubtitle";
import ImageBox from "../components/Box/ImageBox";
import ButtonWhite from "../components/Buttons/ButtonWhite";
import BasicSlider from "../components/Slider/BasicSlider";
import Reservation from "../components/Forms/Reservation";
import ContactBox from "../components/Box/ContactBox";
import ReservationForm from "../components/ReservationForm";

import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

// media
import imgAboutUs1 from "../assets/images/about-us-1.jpg";
import imgAboutUs2 from "../assets/images/about-us-2.jpg";
import imgAboutUs3 from "../assets/images/about-us-3.jpg";
import video from "../assets/videos/introduction.mp4";
import chef1 from "../assets/images/chefs/chef-1.jpg";
import chef2 from "../assets/images/chefs/chef-2.jpg";
import chef3 from "../assets/images/chefs/chef-3.jpg";
import chef4 from "../assets/images/chefs/chef-4.jpg";
import menuslider1 from "../assets/images/menus/menu-slider-1.jpg";
import menuslider2 from "../assets/images/menus/menu-slider-2.jpg";
import menuslider3 from "../assets/images/menus/menu-slider-3.jpg";
import shopping1 from "../assets/images/shopping/title-wines.jpg";
import shopping2 from "../assets/images/shopping/title-cakes.jpg";
import imgBeginnerClass from "../assets/images/beginner-class.jpg";
import imgAdvanceClass from "../assets/images/advance-class.jpg";

function Home() {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentStatus = queryParams.get("paymentStatus");

    if (paymentStatus === "success") {
      alert("Thanh toán thành công! Đơn hàng của bạn đã được cập nhật.");
    } else if (paymentStatus === "failed") {
      alert("Thanh toán thất bại. Vui lòng thử lại.");
    } else if (paymentStatus === "checksum_failed") {
      alert("Lỗi xác thực chữ ký. Vui lòng liên hệ hỗ trợ.");
    }
    window.scrollTo(0, 0); // Cuộn lên đầu khi trang được mount
  }, [location]);

  return (
    <div>
      <PageHeader
        backgroundSrc={video}
        backgroundType={"video"}
        buttonText={"Book a table"}
        h2Title={"restaurant"}
        subTitle={"Welcome to our delicious corner"}
        title={"A3Building"}
      />
      {/* ***** About Us Start ***** */}
      <div className="section">
        <div className="row">
          <div className="col-sm-3">
            <TitleWithSubtitle subTitle={"Our Story"} title={"About Us"} />
            <p>
              At the heart of everything we do is a passion for creating
              meaningful experiences. We started with a simple idea — to bring
              beauty, purpose, and authenticity into everyday life. Today, that
              vision continues to guide us as we grow and evolve.
            </p>
          </div>
          <div className="col-sm-3 justify-content-center d-flex">
            <ImageBox src={imgAboutUs1} height={"450px"} />
          </div>
          <div className="col-sm-3">
            <ImageBox src={imgAboutUs2} height={"450px"} />
          </div>
          <div className="col-sm-3">
            <ImageBox src={imgAboutUs3} height={"450px"} />
          </div>
        </div>
      </div>
      {/* ***** About Us End ***** */}

      {/* ***** Our Chefs Start ***** */}
      <div className="section" style={{ backgroundColor: "#fffafa" }}>
        <div className="row">
          <div className="col-sm-9 ">
            <TitleWithSubtitle
              subTitle={"The culinary minds behind every unforgettable dish"}
              title={"MEET OUR MASTER CHEFS"}
            />
          </div>
          <div className="col-sm-3 d-flex align-items-center">
            <Link to="/chefs">
              <ButtonWhite buttontext={"Discover all Chefs"} />
            </Link>
          </div>
          <div className="col-sm-3">
            <OverlayCard
              title={"Randy Walker "}
              description={["Pastry Chef"]}
              imageSrc={chef1}
              height={"450px"}
            />
          </div>
          <div className="col-sm-3">
            <OverlayCard
              title={"Randy Walker "}
              description={["Pastry Chef"]}
              imageSrc={chef2}
              height={"450px"}
            />
          </div>
          <div className="col-sm-3">
            <OverlayCard
              title={"David Martin "}
              description={["Cookie Chef"]}
              imageSrc={chef3}
              height={"450px"}
            />
          </div>
          <div className="col-sm-3">
            <OverlayCard
              title={"Peter Perkson"}
              description={["Peter ancake Chef"]}
              imageSrc={chef4}
              height={"450px"}
            />
          </div>
        </div>
      </div>
      {/* ***** Our Chefs End ***** */}

      {/* ***** Our Menu Start ***** */}
      <div className="section">
        <div className="row">
          <div className="col-7">
            <BasicSlider
              images={[
                { src: menuslider1, alt: "Menu Slider 1" },
                { src: menuslider2, alt: "Menu Slider 2" },
                { src: menuslider3, alt: "Menu Slider 3" },
              ]}
              width="100%"
              height="450px"
            />
          </div>
          <div className="col-5">
            <TitleWithSubtitle
              title="Best dishes from our Menu"
              subTitle="A3Building’s tasty offer"
            />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas
              unde corrupti a adipisci, doloribus nostrum cum consectetur odio
              consequatur fugiat cumque numquam suscipit quos culpa, atque
              iusto, ad perspiciatis mollitia?
            </p>

            <Link to="/menus">
              <ButtonWhite buttontext={"Explore our Menu"} />
            </Link>
          </div>
        </div>
      </div>
      {/* ***** Our Menu End ***** */}

      {/* ***** E-Shopping ***** */}
      <div className="section" style={{ backgroundColor: "#fffafa" }}>
        <div className="row">
          <div className="col-sm-6 d-flex align-items-center">
            <div>
              <TitleWithSubtitle
                title="E-Shopping"
                subTitle="Fast - Easy - Anywhere"
              />
              <p className="mb-5 me-5">
                Enjoy the convenience of browsing and buying your favorite
                products anytime, anywhere. From daily essentials to exclusive
                finds, our online store is designed to make your shopping
                experience fast, easy, and enjoyable.
              </p>
              <ButtonWhite buttontext={"Explore all category"} />
            </div>
          </div>
          <div className="col-sm-3">
            <OverlayCard imageSrc={shopping1} height={"500px"} />
          </div>
          <div className="col-sm-3">
            <OverlayCard imageSrc={shopping2} height={"500px"} />
          </div>
        </div>
      </div>
      {/* ***** E-Shopping End ***** */}

      {/* ***** Join us Start ***** */}
      <div className="section">
        <div className="row">
          <div className="col-sm-5">
            <TitleWithSubtitle
              title="JOIN US"
              subTitle="Discover New Opportunities"
            />
          </div>
          <div className="col-sm-7">
            <p>
              Whether you're looking to launch your career in the kitchen or
              simply sharpen your skills, we welcome you to be part of our
              vibrant culinary world. Explore two exciting ways to get involved
              below.
            </p>
          </div>
          <div className="col-sm-6">
            <Link to="register-class">
              <OverlayCard
                imageSrc={imgBeginnerClass}
                height={"400px"}
                title="Be our Student"
                description={[
                  "Learn from talented chefs, explore new cuisines, and master the art of cooking.",
                ]}
              />
            </Link>
          </div>
          <div className="col-sm-6">
            <Link to="/recuitment">
              <OverlayCard
                imageSrc={imgAdvanceClass}
                height={"400px"}
                title="Be our Chef"
                description={[
                  "Share your culinary passion, earn income, and inspire food lovers around the world.",
                ]}
              />
            </Link>
          </div>
        </div>
      </div>
      {/* ***** Join us End ***** */}

      {/* ***** Reservation Start ***** */}
      <div className="section" style={{ backgroundColor: "black" }}>
        <div className="row">
          <div className="col-6">
            <h6 style={{ color: "white" }}>Your table, your way</h6>
            <h2 style={{ color: "white" }}>
              Here You Can Book a Table — Or Simply Drop By and Dine With Us
            </h2>

            <p style={{ color: "white" }} className="mb-5">
              Whether you’re planning ahead or just passing by, our doors are
              always open. Enjoy authentic flavors, cozy ambiance, and a dining
              experience to remember—your table is ready when you are.
            </p>
            <div className="row">
              <div className="col-6">
                <ContactBox
                  title={"Email"}
                  emails={["hello@company.com", "info@company.com"]}
                  logo="fa fa-envelope"
                />
              </div>
              <div className="col-6">
                <ContactBox
                  title={"Phone Numbers"}
                  emails={["hello@company.com", "info@company.com"]}
                  logo="fa fa-phone"
                />
              </div>
            </div>
          </div>
          <div className="col-1"></div>
          <div className="col-5 p-2" style={{ backgroundColor: "white" }}>
            <h5 className="text-center mt-3" style={{ fontSize: "30px" }}>
              Book a table
            </h5>
            <ReservationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;

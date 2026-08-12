import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import "./ScrollTop.css";

const ScrollTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`scroll-top ${show ? "show" : ""}`}
      onClick={scrollTop}
      aria-label="Back to top"
    >
      <ChevronUp size={24} />
    </button>
  );
};

export default ScrollTop;
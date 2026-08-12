import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { slug } = useParams();

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-3xl font-bold">Product Details</h1>
        <p className="mt-3 text-gray-600">Product slug: {slug}</p>
      </div>
    </section>
  );
};

export default ProductDetails;

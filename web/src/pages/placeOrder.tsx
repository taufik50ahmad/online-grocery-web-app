import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


type OrderItem = {
  id: number;
  productName: string;
  quantity: number;
  totalPrice: number;
};


type Order = {
  id: number;
  orderStatus: string;
  totalQuantity: number;
  orderItems: OrderItem[];
};


export default function PlacedOrderPage() {

  const { orderId } = useParams();

  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  useEffect(() => {

    async function fetchOrder() {

      try {

        const response = await axios.get(
          `http://localhost:3000/orders/${orderId}`
        );


        setOrder(response.data.data);


      } catch (err) {

        setError(
          err.response?.data?.message ||
          "Failed to load order"
        );

      } finally {

        setLoading(false);

      }

    }


    if(orderId){
      fetchOrder();
    }

  }, [orderId]);




  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading order...
      </div>
    );
  }



  if(error){

    return (
      <div className="flex flex-col justify-center items-center min-h-screen">

        <h2 className="text-xl font-bold text-red-500">
          {error}
        </h2>


        <button
          onClick={() => navigate("/")}
          className="mt-4 px-5 py-2 bg-blue-500 text-white rounded"
        >
          Back Home
        </button>

      </div>
    );

  }




  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">


        <div className="text-center mb-8">


          <div className="text-5xl mb-3">
            ✓
          </div>


          <h1 className="text-2xl font-bold">
            Order Placed Successfully!
          </h1>


          <p className="text-gray-600 mt-2">
            Your order has been submitted.
          </p>


        </div>



        <div className="border rounded p-4 mb-6">

          <p>
            <span className="font-semibold">
              Order ID:
            </span>{" "}
            #{order?.id}
          </p>


          <p>
            <span className="font-semibold">
              Status:
            </span>{" "}
            {order?.orderStatus}
          </p>


          <p>
            <span className="font-semibold">
              Total Items:
            </span>{" "}
            {order?.totalQuantity}
          </p>


        </div>




        <h2 className="text-xl font-semibold mb-4">
          Order Details
        </h2>



        <div className="space-y-3">


          {order?.orderItems.map((item)=>(
            
            <div
              key={item.id}
              className="flex justify-between border-b pb-3"
            >

              <div>

                <p className="font-medium">
                  {item.productName}
                </p>


                <p className="text-gray-500">
                  Quantity: {item.quantity}
                </p>

              </div>


              <p className="font-semibold">
                Rp {item.totalPrice.toLocaleString()}
              </p>


            </div>

          ))}


        </div>




        <button
          onClick={() => navigate("/")}
          className="w-full mt-8 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Continue Shopping
        </button>



      </div>

    </div>

  );
}
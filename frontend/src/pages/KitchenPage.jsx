import { useEffect, useState } from "react";
import api from "../api/axios";

function KitchenPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const activeOrders = orders.filter(
    (order) =>
      order.status !== "completed" &&
      order.status !== "cancelled"
  );

  const getStatusClass = (status) => {
    if (status === "pending")
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500";

    if (status === "preparing")
      return "bg-orange-500/20 text-orange-400 border-orange-500";

    if (status === "ready")
      return "bg-green-500/20 text-green-400 border-green-500";

    return "bg-blue-500/20 text-blue-400 border-blue-500";
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Kitchen / KOT Screen
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeOrders.map((order) => (
          <div
            key={order._id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Table {order.table?.tableNumber}
              </h2>

              <span
                className={`px-3 py-1 rounded-full border text-sm ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-slate-400 mb-2">Items</p>

              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between border-b border-slate-800 py-2"
                >
                  <span>{item.name}</span>
                  <span>x {item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <p className="text-slate-400">
                Note: {order.note || "No note"}
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() =>
                  updateStatus(order._id, "preparing")
                }
                className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg"
              >
                Preparing
              </button>

              <button
                onClick={() =>
                  updateStatus(order._id, "ready")
                }
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
              >
                Ready
              </button>

              <button
                onClick={() =>
                  updateStatus(order._id, "served")
                }
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
              >
                Served
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KitchenPage;
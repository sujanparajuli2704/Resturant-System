import { useEffect, useState } from "react";
import api from "../api/axios";

function DashboardPage() {
  const [menu, setMenu] = useState([]);
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      const menuRes = await api.get("/menu");
      const tablesRes = await api.get("/tables");
      const ordersRes = await api.get("/orders");
      const billsRes = await api.get("/bills");

      setMenu(menuRes.data);
      setTables(tablesRes.data);
      setOrders(ordersRes.data);
      setBills(billsRes.data);
    };

    fetchDashboard();
  }, []);

  const totalSales = bills.reduce((sum, bill) => sum + bill.grandTotal, 0);
  const activeTables = tables.filter((t) => t.status === "occupied").length;
  const pendingOrders = orders.filter((o) => o.status !== "completed").length;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Owner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 mb-2">Total Sales</p>
          <h2 className="text-3xl font-bold text-green-400">
            Rs. {totalSales}
          </h2>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 mb-2">Orders</p>
          <h2 className="text-3xl font-bold text-orange-400">
            {orders.length}
          </h2>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 mb-2">Active Tables</p>
          <h2 className="text-3xl font-bold text-blue-400">
            {activeTables}
          </h2>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="text-slate-400 mb-2">Menu Items</p>
          <h2 className="text-3xl font-bold text-purple-400">
            {menu.length}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>

          {orders.slice(0, 5).map((order) => (
            <div
              key={order._id}
              className="flex justify-between border-b border-slate-800 py-3"
            >
              <span>Table {order.table?.tableNumber}</span>
              <span>{order.status}</span>
              <span>Rs. {order.totalAmount}</span>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Bills</h2>

          {bills.slice(0, 5).map((bill) => (
            <div
              key={bill._id}
              className="flex justify-between border-b border-slate-800 py-3"
            >
              <span>Bill #{bill._id.slice(-5)}</span>
              <span>{bill.paymentMethod}</span>
              <span className="text-green-400">Rs. {bill.grandTotal}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
import { useEffect, useState } from "react";
import api from "../api/axios";

function BillingPage() {
  const [orders, setOrders] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [receipt, setReceipt] = useState(null);

  const fetchData = async () => {
    const ordersRes = await api.get("/orders");
    const billsRes = await api.get("/bills");

    setOrders(ordersRes.data);
    setBills(billsRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const closedBillOrderIds = bills
    .filter(
      (bill) =>
        bill.paymentStatus === "paid" || bill.paymentStatus === "credit"
    )
    .map((bill) => bill.order?._id || bill.order);

  const billableOrders = orders.filter(
    (order) =>
      (order.status === "served" || order.status === "completed") &&
      !closedBillOrderIds.includes(order._id)
  );

  const generateBill = async (e) => {
    e.preventDefault();

    if (!selectedOrderId) {
      alert("Please select an order");
      return;
    }

    const { data } = await api.post("/bills", {
      orderId: selectedOrderId,
      discount: Number(discount),
      vatPercent: 13,
      paymentMethod,
    });

    setReceipt(data.receipt);
    setSelectedOrderId("");
    setDiscount(0);
    setPaymentMethod("cash");
    fetchData();

    alert("Bill generated as unpaid");
  };

  const updateBillStatus = async (billId, paymentStatus) => {
    await api.put(`/bills/${billId}/status`, {
      paymentStatus,
    });

    fetchData();
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Billing / POS Invoice</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form
          onSubmit={generateBill}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Generate Bill</h2>

          <select
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="w-full bg-slate-800 p-3 rounded-lg mb-4"
          >
            <option value="">Select completed/served order</option>

            {billableOrders.map((order) => (
              <option key={order._id} value={order._id}>
                Table {order.table?.tableNumber} - Rs. {order.totalAmount} -{" "}
                {order.status}
              </option>
            ))}
          </select>

          <input
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            type="number"
            placeholder="Discount"
            className="w-full bg-slate-800 p-3 rounded-lg mb-4"
          />

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full bg-slate-800 p-3 rounded-lg mb-4"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="esewa">eSewa</option>
            <option value="khalti">Khalti</option>
            <option value="fonepay">Fonepay</option>
          </select>

          <button className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-bold">
            Generate Bill
          </button>
        </form>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Receipt Preview</h2>

          {!receipt && (
            <p className="text-slate-400">No receipt generated yet.</p>
          )}

          {receipt && (
            <div>
              <p className="mb-2">Table: {receipt.table}</p>

              <div className="border-y border-slate-800 py-3 my-3">
                {receipt.items.map((item) => (
                  <div key={item._id} className="flex justify-between py-1">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>Rs. {item.subtotal}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {receipt.subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>Rs. {receipt.discount}</span>
                </div>

                <div className="flex justify-between">
                  <span>VAT {receipt.vatPercent}%</span>
                  <span>Rs. {receipt.vatAmount}</span>
                </div>

                <div className="flex justify-between text-xl font-bold text-green-400 border-t border-slate-800 pt-3">
                  <span>Grand Total</span>
                  <span>Rs. {receipt.grandTotal}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Recent Bills</h2>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        {bills
  .filter((bill) => bill.paymentStatus === "unpaid")
  .map((bill) => (
          <div
            key={bill._id}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center border-b border-slate-800 py-3"
          >
            <span>Bill #{bill._id.slice(-5)}</span>

            <span>{bill.paymentMethod}</span>

            <span className="text-green-400">Rs. {bill.grandTotal}</span>

            <span
              className={`px-3 py-1 rounded-full text-center ${
                bill.paymentStatus === "paid"
                  ? "bg-green-500/20 text-green-400"
                  : bill.paymentStatus === "credit"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {bill.paymentStatus}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => updateBillStatus(bill._id, "paid")}
                className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg"
              >
                Paid
              </button>

              <button
                onClick={() => updateBillStatus(bill._id, "unpaid")}
                className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg text-black"
              >
                Unpaid
              </button>

              <button
                onClick={() => updateBillStatus(bill._id, "credit")}
                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg"
              >
                Credit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BillingPage;
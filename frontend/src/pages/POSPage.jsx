import { useEffect, useState } from "react";
import api from "../api/axios";

function POSPage() {
  const [tables, setTables] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [cart, setCart] = useState([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const tablesRes = await api.get("/tables");
    const menuRes = await api.get("/menu");

    setTables(tablesRes.data);
    setMenu(menuRes.data);
  };

  const addToCart = (item) => {
    const existing = cart.find((c) => c.menuItem === item._id);

    if (existing) {
      setCart(
        cart.map((c) =>
          c.menuItem === item._id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    } else {
      setCart([
        ...cart,
        {
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ]);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const createOrder = async () => {
    if (!selectedTable) {
      alert("Please select a table");
      return;
    }

    if (cart.length === 0) {
      alert("Please add food items");
      return;
    }

    await api.post("/orders", {
      tableId: selectedTable,
      items: cart.map((item) => ({
        menuItem: item.menuItem,
        quantity: item.quantity,
      })),
      note,
    });

    alert("Order sent to kitchen");

    setCart([]);
    setSelectedTable("");
    setNote("");
    fetchData();
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">POS Order Screen</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Menu Items</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menu.map((item) => (
              <button
                key={item._id}
                onClick={() => addToCart(item)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left hover:border-orange-500 transition"
              >
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-slate-400">{item.category}</p>
                <p className="text-orange-400 font-bold mt-3">
                  Rs. {item.price}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Current Order</h2>

          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 mb-4"
          >
            <option value="">Select Table</option>
            {tables.map((table) => (
              <option key={table._id} value={table._id}>
                Table {table.tableNumber} - {table.status}
              </option>
            ))}
          </select>

          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div
                key={item.menuItem}
                className="flex justify-between border-b border-slate-800 pb-2"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>Rs. {item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Order note..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 mb-4"
          />

          <div className="flex justify-between text-xl font-bold mb-6">
            <span>Total</span>
            <span className="text-green-400">Rs. {total}</span>
          </div>

          <button
            onClick={createOrder}
            className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-bold"
          >
            Send Order to Kitchen
          </button>
        </div>
      </div>
    </div>
  );
}

export default POSPage;
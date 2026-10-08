import { useEffect, useState } from "react";
import api from "../api/axios";

function TablesPage() {
  const [tables, setTables] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    tableNumber: "",
    capacity: "",
    status: "free",
    location: "Main Hall",
  });

  const fetchTables = async () => {
    const { data } = await api.get("/tables");
    setTables(data);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      tableNumber: "",
      capacity: "",
      status: "free",
      location: "Main Hall",
    });
  };

  const submitTable = async (e) => {
    e.preventDefault();

    const payload = {
      tableNumber: Number(form.tableNumber),
      capacity: Number(form.capacity),
      status: form.status,
      location: form.location,
    };

    if (editingId) {
      await api.put(`/tables/${editingId}`, payload);
      alert("Table updated");
    } else {
      await api.post("/tables", payload);
      alert("Table added");
    }

    resetForm();
    fetchTables();
  };

  const startEdit = (table) => {
    setEditingId(table._id);
    setForm({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      status: table.status,
      location: table.location,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteTable = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this table?");
    if (!confirmDelete) return;

    await api.delete(`/tables/${id}`);
    fetchTables();
  };

  const getStatusClass = (status) => {
    if (status === "free")
      return "bg-green-500/20 text-green-400 border-green-500";
    if (status === "occupied")
      return "bg-red-500/20 text-red-400 border-red-500";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500";
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Restaurant Tables</h1>

      <form
        onSubmit={submitTable}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <h2 className="text-2xl font-bold md:col-span-4">
          {editingId ? "Edit Table" : "Add Table"}
        </h2>

        <input
          name="tableNumber"
          value={form.tableNumber}
          onChange={handleChange}
          type="number"
          placeholder="Table Number"
          className="bg-slate-800 p-3 rounded-lg"
          required
        />

        <input
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          type="number"
          placeholder="Capacity"
          className="bg-slate-800 p-3 rounded-lg"
          required
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="bg-slate-800 p-3 rounded-lg"
        >
          <option value="free">Free</option>
          <option value="occupied">Occupied</option>
          <option value="reserved">Reserved</option>
        </select>

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="bg-slate-800 p-3 rounded-lg"
        />

        <div className="md:col-span-4 flex gap-3">
          <button className="bg-orange-500 hover:bg-orange-600 py-3 px-6 rounded-lg font-bold">
            {editingId ? "Update Table" : "Add Table"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-slate-700 hover:bg-slate-600 py-3 px-6 rounded-lg font-bold"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div
            key={table._id}
            className="bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Table {table.tableNumber}</h2>

              <span
                className={`px-3 py-1 rounded-full text-sm border ${getStatusClass(
                  table.status
                )}`}
              >
                {table.status}
              </span>
            </div>

            <p className="text-slate-400 mb-2">Capacity: {table.capacity}</p>
            <p className="text-slate-400 mb-4">Location: {table.location}</p>

            <div className="flex gap-3">
              <button
                onClick={() => startEdit(table)}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTable(table._id)}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TablesPage;
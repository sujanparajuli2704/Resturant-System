import { useEffect, useState } from "react";
import api from "../api/axios";

function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });

  const fetchMenu = async () => {
    const { data } = await api.get("/menu");
    setMenu(data);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      price: "",
      description: "",
      image: "",
    });
    setEditingId(null);
  };

  const submitMenu = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
    };

    if (editingId) {
      await api.put(`/menu/${editingId}`, payload);
      alert("Menu item updated");
    } else {
      await api.post("/menu", payload);
      alert("Menu item added");
    }

    resetForm();
    fetchMenu();
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || "",
      image: item.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteItem = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this menu item?");
    if (!confirmDelete) return;

    await api.delete(`/menu/${id}`);
    fetchMenu();
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Restaurant Menu</h1>

      <form
        onSubmit={submitMenu}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <h2 className="text-2xl font-bold md:col-span-2">
          {editingId ? "Edit Menu Item" : "Add Menu Item"}
        </h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Food name"
          className="bg-slate-800 p-3 rounded-lg"
          required
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="bg-slate-800 p-3 rounded-lg"
          required
        />

        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          type="number"
          className="bg-slate-800 p-3 rounded-lg"
          required
        />

        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="bg-slate-800 p-3 rounded-lg"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="bg-slate-800 p-3 rounded-lg md:col-span-2"
        />

        <div className="md:col-span-2 flex gap-3">
          <button className="bg-orange-500 hover:bg-orange-600 py-3 px-6 rounded-lg font-bold">
            {editingId ? "Update Menu Item" : "Add Menu Item"}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item) => (
          <div
            key={item._id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-5">
              <h2 className="text-2xl font-bold mb-2">{item.name}</h2>

              <p className="text-slate-400 mb-2">Category: {item.category}</p>
              <p className="text-slate-400 mb-4">{item.description}</p>

              <p className="text-2xl font-bold text-orange-400 mb-4">
                Rs. {item.price}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(item)}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteItem(item._id)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuPage;
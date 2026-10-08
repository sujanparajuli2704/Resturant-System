import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import TablesPage from "./pages/TablesPage";
import KitchenPage from "./pages/KitchenPage";
import MenuPage from "./pages/MenuPage";
import POSPage from "./pages/POSPage";
import BillingPage from "./pages/BillingPage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-950 text-white">
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6">
          <h1 className="text-2xl font-bold mb-10 text-orange-400">
            Restaurant POS
          </h1>

          <nav className="flex flex-col gap-4">
            <Link to="/" className="hover:bg-slate-800 px-4 py-3 rounded-lg transition">
              Dashboard
            </Link>

            <Link to="/pos" className="hover:bg-slate-800 px-4 py-3 rounded-lg transition">
              POS Order
            </Link>

            <Link to="/menu" className="hover:bg-slate-800 px-4 py-3 rounded-lg transition">
              Menu
            </Link>

            <Link to="/tables" className="hover:bg-slate-800 px-4 py-3 rounded-lg transition">
              Tables
            </Link>

            <Link to="/kitchen" className="hover:bg-slate-800 px-4 py-3 rounded-lg transition">
              Kitchen / KOT
            </Link>

            <Link to="/billing" className="hover:bg-slate-800 px-4 py-3 rounded-lg transition">
  Billing
</Link>

          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/pos" element={<POSPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/kitchen" element={<KitchenPage />} />
            <Route path="/billing" element={<BillingPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
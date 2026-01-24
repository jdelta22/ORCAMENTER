import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: 220, padding: 20, width: "100%" }}>
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;

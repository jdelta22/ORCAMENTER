import Sidebar from "../components/Sidebar";
import MobileMenuButton from "../components/MobileMenuButton";
import Overlay from "../components/Overlay";
import "./DashboardLayout.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="app-layout">
      <MobileMenuButton />
      <Sidebar />
      <Overlay />
      <main className="app-content">{children}</main>
    </div>
  );
}

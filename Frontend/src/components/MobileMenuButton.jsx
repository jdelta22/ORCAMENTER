import { useSidebar } from "../context/SidebarContext";
import "./menu.css";

export default function MobileMenuButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <button className="menu-btn" onClick={toggleSidebar}>
      ☰
    </button>
  );
}

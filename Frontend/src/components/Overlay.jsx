import { useSidebar } from "../context/SidebarContext";

export default function Overlay() {
  const { open, closeSidebar } = useSidebar();

  return <div className={`overlay ${open ? "show" : ""}`} />;
}

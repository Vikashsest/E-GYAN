
import "./loader.css";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <span className="loader"></span>
    </div>
  );
}

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

function QRScanner({ onResult, onClose }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        onResult(decodedText);
        scanner.clear();
        onClose();
      },
      (error) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-80">
        <div id="qr-reader" />
        <button
          onClick={onClose}
          className="mt-3 w-full bg-red-600 text-white py-1 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default QRScanner;

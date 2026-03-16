import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options
        className: "",
        duration: 5000,
        style: {
          background: "#333",
          color: "#fff",
        },
      }}
    />
  );
}

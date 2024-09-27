import { Toaster } from "react-hot-toast";
import { Sidebar } from "./Sidebar";
// import { Navbar } from "./Navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      <div className="flex flex-col bg-black text-white">
        {/* <Navbar /> */}
        <Sidebar />

        <div className="min-h-screen items-center p-24 flex flex-col gap-6">
          {children}
        </div>
      </div>
    </>
  );
};

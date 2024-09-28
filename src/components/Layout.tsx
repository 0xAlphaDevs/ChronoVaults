import { Toaster } from "react-hot-toast";
// import { Sidebar } from "./Sidebar";
// import { Navbar } from "./Navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      <div className="flex flex-col bg-black text-white">
        {/* <Navbar /> */}
        {/* <Sidebar /> */}
        {/* <div className="min-h-screen col-start-3 col-end-13 pr-10 pl-96 py-10 flex flex-col gap-4">
          {children}
        </div> */}
        <div className="min-h-screen">
          {children}
        </div>
      </div>
    </>
  );
};

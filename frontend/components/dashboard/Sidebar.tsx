import { useState } from "react";
import { AiTwotoneHome } from "react-icons/ai";
import { HiMenuAlt1 } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { BsFillInboxesFill } from "react-icons/bs";
import { BiLogOut, BiTimer } from "react-icons/bi";

interface ISidebarProps {
  clinic?: any;
}

export default function Sidebar({ clinic }: ISidebarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const logOut = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex">
      <div
        className={` ${
          open ? "w-40" : "w-60 "
        } flex flex-col h-screen p-3 bg-gray-800 shadow duration-300`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{clinic?.name}</h2>
            <button onClick={() => setOpen(!open)}>
              <HiMenuAlt1 className="w-6 h-6 text-gray-100" />
            </button>
          </div>
          <div className="flex-1">
            <ul className="pt-2 pb-4 space-y-1 text-sm">
              <li className="rounded-sm hover:bg-slate-700">
                <a
                  className="flex items-center p-2 space-x-3 rounded-md cursor-pointer"
                  onClick={() => router.push("/dashboard")}
                >
                  <AiTwotoneHome className="w-6 h-6 text-gray-100" />
                  <span className="text-gray-100">Inicio</span>
                </a>
              </li>
              <li className="rounded-sm hover:bg-slate-700">
                <a
                  className="flex items-center p-2 space-x-3 rounded-md cursor-pointer"
                  onClick={() => router.push("/dashboard/requests")}
                >
                  <BsFillInboxesFill className="w-6 h-6 text-gray-100" />
                  <span className="text-gray-100">Solicitudes Recibidas</span>
                </a>
              </li>
              <li className="rounded-sm hover:bg-slate-700">
                <a
                  className="flex items-center p-2 space-x-3 rounded-md cursor-pointer"
                  onClick={() => router.push("/dashboard/orders")}
                >
                  <BiTimer className="w-6 h-6 text-gray-100" />
                  <span className="text-gray-100">Solicitudes Realizadas</span>
                </a>
              </li>
              <li className="rounded-sm hover:bg-slate-700">
                <a
                  className="flex items-center p-2 space-x-3 rounded-md cursor-pointer"
                  onClick={logOut}
                >
                  <BiLogOut className="w-6 h-6 text-gray-100" />
                  <span className="text-gray-100">Cerrar Sesión</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { useRouter } from "next/navigation";
import RequestsService from "@/services/requests/requests.service";
import Sidebar from "@/components/dashboard/Sidebar";
import { IoMdArrowBack } from "react-icons/io";

interface IRequests {
  id: number;
  created_at: string;
  message: string;
  file_url: string;
  status: string;
  transmitter_clinic_id: number;
  receiver_clinic_id: number;
  patient_id: number;
}
const page = () => {
  const [recievedRequests, setRecievedRequests] = React.useState<IRequests[]>(
    []
  );
  const router = useRouter();

  React.useEffect(() => {
    RequestsService.getRequests().then((res) => {
      setRecievedRequests(res.data.receivedRequests);
    });
  }, []);

  return (
    <div className="flex w-screen bg-white">
      <Sidebar />
      <div className="container p-5 bg-white w-100">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center">
            <IoMdArrowBack
              className="text-2xl text-gray-500 cursor-pointer"
              onClick={() => router.back()}
            />
            <h2 className="ml-2 text-2xl font-bold text-gray-800">
              Solicitudes Recibidas
            </h2>
          </div>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3">
                  Mensaje
                </th>
                <th scope="col" className="px-6 py-3">
                  Clinica
                </th>
                <th scope="col" className="px-6 py-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {recievedRequests.length > 0 ? (
                recievedRequests.map((request) => (
                  <tr key={request.id} className="bg-white border-b">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {request.created_at}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {request.message}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {request.transmitter_clinic_id}
                    </td>
                    <td className="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap">
                      <button
                        className="px-4 py-2 text-white bg-gray-800 rounded hover:bg-gray-700"
                        onClick={() =>
                          router.push(`/dashboard/request/${request.id}`)
                        }
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center">
                  <td className="px-4 py-2 text-gray-900">
                    No hay solicitudes recibidas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default page;

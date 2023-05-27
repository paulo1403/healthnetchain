"use client";
import React from "react";
import { useRouter } from "next/navigation";
import RequestsService from "@/services/requests/requests.service";
import Sidebar from "@/components/dashboard/Sidebar";

interface IUser {
  username: string;
}

interface IClicnic {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
}

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
  const router = useRouter();
  const [user, setUser] = React.useState<IUser>();
  const [clinic, setClinic] = React.useState<IClicnic>();
  const [receivedRequests, setReceivedRequests] = React.useState<IRequests[]>(
    []
  );
  const [transmittedRequests, setTransmittedRequests] = React.useState<
    IRequests[]
  >([]);

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    const clinic = user.clinic;
    if (user) {
      setUser(user);
      setClinic(clinic);
      0;
    } else {
      router.push("/login");
    }
  }, []);

  React.useEffect(() => {
    RequestsService.getRequests().then((res) => {
      setReceivedRequests(res.data.receivedRequests);
      setTransmittedRequests(res.data.transmittedRequests);
    });
  }, []);

  return (
    <div className="flex w-screen bg-white">
      <Sidebar clinic={clinic} />
      <div className="container p-5 bg-white w-100">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-gray-800">
            Panel Administrativo
          </h2>
          <img
            src={clinic?.logo || "/clinic.png"}
            alt="Clinic Logo"
            width={150}
            height={150}
          />
        </div>
        <div className="">
          <h2 className="mt-10 font-bold text-gray-800 text-1xl">
            Lista de Solicitudes Recibidas
          </h2>
        </div>
        <table className="w-full mt-10 mb-10 table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Mensaje</th>
              <th className="px-4 py-2">Clinica</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-4 py-2 border">{request.created_at}</td>
                  <td className="px-4 py-2 border">{request.message}</td>
                  <td className="px-4 py-2 border">
                    {request.transmitter_clinic_id}
                  </td>
                  <td className="px-4 py-2 text-center border">
                    <button
                      className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-700"
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
                <td className="px-4 py-2 border">
                  No hay solicitudes recibidas
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between">
          <h2 className="mt-10 font-bold text-gray-800 text-1xl">
            Lista de Solicitudes Realizadas
          </h2>
          <button
            className="px-4 text-white bg-indigo-500 rounded hover:bg-indigo-700"
            onClick={() => router.push("/dashboard/request")}
          >
            Nueva Solicitud
          </button>
        </div>
        <table className="w-full mt-10 table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Mensaje</th>
              <th className="px-4 py-2">Clinica</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transmittedRequests.length > 0 ? (
              transmittedRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-4 py-2 border">{request.created_at}</td>
                  <td className="px-4 py-2 border">{request.message}</td>
                  <td className="px-4 py-2 border">
                    {request.transmitter_clinic_id}
                  </td>
                  <td className="px-4 py-2 text-center border">
                    <button
                      className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-700"
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
                <td className="px-4 py-2 border">
                  No hay solicitudes recibidas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default page;

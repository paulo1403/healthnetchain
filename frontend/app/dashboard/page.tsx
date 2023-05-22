"use client";
import React from "react";
import { useRouter } from "next/navigation";
import RequestsService from "@/services/requests/requests.service";

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

  const logOut = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  React.useEffect(() => {
    RequestsService.getRequests().then((res) => {
      setReceivedRequests(res.data.receivedRequests);
      setTransmittedRequests(res.data.transmittedRequests);
    });
  }, []);

  return (
    <div className="flex justify-center items-center flex-column h-screen bg-gray-200">
      <div className="bg-white p-16 rounded shadow-2xl w-2/3">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800">
            Dashboard - {clinic?.name}
          </h2>
          <img
            src={clinic?.logo || "/clinic.png"}
            alt="Clinic Logo"
            width={150}
            height={150}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-indigo-500 rounded-full h-8 w-8"></div>
            <div className="ml-4 text-gray-700 font-bold">{user?.username}</div>
          </div>
          <button
            className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-700"
            onClick={logOut}
          >
            Cerrar Sesión
          </button>
        </div>
        <div className="">
          <h2 className="text-1xl font-bold text-gray-800 mt-10">
            Lista de Solicitudes Recibidas
          </h2>
        </div>
        <table className="table-auto w-full mt-10 mb-10">
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
                  <td className="border px-4 py-2">{request.created_at}</td>
                  <td className="border px-4 py-2">{request.message}</td>
                  <td className="border px-4 py-2">
                    {request.transmitter_clinic_id}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-700"
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
                <td className="border px-4 py-2">
                  No hay solicitudes recibidas
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between">
          <h2 className="text-1xl font-bold text-gray-800 mt-10">
            Lista de Solicitudes Realizadas
          </h2>
          <button
            className="bg-indigo-500 text-white px-4 rounded hover:bg-indigo-700"
            onClick={() => router.push("/dashboard/request")}
          >
            Nueva Solicitud
          </button>
        </div>
        <table className="table-auto w-full mt-10">
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
                  <td className="border px-4 py-2">{request.created_at}</td>
                  <td className="border px-4 py-2">{request.message}</td>
                  <td className="border px-4 py-2">
                    {request.transmitter_clinic_id}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-700"
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
                <td className="border px-4 py-2">
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

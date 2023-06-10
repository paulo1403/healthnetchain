"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import RequestsService from "@/services/requests/requests.service";
import PatientService from "@/services/patient/patient.service";
import FileStorageService from "@/services/file/file.service";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";

interface IRequests {
  id: number;
  created_at: string;
  message: string;
  file_url: string;
  status: string;
  transmitter_clinic_id: number;
  receiver_clinic_id: number;
  patient_id: string;
}

interface IPatient {
  id: number;
  name: string;
  surname: string;
  document_number: string;
}

const Request = () => {
  const { id } = useParams();
  const [request, setRequest] = React.useState<IRequests>();
  const [patient, setPatient] = React.useState<IPatient>();
  const [message, setMessage] = React.useState<string>("");
  const [clinic, setClinic] = React.useState<any>();
  const router = useRouter();

  const getClinicIdLocalStorage = () => {
    const clinic = localStorage.getItem("user");
    if (clinic) {
      setClinic(JSON.parse(clinic).clinic.id);
    }
  };

  useEffect(() => {
    RequestsService.getRequestById(id).then((res) => {
      setRequest(res.data.data);
    });
  }, []);

  useEffect(() => {
    getClinicIdLocalStorage();
    if (request) {
      PatientService.getPatientById(request.patient_id).then((res) => {
        setPatient(res.data.data);
      });
    }
  }, [request]);

  const handleDownloadRequestFile = (file: any) => {
    const url = file.replace("uploads", "");
    const filename = url.substring(1);
    FileStorageService.downloadFile(filename);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200 flex-column">
      <div className="w-2/3 p-16 bg-white rounded shadow-2xl">
        <div className="flex cursor-pointer" onClick={() => router.back()}>
          <BiArrowBack className="text-2xl" />
          <span>Volver</span>
        </div>
        <h2 className="mb-4 text-2xl font-bold">Petición {id}</h2>
        <div className="flex gap-2">
          <div className="flex flex-col items-start w-full gap-2 mb-3">
            <h3 className="text-lg font-bold text-left">Datos del paciente</h3>
            <table className="table-auto">
              <tbody>
                <tr>
                  <th className="py-2 text-left">Nombre</th>
                  <td className="px-4 py-2">{patient?.name}</td>
                </tr>
                <tr>
                  <th className="py-2 text-left">Apellido</th>
                  <td className="px-4 py-2">{patient?.surname}</td>
                </tr>
                <tr>
                  <th className="py-2 text-left">Documento</th>
                  <td className="px-4 py-2">{patient?.document_number}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-start w-full gap-2">
            <h3 className="text-lg font-bold text-left">
              Datos de la solicitud
            </h3>
            <table className="table-auto">
              <tbody>
                <tr>
                  <th className="py-2 text-left">Fecha</th>
                  <td className="px-4 py-2">{request?.created_at}</td>
                </tr>
                <tr>
                  <th className="py-2 text-left">Mensaje</th>
                  <td className="px-4 py-2">{request?.message}</td>
                </tr>
                <tr>
                  <th className="py-2 text-left">Archivo</th>
                  <td className="px-4 py-2">
                    <a
                      target="_blank"
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() =>
                        handleDownloadRequestFile(request?.file_url)
                      }
                    >
                      {request?.file_url}
                    </a>
                  </td>
                </tr>
                <tr>
                  <th className="py-2 text-left">Estado</th>
                  <td className="px-4 py-2">
                    {request?.status === "PENDIENTE" ? (
                      <span className="text-yellow-500">Pendiente</span>
                    ) : request?.status === "APROBADO" ? (
                      <span className="text-green-500">Aceptado</span>
                    ) : (
                      <span className="text-red-500">Rechazado</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {clinic === request?.receiver_clinic_id &&
        request?.status === "PENDIENTE" ? (
          <div className="flex flex-row items-center w-full gap-2">
            <button
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              onClick={() => {
                RequestsService.updateRequest(id, "APPROVED").then((res) => {
                  setMessage("El request ha sido aceptado correctamente");
                });
              }}
            >
              Aceptar
            </button>
            <button
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
              onClick={() => {
                RequestsService.updateRequest(id, "DENIED").then((res) => {
                  setMessage("El request ha sido rechazado correctamente");
                });
              }}
            >
              Rechazar
            </button>
          </div>
        ) : (
          <></>
        )}
        {message.includes("aceptado") ? (
          <div
            className="p-4 mt-4 text-green-700 bg-orange-100 border-l-4 border-green-500"
            role="alert"
          >
            <p className="font-bold">Felicidades</p>
            <p>{message}</p>
          </div>
        ) : message.includes("rechazado") ? (
          <div
            className="p-4 mt-4 text-red-700 bg-red-100 border-l-4 border-red-500"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{message}</p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Request;

"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import RequestsService from "@/services/requests/requests.service";
import PatientService from "@/services/patient/patient.service";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    RequestsService.getRequestById(id).then((res) => {
      setRequest(res.data.data);
    });
  }, []);

  useEffect(() => {
    if (request) {
      PatientService.getPatientById(request.patient_id).then((res) => {
        setPatient(res.data.data);
      });
    }
  }, [request]);

  return (
    <div className="flex justify-center items-center flex-column h-screen bg-gray-200">
      <div className="bg-white p-16 rounded shadow-2xl w-2/3">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-4">Request {id}</h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.back()}
          >
            Volver
          </button>
          <div className="flex flex-col items-start w-full gap-2 mb-3">
            <h3 className="text-left text-1xl font-bold">Datos del paciente</h3>
            <div className="flex flex-row gap-2 items-center w-full">
              <label className="text-black text-sm font-medium">Nombre</label>
              <input
                type="text"
                className="border rounded p-2"
                value={patient?.name}
                disabled
              />
            </div>
            <div className="flex flex-row gap-2 items-center w-full">
              <label className="text-black text-sm font-medium">Apellido</label>
              <input
                type="text"
                className="border rounded p-2"
                value={patient?.surname}
                disabled
              />
            </div>
            <div className="flex flex-row gap-2 items-center w-full">
              <label className="text-black text-sm font-medium">
                Documento
              </label>
              <input
                type="text"
                className="border rounded p-2"
                value={patient?.document_number}
                disabled
              />
            </div>
          </div>
          <div className="flex flex-col items-start w-full gap-2">
            <h3 className="text-left text-1xl font-bold">
              Datos de la solicitud
            </h3>
            <div className="flex flex-row gap-2 items-center w-full">
              <label className="text-black text-sm font-medium">Mensaje</label>
              <textarea
                className="border rounded p-2"
                value={request?.message}
                disabled
              />
            </div>
            <div className="flex flex-row gap-2 items-center w-full">
              <label className="text-black text-sm font-medium">Archivo</label>
              <a
                href={request?.file_url}
                target="_blank"
                className="text-blue-500 underline"
              >
                Ver archivo
              </a>
            </div>
            <div className="flex flex-row gap-2 items-center w-full">
              <label className="text-black text-sm font-medium">Estado</label>
              {request?.status === "pending" ? (
                <span className="text-yellow-500">Pendiente</span>
              ) : request?.status === "accepted" ? (
                <span className="text-green-500">Aceptado</span>
              ) : (
                <span className="text-red-500">Rechazado</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Request;

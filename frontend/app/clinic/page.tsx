"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ClinicsService from "@/services/clinics/clinics.service";
import AuthService from "@/services/auth/auth.service";
import RegisterClinicModal from "./RegisterClinicModal";

interface IClinic {
  clinic_id: number;
  clinic_name: string;
  clinic_address: string;
  clinic_phone: string;
  clinic_email: string;
  clinic_website: string;
  clinic_logo: string;
}

const ClinicsDashboard = () => {
  const [clinics, setClinics] = React.useState<IClinic[]>([]);
  const [showModalClinic, setShowModalClinic] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    ClinicsService.getClinicsAll().then((response) => {
      setClinics(response.data.data);
    });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-16 rounded shadow-2xl w-2/3">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">
            Lista de Clínicas
          </h2>
          <button
            className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-700"
            onClick={() => router.push("/login")}
          >
            Ir a login
          </button>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-indigo-500 rounded-full h-8 w-8"></div>
            <div className="ml-4 text-gray-700 font-bold">Clinic Name</div>
          </div>
          <button
            className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-700"
            onClick={() => setShowModalClinic(true)}
          >
            Registrar Clínica
          </button>
        </div>
        <table className="table-auto w-full mt-3">
          <thead>
            <tr>
              <th className="px-4 py-2 text-black">Nombre</th>
              <th className="px-4 py-2 text-black">Dirección</th>
              <th className="px-4 py-2 text-black">Teléfono</th>
              <th className="px-4 py-2 text-black">Email</th>
              <th className="px-4 py-2 text-black">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map((clinic) => (
              <tr key={clinic.clinic_id}>
                <td className="border px-4 py-2 text-gray-700">
                  {clinic.clinic_name}
                </td>
                <td className="border px-4 py-2 text-gray-700">
                  {clinic.clinic_address}
                </td>
                <td className="border px-4 py-2 text-gray-700">
                  {clinic.clinic_phone}
                </td>
                <td className="border px-4 py-2 text-gray-700">
                  {clinic.clinic_email}
                </td>
                <td className="border px-4 py-2 text-gray-700">
                  <button
                    className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-700"
                    onClick={() => router.push(`/clinics/${clinic.clinic_id}`)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <RegisterClinicModal
        showModal={showModalClinic}
        setShowModal={setShowModalClinic}
      />
    </div>
  );
};

export default ClinicsDashboard;

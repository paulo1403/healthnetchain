"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ClinicsService from "@/services/clinics/clinics.service";
import AuthService from "@/services/auth/auth.service";
import RegisterClinicModal from "../../components/clinic/RegisterClinicModal";

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
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="w-2/3 p-16 bg-white rounded shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="mb-10 text-3xl font-bold text-gray-800">
            Lista de Clínicas
          </h2>
          <button
            className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-700"
            onClick={() => router.push("/login")}
          >
            Ir a login
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
            <div className="ml-4 font-bold text-gray-700">Clinic Name</div>
          </div>
          <button
            className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-700"
            onClick={() => setShowModalClinic(true)}
          >
            Registrar Clínica
          </button>
        </div>
        <table className="w-full mt-3 table-auto">
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
                <td className="px-4 py-2 text-gray-700 border">
                  {clinic.clinic_name}
                </td>
                <td className="px-4 py-2 text-gray-700 border">
                  {clinic.clinic_address}
                </td>
                <td className="px-4 py-2 text-gray-700 border">
                  {clinic.clinic_phone}
                </td>
                <td className="px-4 py-2 text-gray-700 border">
                  {clinic.clinic_email}
                </td>
                <td className="px-4 py-2 text-gray-700 border">
                  <button
                    className="px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-700"
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

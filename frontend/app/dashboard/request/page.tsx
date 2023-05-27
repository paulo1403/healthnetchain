"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import RequestsService from "@/services/requests/requests.service";
import ClinicsService from "@/services/clinics/clinics.service";
import FileStorageService from "@/services/file/file.service";

interface IClinic {
  clinic_id: number;
  clinic_name: string;
  clinic_address: string;
  clinic_phone: string;
  clinic_email: string;
  clinic_website: string;
  clinic_logo: string;
}

const RequestPage = () => {
  const router = useRouter();
  const [clinics, setClinics] = React.useState<IClinic[]>([]);
  const [image, setImage] = React.useState<any>("");
  const [messageFile, setMessageFile] = React.useState("");

  const formik = useFormik({
    initialValues: {
      receiver_clinic_id: 0,
      message: "",
      file_url: undefined,
      patient_name: "",
      patient_surname: "",
      patient_dni: "",
    },
    validationSchema: Yup.object({
      /* receiver_clinic_id: Yup.string().required("Required"),
      message: Yup.string().required("Required"),
      file_url: Yup.string().required("Required"),
      patient_name: Yup.string().required("Required"),
      patient_surname: Yup.string().required("Required"),
      patient_dni: Yup.string().required("Required"), */
    }),
    onSubmit: (values) => {
      FileStorageService.uploadFile(image).then((res) => {
        console.log(res.data);
      });
      console.log(values);
      /* RequestsService.registerRequest(
        values.receiver_clinic_id,
        values.message,
        values.file_url,
        values.patient_name,
        values.patient_surname,
        values.patient_dni
      ).then((res) => {
        router.push("/dashboard");
      }); */
    },
  });

  React.useEffect(() => {
    ClinicsService.getClinics().then((res) => {
      setClinics(res.data.data);
    });
  }, []);

  const handleFileChange = (e: any) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200 flex-column">
      <div className="w-2/3 p-16 bg-white rounded shadow-2xl">
        <h3 className="font-bold text-left text-1xl">Nueva Solicitud</h3>
        <button
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={() => router.back()}
        >
          Volver
        </button>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col items-start w-full gap-2 mb-3">
            <label className="text-sm font-medium text-black">
              Clinica Destino
            </label>
            <select
              id="receiver_clinic_id"
              name="receiver_clinic_id"
              onChange={formik.handleChange}
              value={formik.values.receiver_clinic_id}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
            >
              <option value="0">Seleccione una clinica</option>
              {clinics.map((clinic) => (
                <option key={clinic.clinic_id} value={clinic.clinic_id}>
                  {clinic.clinic_name}
                </option>
              ))}
            </select>
            {formik.errors.receiver_clinic_id &&
              formik.touched.receiver_clinic_id && (
                <span className="text-red-500">
                  {formik.errors.receiver_clinic_id}
                </span>
              )}
          </div>
          <div className="flex flex-col items-start w-full gap-2 mb-3">
            <label className="text-sm font-medium text-black">Mensaje</label>
            <textarea
              id="message"
              name="message"
              onChange={formik.handleChange}
              value={formik.values.message}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
            />
            {formik.errors.message && formik.touched.message && (
              <span className="text-red-500">{formik.errors.message}</span>
            )}
          </div>
          <div className="flex flex-col items-start w-full gap-2 mb-3">
            <label className="text-sm font-medium text-black">
              Pdf de la solicitud
            </label>
            <label className="text-sm font-medium text-black">
              Descargar formato de solicitud y subirlo con los datos del
              paciente autorizando la transferencia de datos
              <a className="text-blue-500" href="/termsandcond.pdf" download>
                {" "}
                Descargar
              </a>
            </label>
            <input
              id="file_url"
              name="file_url"
              type="file"
              onChange={handleFileChange}
              value={formik.values.file_url}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
            />
            {formik.errors.file_url && formik.touched.file_url && (
              <span className="text-red-500">{formik.errors.file_url}</span>
            )}
          </div>
          <div className="flex flex-col items-start w-full gap-2 mb-3">
            <label className="text-sm font-medium text-black">
              Nombre del paciente
            </label>
            <input
              id="patient_name"
              name="patient_name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.patient_name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
            />
            {formik.errors.patient_name && formik.touched.patient_name && (
              <span className="text-red-500">{formik.errors.patient_name}</span>
            )}
          </div>
          <div className="flex flex-col items-start w-full gap-2 mb-3">
            <label className="text-sm font-medium text-black">
              Apellido del paciente
            </label>
            <input
              id="patient_surname"
              name="patient_surname"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.patient_surname}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
            />
            {formik.errors.patient_surname &&
              formik.touched.patient_surname && (
                <span className="text-red-500">
                  {formik.errors.patient_surname}
                </span>
              )}
          </div>
          <div className="flex flex-col items-start w-full gap-2 mb-3">
            <label className="text-sm font-medium text-black">
              DNI del paciente
            </label>
            <input
              id="patient_dni"
              name="patient_dni"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.patient_dni}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-green-500"
            />
            {formik.errors.patient_dni && formik.touched.patient_dni && (
              <span className="text-red-500">{formik.errors.patient_dni}</span>
            )}
          </div>
          <div className="flex justify-center w-full">
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestPage;

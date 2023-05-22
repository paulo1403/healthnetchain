"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import ClinicsService from "@/services/clinics/clinics.service";
import AuthService from "@/services/auth/auth.service";
import { Modal, ModalFooter } from "@/components/Modal";

interface IClinicFormValues {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
}

interface IUser {
  id: number;
  username: string;
}

interface IRegisterClinicModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const RegisterClinicModal = ({
  showModal,
  setShowModal,
}: IRegisterClinicModalProps) => {
  const router = useRouter();
  const [message, setMessage] = React.useState("");
  const [users, setUsers] = React.useState<IUser[]>([]);

  const formik = useFormik({
    initialValues: {
      clinic_name: "",
      clinic_address: "",
      clinic_phone: "",
      clinic_email: "",
      clinic_website: "",
      clinic_logo: "",
      user: 0,
    },
    validationSchema: Yup.object({
      clinic_name: Yup.string().required("Required"),
      clinic_address: Yup.string().required("Required"),
      clinic_phone: Yup.string().required("Required"),
      clinic_email: Yup.string().required("Required"),
      clinic_website: Yup.string().required("Required"),
      clinic_logo: Yup.string().required("Required"),
      user: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      ClinicsService.register(
        values.clinic_name,
        values.clinic_address,
        values.clinic_phone,
        values.clinic_email,
        values.clinic_website,
        values.clinic_logo,
        values.user
      ).then(
        () => {
          setMessage("Registered successfully");
        },
        (error) => {
          setMessage("Failed to register.");
          console.log(error);
        }
      );
    },
  });

  React.useEffect(() => {
    AuthService.getUsersWithNoClinic().then((response) => {
      setUsers(response.data.data);
    });
  }, []);

  return (
    <Modal isOpen={showModal} setIsOpen={setShowModal} title="Register Clinic">
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label className="block mb-2 text-gray-800">Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:border-indigo-500 text-gray-800"
            name="clinic_name"
            value={formik.values.clinic_name}
            onChange={formik.handleChange}
          />
          {formik.errors.clinic_name && formik.touched.clinic_name && (
            <p className="text-red-600">{formik.errors.clinic_name}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-gray-800">Address</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:border-indigo-500 text-gray-800"
            name="clinic_address"
            value={formik.values.clinic_address}
            onChange={formik.handleChange}
          />
          {formik.errors.clinic_address && formik.touched.clinic_address && (
            <p className="text-red-600">{formik.errors.clinic_address}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-gray-800">Phone</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:border-indigo-500 text-gray-800"
            name="clinic_phone"
            value={formik.values.clinic_phone}
            onChange={formik.handleChange}
          />
          {formik.errors.clinic_phone && formik.touched.clinic_phone && (
            <p className="text-red-600">{formik.errors.clinic_phone}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-gray-800">Email</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:border-indigo-500 text-gray-800"
            name="clinic_email"
            value={formik.values.clinic_email}
            onChange={formik.handleChange}
          />
          {formik.errors.clinic_email && formik.touched.clinic_email && (
            <p className="text-red-600">{formik.errors.clinic_email}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-gray-800">Website</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:border-indigo-500 text-gray-800"
            name="clinic_website"
            value={formik.values.clinic_website}
            onChange={formik.handleChange}
          />
          {formik.errors.clinic_website && formik.touched.clinic_website && (
            <p className="text-red-600">{formik.errors.clinic_website}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-gray-800">Logo</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded outline-none focus:border-indigo-500 text-gray-800"
            name="clinic_logo"
            value={formik.values.clinic_logo}
            onChange={formik.handleChange}
          />
          {formik.errors.clinic_logo && formik.touched.clinic_logo && (
            <p className="text-red-600">{formik.errors.clinic_logo}</p>
          )}
        </div>
        <div>
          <label className="block mb-2 text-gray-800">User</label>
          <select
            className="w-full p-2 border border-gray-300 rounded outline-none focus:border-indigo-500 text-gray-800"
            name="user"
            value={formik.values.user}
            onChange={formik.handleChange}
          >
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <ModalFooter>
          <div className="flex justify-center items-center mt-6">
            <button
              type="button"
              className="py-3 px-6 bg-indigo-600 text-white rounded-full text-center"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 px-6 bg-indigo-600 text-white rounded-full text-center"
            >
              Register
            </button>
          </div>
        </ModalFooter>
        {message && (
          <div className="text-center mt-4">
            <p className="text-red-600">{message}</p>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default RegisterClinicModal;

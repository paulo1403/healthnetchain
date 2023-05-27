"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "@/services/auth/auth.service";

interface IFormValues {
  username: string;
  password: string;
  password2: string;
}

const Register = () => {
  const router = useRouter();
  const [message, setMessage] = React.useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      password2: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Se requiere un nombre de usuario"),
      password: Yup.string().required("Se requiere una contraseña"),
      password2: Yup.string().required("Se requiere una contraseña"),
    }),
    onSubmit: (values) => {
      setMessage("");
      if (values.password !== values.password2) {
        setMessage("La contraseña no coinciden");
      } else {
        AuthService.register(values.username, values.password).then(
          () => {
            setMessage("Registered successfully");
          },
          (error) => {
            setMessage("Failed to register.");
            console.log(error);
          }
        );
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="w-1/5 p-8 bg-white rounded shadow-2xl">
        <h2 className="mb-10 text-3xl font-bold text-gray-800">
          Registro de usuario
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label className="block mb-2 text-gray-800">Usuario</label>
            <input
              type="text"
              className="w-full p-2 text-gray-800 border border-gray-300 rounded outline-none focus:border-indigo-500"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
            {formik.errors.username && formik.touched.username && (
              <span className="text-red-500">{formik.errors.username}</span>
            )}
          </div>
          <div className="mt-4">
            <label className="block mb-2 text-gray-800">Contraseña</label>
            <input
              type="password"
              className="w-full p-2 text-gray-800 border border-gray-300 rounded outline-none focus:border-indigo-500"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {formik.errors.password && formik.touched.password && (
              <span className="text-red-500">{formik.errors.password}</span>
            )}
          </div>
          <div className="mt-4">
            <label className="block mb-2 text-gray-800">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              className="w-full p-2 text-gray-800 border border-gray-300 rounded outline-none focus:border-indigo-500"
              name="password2"
              value={formik.values.password2}
              onChange={formik.handleChange}
            />
            {formik.errors.password2 && formik.touched.password2 && (
              <span className="text-red-500">{formik.errors.password2}</span>
            )}
          </div>
          {message && (
            <div
              className="p-4 mt-4 text-orange-700 bg-orange-100 border-l-4 border-orange-500"
              role="alert"
            >
              <p className="font-bold">Error</p>
              <p>{message}</p>
            </div>
          )}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-700"
            >
              Registrar
            </button>
          </div>
          <div className="mt-4 text-center">
            <span className="text-gray-600">¿Ya tienes una cuenta? </span>
            <span
              className="text-blue-600 cursor-pointer hover:text-blue-800"
              onClick={() => router.push("/login")}
            >
              Iniciar Sesión
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

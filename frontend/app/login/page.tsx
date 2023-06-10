"use client";
import React from "react";
import AuthService from "@/services/auth/auth.service";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Se necesita un usuario"),
      password: Yup.string().required("Se necesita una contraseña"),
    }),
    onSubmit: (values) => {
      AuthService.login(values.username, values.password).then(
        () => {
          router.push("/dashboard");
        },
        (error) => {
          setMessage("Falló el inicio de sesión.");
          console.log(error);
        }
      );
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="p-8 bg-white rounded shadow-2xl w-96">
        <h2 className="mb-10 text-3xl font-bold text-gray-800">
          Iniciar Sesión
        </h2>
        <form>
          <div>
            <label className="block mb-2 text-gray-800">Usuario</label>
            <input
              type="text"
              className={
                "w-full p-2 text-gray-800 border border-gray-300 rounded outline-none focus:border-indigo-500" +
                (formik.errors.username && formik.touched.username
                  ? " border-red-500"
                  : "")
              }
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
              className={
                "w-full p-2 text-gray-800 border border-gray-300 rounded outline-none focus:border-indigo-500" +
                (formik.errors.password && formik.touched.password
                  ? " border-red-500"
                  : "")
              }
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {formik.errors.password && formik.touched.password && (
              <span className="text-red-500">{formik.errors.password}</span>
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
              className="w-full px-4 py-2 text-white bg-indigo-500 rounded hover:bg-indigo-700"
              onClick={formik.handleSubmit as any}
            >
              Iniciar Sesión
            </button>
          </div>
          <div className="mt-4 text-center">
            <span className="text-gray-600">¿No tienes una cuenta? </span>
            <span
              className="text-blue-600 cursor-pointer hover:text-blue-800"
              onClick={() => router.push("/register")}
            >
              Registrate aquí
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

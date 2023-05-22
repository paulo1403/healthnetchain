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
      username: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
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
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-16 rounded shadow-2xl w-2/3">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">Login</h2>
        <form>
          <div>
            <label className="block mb-2 text-gray-800">Username</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded outline-none focus:border-indigo-500 text-gray-800"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
            {formik.errors.username && formik.touched.username && (
              <span className="text-red-500">{formik.errors.username}</span>
            )}
          </div>
          <div className="mt-4">
            <label className="block mb-2 text-gray-800">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded outline-none focus:border-indigo-500 text-gray-800"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {formik.errors.password && formik.touched.password && (
              <span className="text-red-500">{formik.errors.password}</span>
            )}
          </div>
          <div className="mt-8">
            <button
              className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-700"
              onClick={formik.handleSubmit as any}
            >
              Login
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
          {message && (
            <div className="text-red-500 mt-4 text-center">{message}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;

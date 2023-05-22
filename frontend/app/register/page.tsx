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
      username: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
      password2: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      if (values.password !== values.password2) {
        setMessage("Passwords do not match");
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
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-16 rounded shadow-2xl w-2/3">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">Register</h2>
        <form onSubmit={formik.handleSubmit}>
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
          <div className="mt-4">
            <label className="block mb-2 text-gray-800">Confirm Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded outline-none focus:border-indigo-500 text-gray-800"
              name="password2"
              value={formik.values.password2}
              onChange={formik.handleChange}
            />
            {formik.errors.password2 && formik.touched.password2 && (
              <span className="text-red-500">{formik.errors.password2}</span>
            )}
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                            font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                            shadow-lg"
            >
              Register
            </button>
          </div>
          <div className="mt-4 text-center">
            <span className="text-gray-600">¿Ya tienes una cuenta? </span>
            <span
              className="text-blue-600 cursor-pointer hover:text-blue-800"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </div>

          {message && (
            <div className="mt-4">
              <span className="text-red-500">{message}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;

"use client";
import React from "react";
import { useRouter } from "next/navigation";
import RequestsService from "@/services/requests/requests.service";
import Sidebar from "@/components/dashboard/Sidebar";

interface IUser {
  username: string;
}

interface IClicnic {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
}
interface IRequests {
  id: number;
  created_at: string;
  message: string;
  file_url: string;
  status: string;
  transmitter_clinic_id: number;
  receiver_clinic_id: number;
  patient_id: number;
}

const page = () => {
  const router = useRouter();
  const [user, setUser] = React.useState<IUser>();
  const [clinic, setClinic] = React.useState<IClicnic>();

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    const clinic = user.clinic;
    if (user) {
      setUser(user);
      setClinic(clinic);
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <div className="flex w-screen bg-white">
      <Sidebar clinic={clinic} />
      <div className="container p-5 bg-white w-100">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-gray-800">
            Panel Administrativo
          </h2>
          <img
            src={clinic?.logo || "/clinic.png"}
            alt="Clinic Logo"
            width={150}
            height={150}
          />
        </div>
      </div>
    </div>
  );
};

export default page;

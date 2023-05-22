import axios from "axios";

const API_URL = "http://localhost:5000/api/";
let token = localStorage.getItem("user");
token = JSON.parse(localStorage.getItem("user") || "{}").token;

const ClinicsService = {
  getClinics: () => {
    return axios.get(API_URL + "clinics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  register: (
    clinic_name: string,
    clinic_address: string,
    clinic_phone: string,
    clinic_email: string,
    clinic_website: string,
    clinic_logo: string,
    user_id: number
  ) => {
    return axios.post(API_URL + "clinics", {
      clinic_name,
      clinic_address,
      clinic_phone,
      clinic_email,
      clinic_website,
      clinic_logo,
      user_id,
    });
  },
  getClinicsAll: () => {
    return axios.get(API_URL + "clinics/all");
  },
};

export default ClinicsService;

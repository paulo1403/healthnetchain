import axios from "axios";

const API_URL = "http://localhost:5000/api/";
let token = localStorage.getItem("user");
token = JSON.parse(localStorage.getItem("user") || "{}").token;

const RequestsService = {
  getRequests: () => {
    return axios.get(API_URL + "requests", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getRequestById: (id: string) => {
    return axios.get(API_URL + "requests/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  updateRequest: (id: string, status: string) => {
    return axios.put(
      API_URL + "requests/" + id + "?status=" + status,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  registerRequest: (
    receiver_clinic_id: number,
    message: string,
    image: any,
    patient_name: string,
    patient_surname: string,
    patient_dni: string
  ) => {
    let formData = new FormData();
    formData.append("file", image);
    formData.append("receiver_clinic_id", receiver_clinic_id.toString());
    formData.append("message", message);
    formData.append("patient[name]", patient_name);
    formData.append("patient[surname]", patient_surname);
    formData.append("patient[document_number]", patient_dni);
    return axios.post(API_URL + "requests", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default RequestsService;

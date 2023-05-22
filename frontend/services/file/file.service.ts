import axios from "axios";

const API_URL = "http://localhost:5000/api/";

let token = localStorage.getItem("user");
token = JSON.parse(localStorage.getItem("user") || "{}").token;

const FileStorageService = {
  upload: (file: any) => {
    let formData = new FormData();
    formData.append("file", file);
    return axios.post(API_URL + "file/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  download: (file: any) => {
    let formData = new FormData();
    formData.append("file", file);
    return axios.post(API_URL + "file/download", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default FileStorageService;

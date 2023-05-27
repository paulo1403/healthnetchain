import axios from "axios";

const API_URL = "http://localhost:5000/api/";

let token = localStorage.getItem("user");
token = JSON.parse(localStorage.getItem("user") || "{}").token;

const FileStorageService = {
  uploadFile: (file: any) => {
    let formData = new FormData();
    formData.append("file", file);
    return axios.post(API_URL + "file/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  downloadFile: (file: any) => {
    let formData = new FormData();
    formData.append("file", file);
    return axios.post(API_URL + "file/download", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  getFiles: () => {
    return axios.get(API_URL + "file/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  deleteFile: (file: any) => {
    return axios.delete(API_URL + "file/delete", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        file,
      },
    });
  },
};

export default FileStorageService;

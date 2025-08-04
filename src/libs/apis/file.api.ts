import axiosClient from '.';

const fileApi = {
  uploadFiles(files: File[]) {
    const formData = new FormData();

    files.forEach((file) => formData.append('files', file));

    return axiosClient.post<unknown, IBackendResponse<IMediaFile[]>>('/cloudinary/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadSingleFile(file: File) {
    const formData = new FormData();

    formData.append('file', file);

    return axiosClient.post<unknown, IBackendResponse<IMediaFile>>('/cloudinary/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default fileApi;

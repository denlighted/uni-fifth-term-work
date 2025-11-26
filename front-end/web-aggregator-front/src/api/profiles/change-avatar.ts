import api from "../axios";

export function changeAvatar(file:File){

    console.log("FILE FROM FRONT:", file);
    const formData = new FormData();
    formData.append('avatar',file);

    return api.post("/auth/avatar",formData);
}
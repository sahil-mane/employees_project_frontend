import axios from "axios"

export const useGetEmployees = async (search = "") => {
    const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/employees/get`,
        {
            search: search
        }
    );

    return res?.data?.data;
};
export const useAddEmployee = async (payload) => {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/employees`, payload)
    return res.data
}



export const useUpdateEmployee = async (id, data) => {

    const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/employees/${id}`,
        {
            ...data
        }
    );

    return response.data;
};
export const useDeleteEmloyee = async (id) => {
    const res = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/employees/${id}`)
    console.log(res)
    return res?.data
}
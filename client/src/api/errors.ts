import axios from "axios";

export const errorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error) && typeof error.response?.data === 'string') {
        return error.response.data;
    }
    return fallback;
};

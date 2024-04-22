import {toast} from 'react-toastify'
export function showSuccessToast(message){
    toast.success(message)
}
export function showErrorToast(error){
    if(error && error.response && error.response.data.message) toast.error(error.response.data.message)
    else toast.error('Terjadi Kesalahan Pada Server')
}
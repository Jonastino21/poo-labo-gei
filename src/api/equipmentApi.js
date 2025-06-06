import { api } from "../config"

export const fetchEquipments = async ()=>{
    const res = await api.get("/api/equipment");
    console.log(res.data)
}
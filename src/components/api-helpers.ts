import { BASE_URL } from '@/baseUrl'
import axios from 'axios'

export const fetchUrls = async () => {
  const { data } = await axios.get(`${BASE_URL}/urls/all`)
  return data
}

export const shortenUrl = async (longUrl: string) => {
  const data = { longUrl }
  const { data: response } = await axios.post(`${BASE_URL}/shorten`, data)
  return response
}

export const deleteUrl = async (shortCode: string) => {
  const { data: response } = await axios.delete(`${BASE_URL}/${shortCode}`)
  return response
}

import api from '@/lib/api'

export const fetchHome = async () => {
  const response = await api.get('/home')
  return response.data
}

// type Available values : truyen-moi, sap-ra-mat, dang-phat-hanh, hoan-thanh
// Default value : truyen-moi
export const fetchMangaList = async (page: number = 1, type: string = 'truyen-moi') => {
  const response = await api.get(`/danh-sach/${type}?page=${page}`)
  return response.data
}

export const fetchCategoryList = async () => {
  const response = await api.get('/the-loai')
  return response.data
}

export const fetchCategoryDetail = async (categorySlug: string, page: number = 1) => {
  const response = await api.get(`/the-loai/${categorySlug}?page=${page}`)
  return response.data
}

export const fetchMangaDetail = async (slug: string) => {
  const response = await api.get(`/truyen-tranh/${slug}`)
  return response.data
}


export const fetchSearch = async (keyword: string) => {
  const response = await api.get('/tim-kiem', {
    params: { keyword }
  })
  return response.data
}






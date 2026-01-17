
import api from '@/lib/api'
import { fetchCategoryDetail, fetchCategoryList, fetchHome, fetchMangaDetail, fetchMangaList, fetchSearch } from '@/lib/manga'
import { useQuery } from '@tanstack/react-query'

export interface Manga {
    _id: string
    name: string
    slug: string
    thumb_url: string
    updatedAt: string
    current_chapter?: {
        name: string
        id: string
    }[]
    author?: string[]
    content?: string
    status?: string
    chapters?: {
        server_name: string
        server_data: {
            filename: string
            chapter_name: string
            chapter_title: string
            chapter_api_data: string
        }[]
    }[]
}

export interface Chapter {
    _id: string
    chapter_name: string
    chapter_title: string
    chapter_path: string
    chapter_content: string // usually HTML or empty
    chapter_image: {
        image_page: number
        image_file: string
    }[]
    domain_cdn: string
}

export interface HomeResponse {
    status: string
    data: {
        items: Manga[]
        params: {
            pagination: {
                totalItems: number
                totalItemsPerPage: number
                currentPage: number
                totalPages: number
            }
        }
    }
}

export interface DetailResponse {
    status: string
    data: {
        item: Manga
    }
}

export interface SearchResponse {
    status: string
    data: {
        items: Manga[]
        params: {
            pagination: {
                totalItems: number
                totalItemsPerPage: number
                currentPage: number
                totalPages: number
            }
        }
    }
}

export interface CategoryListResponse {
    status: string
    data: {
        items: {
            _id: string
            name: string
            slug: string
        }[]
    }
}

export interface ChapterResponse {
    status: string
    data: {
        item: Chapter
        domain_cdn: string
    }
}

export const useHomeManga = (page = 1) => {
    return useQuery({
        queryKey: ['home-manga', page],
        queryFn: async () => {
            return fetchHome() as Promise<HomeResponse>
        },
    })
}

export const useMangaList = (page = 1, type = 'truyen-moi') => {
    return useQuery({
        queryKey: ['manga-list', type, page],
        queryFn: async () => {
            return fetchMangaList(page, type) as Promise<HomeResponse>
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export const useMangaDetail = (slug: string) => {
    return useQuery({
        queryKey: ['manga-detail', slug],
        queryFn: async () => {
            return fetchMangaDetail(slug) as Promise<DetailResponse>
        },
        enabled: !!slug,
    })
}

export const useSearchManga = (keyword: string) => {
    return useQuery({
        queryKey: ['search-manga', keyword],
        queryFn: async () => {
            return fetchSearch(keyword) as Promise<SearchResponse>
        },
        enabled: !!keyword && keyword.length >= 2,
        staleTime: 1000 * 60,
    })
}

export const useCategoryList = () => {
    return useQuery({
        queryKey: ['category-list'],
        queryFn: async () => {
            return fetchCategoryList() as Promise<CategoryListResponse>
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    })
}

export const useCategoryManga = (categorySlug: string, page = 1) => {
    return useQuery({
        queryKey: ['category-manga', categorySlug, page],
        queryFn: async () => {
            return fetchCategoryDetail(categorySlug, page) as Promise<SearchResponse>
        },
        enabled: !!categorySlug,
    })
}

export const useChapter = (chapterApiData: string) => {
    return useQuery({
        queryKey: ['chapter', chapterApiData],
        queryFn: async () => {
            const { data } = await api.get<ChapterResponse>(chapterApiData)
            return data
        },
        enabled: !!chapterApiData
    })
}

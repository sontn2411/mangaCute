import api from '@/lib/api'
import { fetchCategoryDetail, fetchCategoryList, fetchHome, fetchMangaDetail, fetchMangaList, fetchSearch } from '@/lib/manga'
import { useCallback, useEffect, useState } from 'react'


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
    const [data, setData] = useState<HomeResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [refreshIndex, setRefreshIndex] = useState(0)

    const refetch = useCallback(() => setRefreshIndex(prev => prev + 1), [])

    useEffect(() => {
        let mounted = true
        setIsLoading(true)
        fetchHome()
            .then(res => {
                if (mounted) setData(res as HomeResponse)
            })
            .catch(err => {
                if (mounted) setError(err)
            })
            .finally(() => {
                if (mounted) setIsLoading(false)
            })

        return () => { mounted = false }
    }, [page, refreshIndex])

    return { data, isLoading, isError: !!error, error, refetch }
}

export const useMangaList = (page = 1, type = 'truyen-moi') => {
    const [data, setData] = useState<HomeResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [refreshIndex, setRefreshIndex] = useState(0)

    const refetch = useCallback(() => setRefreshIndex(prev => prev + 1), [])

    useEffect(() => {
        let mounted = true
        setIsLoading(true)
        fetchMangaList(page, type)
            .then(res => {
                if (mounted) setData(res as HomeResponse)
            })
            .catch(err => {
                if (mounted) setError(err)
            })
            .finally(() => {
                if (mounted) setIsLoading(false)
            })

        return () => { mounted = false }
    }, [page, type, refreshIndex])

    return { data, isLoading, isError: !!error, error, refetch }
}

export const useMangaDetail = (slug: string) => {
    const [data, setData] = useState<DetailResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [refreshIndex, setRefreshIndex] = useState(0)

    const refetch = useCallback(() => setRefreshIndex(prev => prev + 1), [])

    useEffect(() => {
        if (!slug) return

        let mounted = true
        setIsLoading(true)
        fetchMangaDetail(slug)
            .then(res => {
                if (mounted) setData(res as DetailResponse)
            })
            .catch(err => {
                if (mounted) setError(err)
            })
            .finally(() => {
                if (mounted) setIsLoading(false)
            })

        return () => { mounted = false }
    }, [slug, refreshIndex])

    return { data, isLoading, isError: !!error, error, refetch }
}

export const useSearchManga = (keyword: string) => {
    const [data, setData] = useState<SearchResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!keyword || keyword.length < 2) {
            setData(null)
            return
        }

        let mounted = true
        setIsLoading(true)

        // Debounce could be added here, but keeping it simple for now
        const timeoutId = setTimeout(() => {
            fetchSearch(keyword)
                .then(res => {
                    if (mounted) setData(res as SearchResponse)
                })
                .catch(err => {
                    if (mounted) setError(err)
                })
                .finally(() => {
                    if (mounted) setIsLoading(false)
                })
        }, 500) // Simple debounce

        return () => {
            mounted = false
            clearTimeout(timeoutId)
        }
    }, [keyword])

    return { data, isLoading, isError: !!error, error }
}

export const useCategoryList = () => {
    const [data, setData] = useState<CategoryListResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        let mounted = true
        setIsLoading(true)
        fetchCategoryList()
            .then(res => {
                if (mounted) setData(res as CategoryListResponse)
            })
            .catch(err => {
                if (mounted) setError(err)
            })
            .finally(() => {
                if (mounted) setIsLoading(false)
            })

        return () => { mounted = false }
    }, [])

    return { data, isLoading, isError: !!error, error }
}

export const useCategoryManga = (categorySlug: string, page = 1) => {
    const [data, setData] = useState<SearchResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!categorySlug) return

        let mounted = true
        setIsLoading(true)
        fetchCategoryDetail(categorySlug, page)
            .then(res => {
                if (mounted) setData(res as SearchResponse)
            })
            .catch(err => {
                if (mounted) setError(err)
            })
            .finally(() => {
                if (mounted) setIsLoading(false)
            })

        return () => { mounted = false }
    }, [categorySlug, page])

    return { data, isLoading, isError: !!error, error }
}

export const useChapter = (chapterApiData: string) => {
    const [data, setData] = useState<ChapterResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!chapterApiData) return

        let mounted = true
        setIsLoading(true)
        api.get<ChapterResponse>(chapterApiData)
            .then(res => {
                if (mounted) setData(res.data)
            })
            .catch(err => {
                if (mounted) setError(err)
            })
            .finally(() => {
                if (mounted) setIsLoading(false)
            })

        return () => { mounted = false }
    }, [chapterApiData])

    return { data, isLoading, isError: !!error, error }
}

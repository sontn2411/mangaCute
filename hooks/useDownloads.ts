
import api from '@/lib/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as FileSystem from 'expo-file-system/legacy'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ChapterResponse, Manga } from './useManga'

interface DownloadedChapter {
    mangaId: string
    chapterId: string
    chapterName: string
    images: string[]
    status: 'downloading' | 'completed' | 'failed'
    progress: number
    totalImages: number
    downloadedImages: number
}

interface DownloadsState {
    downloads: Record<string, DownloadedChapter>
    downloadChapter: (manga: Manga, chapterInfo: { chapter_name: string, chapter_api_data: string }) => Promise<void>
    removeDownload: (chapterId: string) => Promise<void>
    isChapterDownloaded: (chapterId: string) => boolean
    getDownloadedChapter: (chapterId: string) => DownloadedChapter | undefined
}

export const useDownloads = create<DownloadsState>()(
    persist(
        (set, get) => ({
            downloads: {},

            downloadChapter: async (manga, chapterInfo) => {
                const { downloads } = get()
                const chapterId = chapterInfo.chapter_api_data

                if (downloads[chapterId] && downloads[chapterId].status === 'completed') return

                // 1. Initialize logic
                console.log('Start downloading', chapterId)

                // Initialize download state
                set(state => ({
                    downloads: {
                        ...state.downloads,
                        [chapterId]: {
                            mangaId: manga._id,
                            chapterId,
                            chapterName: chapterInfo.chapter_name,
                            images: [],
                            status: 'downloading',
                            progress: 0,
                            totalImages: 0,
                            downloadedImages: 0
                        }
                    }
                }))

                try {
                    // 2. Fetch Chapter Details
                    const { data: chapterRes } = await api.get<ChapterResponse>(chapterId)
                    const chapterData = chapterRes.data.item
                    const domainCdn = chapterRes.data.domain_cdn

                    // Update total images count
                    set(state => ({
                        downloads: {
                            ...state.downloads,
                            [chapterId]: {
                                ...state.downloads[chapterId],
                                totalImages: chapterData.chapter_image.length
                            }
                        }
                    }))

                    const chapterDir = `${FileSystem.documentDirectory}downloads/${manga._id}/${encodeURIComponent(chapterId)}/`

                    // Ensure directory exists
                    const dirInfo = await FileSystem.getInfoAsync(chapterDir)
                    if (!dirInfo.exists) {
                        await FileSystem.makeDirectoryAsync(chapterDir, { intermediates: true })
                    }

                    const downloadPromises = chapterData.chapter_image.map(async (img, index) => {
                        const imageUrl = img.image_file.startsWith('http')
                            ? img.image_file
                            : `${domainCdn}/${chapterData.chapter_path}/${img.image_file}`

                        const fileUri = `${chapterDir}${index}.jpg`

                        const fileInfo = await FileSystem.getInfoAsync(fileUri)
                        if (fileInfo.exists) return fileUri

                        const downloadRes = await FileSystem.downloadAsync(imageUrl, fileUri)

                        set(state => {
                            const currentDownload = state.downloads[chapterId]
                            if (!currentDownload) return state

                            const newDownloadedCount = currentDownload.downloadedImages + 1

                            return {
                                downloads: {
                                    ...state.downloads,
                                    [chapterId]: {
                                        ...currentDownload,
                                        downloadedImages: newDownloadedCount,
                                        progress: Math.round((newDownloadedCount / currentDownload.totalImages) * 100)
                                    }
                                }
                            }
                        })
                        return downloadRes.uri
                    })

                    const localImageUris = await Promise.all(downloadPromises)

                    set(state => ({
                        downloads: {
                            ...state.downloads,
                            [chapterId]: {
                                ...state.downloads[chapterId],
                                images: localImageUris,
                                status: 'completed',
                                progress: 100
                            }
                        }
                    }))

                } catch (error) {
                    console.error('Download failed', error)
                    set(state => ({
                        downloads: {
                            ...state.downloads,
                            [chapterId]: {
                                ...state.downloads[chapterId],
                                status: 'failed'
                            }
                        }
                    }))
                }
            },

            removeDownload: async (chapterId) => {
                const { downloads } = get()
                const download = downloads[chapterId]
                if (!download) return

                try {
                    // Delete files
                    const chapterDir = `${FileSystem.documentDirectory}downloads/${download.mangaId}/${encodeURIComponent(chapterId)}/`
                    await FileSystem.deleteAsync(chapterDir, { idempotent: true })

                    // Remove directly from state
                    set(state => {
                        const newDownloads = { ...state.downloads }
                        delete newDownloads[chapterId]
                        return { downloads: newDownloads }
                    })
                } catch (e) {
                    console.error('Failed to delete files', e)
                }
            },

            isChapterDownloaded: (chapterId) => {
                const dl = get().downloads[chapterId]
                return !!(dl && dl.status === 'completed')
            },

            getDownloadedChapter: (chapterId) => {
                return get().downloads[chapterId]
            }
        }),
        {
            name: 'manga-downloads',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)

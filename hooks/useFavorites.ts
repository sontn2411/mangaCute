
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Manga } from './useManga'

interface FavoritesState {
    favorites: Manga[]
    addFavorite: (manga: Manga) => void
    removeFavorite: (id: string) => void
    isFavorite: (id: string) => boolean
}

export const useFavorites = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],
            addFavorite: (manga) => {
                const { favorites } = get()
                if (!favorites.find((f) => f._id === manga._id)) {
                    set({ favorites: [...favorites, manga] })
                }
            },
            removeFavorite: (id) => {
                set({ favorites: get().favorites.filter((f) => f._id !== id) })
            },
            isFavorite: (id) => {
                return !!get().favorites.find((f) => f._id === id)
            },
        }),
        {
            name: 'manga-favorites',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)

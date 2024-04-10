import { AttendeeBadgeModel } from '@/models/attendee-badge-model'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface BadgeStore {
  badge: AttendeeBadgeModel | null
  badgeLocalImage: string | null
  removeBadge: () => void
  setBadge: (badge: AttendeeBadgeModel) => void
  setBadgeImage: (uri: string) => void
}

const _useBadgeStore = create(persist<BadgeStore>(
  (set) => ({
    badge: null,
    badgeLocalImage: null,
    removeBadge: () => set({ badge: null }),
    setBadgeImage: (uri) => set({ badgeLocalImage: uri }),
    setBadge: (badge) => set({ badge })
  }),
  {
    name: 'nlw-unite:attendee-badge@1.0.0',
    storage: createJSONStorage(() => AsyncStorage)
  }
))

export const useBadge = () => _useBadgeStore(state => state.badge)
export const useBadgeImage = () => _useBadgeStore(state => state.badgeLocalImage)

export const badgeActions = {
  set: _useBadgeStore.getState().setBadge,
  remove: _useBadgeStore.getState().removeBadge,
  setBadgeImage: _useBadgeStore.getState().setBadgeImage
}
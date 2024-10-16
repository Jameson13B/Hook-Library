import { useState, useEffect } from "react"
import { doc, updateDoc, onSnapshot, Firestore } from "firebase/firestore"

interface CacheData {
  id: string
  name: string
  location: {
    latitude: number
    longitude: number
  }
  clue: string
  checkedInUsers: string[]
}

/**
 * useCacheManager Hook
 *
 * This hook manages a single cache location using Firebase Firestore.
 * It provides real-time updates and methods to interact with the cache data.
 *
 * @param {Firestore} db - The Firestore database instance
 * @param {string} cacheId - The ID of the cache to manage
 *
 * @returns {Object} An object containing the following properties and methods:
 *   - cache: The current cache data (CacheData | null)
 *   - loading: A boolean indicating whether the cache data is being loaded
 *   - updateCache: A function to update the cache data
 *   - checkIn: A function to check in a user to the cache
 *   - isUserCheckedIn: A function to check if a user is checked in to the cache
 *
 * @example
 * const { cache, loading, updateCache, checkIn, isUserCheckedIn } = useCacheManager(db, 'cache123');
 *
 * if (loading) {
 *   return <div>Loading...</div>;
 * }
 *
 * if (cache) {
 *   console.log(cache.name);
 *   checkIn('user456');
 *   console.log(isUserCheckedIn('user456')); // true
 * }
 */
export const useCacheManager = (db: Firestore, cacheId: string) => {
  const [cache, setCache] = useState<CacheData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const cacheRef = doc(db, "caches", cacheId)
    const unsubscribe = onSnapshot(cacheRef, (doc) => {
      if (doc.exists()) {
        setCache({ id: doc.id, ...doc.data() } as CacheData)
      } else {
        setCache(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [db, cacheId])

  const updateCache = async (updateData: Partial<Omit<CacheData, "id">>) => {
    if (!cache) return
    const cacheRef = doc(db, "caches", cacheId)
    await updateDoc(cacheRef, updateData)
  }

  const checkIn = async (userId: string) => {
    if (!cache) return
    if (!cache.checkedInUsers.includes(userId)) {
      await updateCache({
        checkedInUsers: [...cache.checkedInUsers, userId],
      })
    }
  }

  const isUserCheckedIn = (userId: string): boolean => {
    return cache ? cache.checkedInUsers.includes(userId) : false
  }

  return {
    cache,
    loading,
    updateCache,
    checkIn,
    isUserCheckedIn,
  }
}

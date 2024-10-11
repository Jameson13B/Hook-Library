/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"

/**
 * A custom hook for subscribing to Firebase Firestore data.
 *
 * @param firebase - The Firebase instance.
 * @param path - The Firestore collection path to subscribe to.
 * @returns An object containing:
 *   - isLoading: A boolean indicating if the data is currently being fetched.
 *   - isError: A boolean indicating if an error occurred during fetching.
 *   - data: The fetched data from Firestore, or null if not yet loaded.
 *   - onRefresh: A function to manually trigger a refresh of the data.
 *
 * @example
 * const { isLoading, isError, data, onRefresh } = useFirebaseSubscribe(firebase, 'users');
 */
export const useFirebaseSubscribe = (firebase: any, path: string) => {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [onRefresh, setOnRefresh] = useState(false)

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(path)
      .onSnapshot((snapshot: any) => {
        if (snapshot.isError) {
          setIsError(true)
        } else {
          setData({ ...snapshot.docs[0], id: snapshot.id })
          setIsError(false)
        }
        setIsLoading(false)
      })
    return () => unsubscribe()
  }, [firebase, path, onRefresh])

  return {
    isLoading,
    isError,
    data,
    onRefresh: () => {
      setIsLoading(true)
      setOnRefresh(!onRefresh)
    },
  }
}

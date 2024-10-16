import { useEffect, useState } from "react"
import {
  doc,
  onSnapshot,
  Firestore,
  DocumentData,
  updateDoc,
} from "firebase/firestore"

/**
 * useFirebaseSubscribe Hook
 *
 * This hook subscribes to a single document in Firebase Firestore.
 * It provides real-time updates of the document data and a method to update the document.
 *
 * @param {Firestore} db - The Firestore database instance
 * @param {string} path - The Firestore collection path
 * @param {string} id - The document ID within the collection
 *
 * @returns {Object} An object containing the following properties and methods:
 *   - data: The current document data (DocumentData | null)
 *   - isLoading: A boolean indicating whether the data is being loaded
 *   - isError: A boolean indicating whether an error occurred
 *   - error: The error object if an error occurred, otherwise null
 *   - updateDocument: A function to update the document with new data
 *   - isUpdating: A boolean indicating whether an update operation is in progress
 *
 * @example
 * const { data, isLoading, isError, error, updateDocument, isUpdating } = useFirebaseSubscribe(db, 'users', 'user123');
 *
 * if (isLoading) {
 *   return <div>Loading...</div>;
 * }
 *
 * if (isError) {
 *   return <div>Error loading data: {error?.message}</div>;
 * }
 *
 * if (data) {
 *   console.log(data.name);
 *   
 *   // Update the document
 *   updateDocument({ name: 'New Name' });
 * }
 *
 * if (isUpdating) {
 *   return <div>Updating document...</div>;
 * }
 */
export const useFirebaseSubscribe = (
  db: Firestore,
  path: string,
  id: string
) => {
  const [data, setData] = useState<DocumentData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)

  useEffect(() => {
    const docRef = doc(db, path, id)
    const unsubscribe = onSnapshot(
      docRef,
      (doc) => {
        if (doc.exists()) {
          setData(doc.data())
        } else {
          setData(null)
        }
        setIsError(false)
        setError(null)
        setIsLoading(false)
      },
      (error) => {
        console.error("Error fetching document:", error)
        setIsError(true)
        setIsLoading(false)
        setError(error)
      }
    )

    return () => unsubscribe()
  }, [db, path, id])

  const updateDocument = async (updateData: Partial<DocumentData>) => {
    if (!data) return
    setIsUpdating(true)
    try {
      const docRef = doc(db, path, id)
      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error("Error updating document:", error)
      setIsError(true)
      setError(error as Error)
    }
    setIsUpdating(false)
  }

  return {
    data,
    isLoading,
    isError,
    error,
    updateDocument,
    isUpdating,
  }
}

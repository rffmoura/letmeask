import { useEffect, useState } from "react"
import { getDatabase, off, onValue, ref } from 'firebase/database';
import { useAuth } from "./useAuth";

type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighLighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>

export function useRoom(id: string | undefined) {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [roomTitle, setRoomTitle] = useState('')

  useEffect(() => {
    const database = getDatabase()
    const roomRef = ref(database, `rooms/${id}`)

    onValue(roomRef, (data) => {
      const databaseRoom = data.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighLighted: value.isHighLighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key ,like]) => like.authorId === user?.id)?.[0],
        }
      })

      setRoomTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })

    return () => {
      off(roomRef)
    }

  }, [id, user?.id])

  return { questions, roomTitle }
}
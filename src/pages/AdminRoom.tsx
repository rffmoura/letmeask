import { useNavigate, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { getDatabase, ref, remove, update } from 'firebase/database';

import '../styles/rooms.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams<RoomParams>();
  const { roomTitle, questions } = useRoom(id)
  const database = getDatabase()

  function handleEndRoom() {
    const reference = ref(database, `rooms/${id}`)
    update(reference, {
      endedAt: new Date(),
    })

    navigate('/')
  }

  function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      const reference = ref(database, `rooms/${id}/questions/${questionId}`)
      remove(reference)
    }
  }

  function handleCheckQuestionAsAnswered(questionId: string) {
    const reference = ref(database, `rooms/${id}/questions/${questionId}`)
    update(reference, {
      isAnswered: true,
    })
  }

  function handleHighlightQuestion(questionId: string) {
    const reference = ref(database, `rooms/${id}/questions/${questionId}`)
    update(reference, {
      isHighLighted: true,
    })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={id ? id : ''} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>{roomTitle}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighLighted={question.isHighLighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  )
}
import './App.css'
import QuizCreation from './pages/QuizForm'
import Quizzes from './pages/Quizzes'
import Login from './pages/Login'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Quiz from './pages/Quiz'

function App() {

  const isAuth = false;

  if (isAuth) {
    return (<Login />)
  } else {
  return (
    <>
      <Routes>
        <Route 
          path='/'
          element={<Layout />}
        >
          <Route 
            path='/home'
            element={ <Home />}
          />
          <Route
            path='/quiz-creation'
            element={ <QuizCreation />}
          />
          <Route
            path='/quizzes'
            element={ <Quizzes />}
          />
           <Route 
            path="/quizzes/:quizId" 
            element={<Quiz />} 
          />
        </Route>
        <Route
            path='/login'
            element={ <Login />}
          />
      </Routes>
    </>
  )
  }
}

export default App
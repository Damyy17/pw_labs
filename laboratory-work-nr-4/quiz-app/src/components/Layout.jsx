import Nav from './Nav'
import { Outlet } from 'react-router-dom'
import '../assets/styles/layout.scss'

function Layout() {
  return (
    <div className='layout'>
        <header>
            <Nav />
        </header>
        <div className='outlet'>
          <Outlet />
        </div>
    </div>
  )
}

export default Layout
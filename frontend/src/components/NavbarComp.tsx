import { useNavigate } from 'react-router-dom'
import { userNameState } from '../recoil/atoms';
import { useRecoilState } from 'recoil';

export default function NavbarComp() {
  const [userName,] = useRecoilState(userNameState);
  const navigator = useNavigate();

  return (
    <nav className="bg-transparent mb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
        <div className="">
            <h2 className='font-bold'>{userName}</h2>
          </div>
          <div className="">
            <button onClick={()=>{navigator('/')}} className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}


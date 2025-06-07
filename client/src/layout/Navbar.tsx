import { useNavigate } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri";
import { FaBookmark } from "react-icons/fa6";
import { MdLibraryAdd } from "react-icons/md";
import { IoIosChatboxes } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="my-8 px-6 py-4 md:py-2 flex items-center gap-8 border-[1px] border-neutral-800 rounded-full text-white">
      
      <span onClick={()=>navigate("/interview/dashboard")} className="md:p-4 md:border-[1px] border-neutral-800 rounded-md hover:scale-125 hover:rotate-[25] duration-300 cursor-pointer">
        <RiDashboardFill className="w-4 h-4 md:w-6 md:h-6"/>
      </span>

      <span className="md:p-4 md:border-[1px] border-neutral-800 rounded-md hover:scale-125 hover:rotate-[25] duration-300 cursor-pointer">
        <MdLibraryAdd className="w-4 h-4 md:w-6 md:h-6"/>
      </span>

      <span className="md:p-4 md:border-[1px] border-neutral-800 rounded-md hover:scale-125 hover:rotate-[25] duration-300 cursor-pointer">
        <FaBookmark className="w-4 h-4 md:w-6 md:h-6"/>
      </span>

      <span className="md:p-4 md:border-[1px] border-neutral-800 rounded-md hover:scale-125 hover:rotate-[25] duration-300 cursor-pointer">
        <IoIosChatboxes className="w-4 h-4 md:w-6 md:h-6"/>
      </span>

      <span className="md:p-4 md:border-[1px] border-neutral-800 rounded-md hover:scale-125 hover:rotate-[25] duration-300 cursor-pointer">
        <FaMicrophone className="w-4 h-4 md:w-6 md:h-6"/>
      </span>

      <span className="md:p-4 md:border-[1px] border-neutral-800 rounded-md hover:scale-125 hover:rotate-[25] duration-300 cursor-pointer">
        <IoPersonSharp className="w-4 h-4 md:w-6 md:h-6"/>
      </span>

    </div>
  )
}

export default Navbar

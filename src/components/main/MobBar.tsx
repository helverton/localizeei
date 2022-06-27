import Link from 'next/link'
import { FiUsers, FiHome, FiArchive, FiMail, FiChevronDown } from "react-icons/fi";
import SideBar from "@/components/main/SideBar";

interface MobBarProps {
  state: string
}

export default function MobBar(props: MobBarProps) {
  return (
    <div className={`flex items-center justify-center ${props.state} md:hidden m-5`}>
      <SideBar />
    </div>
  )
}

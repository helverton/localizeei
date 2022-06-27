import Link from 'next/link'
import { FiChevronRight } from "react-icons/fi";

export default function Root(props: any) {
  return (
    <div className="w-full hidden md:flex">
      <Link href="/">
        <a>Application</a>
      </Link>
      <FiChevronRight className="w-6 h-6" />
      <Link href="/home">
        <a>{props.children}</a>
      </Link>

    </div>
  )
}

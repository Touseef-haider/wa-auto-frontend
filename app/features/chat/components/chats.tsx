"use client"

import { useParams } from "next/navigation"
import Sessions from "./sessions"
import Chatbox from "./chatbox"

const Chats = () => {
    const params = useParams<{ slug: string }>()
    const filename = params.slug
    return (
        <div>
            <h1 className="text-2xl">

                Chat with {decodeURIComponent(filename)}
            </h1>
            <div className="flex gap-2 mt-4">
                {/* <Sessions /> */}
                <Chatbox filename={filename} />
            </div>

        </div>
    )
}

export default Chats

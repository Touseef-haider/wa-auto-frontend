"use client"

import { useParams } from "next/navigation"
import Chatbox from "./chatbox"

const Chats = () => {
    const params = useParams<{ slug: string }>()
    const filename = decodeURIComponent(params.slug)
    
    return (
        <div>
            <h1 className="text-2xl">
                Chat with {filename === "all" ? "All Files" : filename}
            </h1>
            <div className="flex gap-2 mt-4">
                <Chatbox filename={filename} />
            </div>

        </div>
    )
}

export default Chats

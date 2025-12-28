import Button from "@/app/common/Button/Index";
import Input from "@/app/common/Input/Index";
import { useEffect, useRef, useState } from "react";
import { EventSource } from "eventsource"
import { AxiosError } from "axios";
import toastify from "@/app/utils/toastify";

type MessageType = "user" | "ai"

interface Message {
    type: MessageType
    timestamp: Date,
    content: string
}

const Message = ({ message}: { message: Message ,loading:boolean}) => {
    return (
        <div className="w-full mb-4">

            {
                message.type === "ai" ? (
                <div>
                    {
                    message.type === "ai" && !message.content.length ? (
                        <div className="flex space-x-1 h-8">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    ) :
                        (
                            <>
                                <p className="text-primary">
                                    {message.content}
                                </p>
                                <span className="text-xs">{new Date(message.timestamp).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                                </span>
                            </>
                        )
                    }
                </div>
                ) : (
                    <div className="text-right p-2">
                        <p>
                            {message.content}
                        </p>
                        <span className="text-xs">{new Date(message.timestamp).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}</span>
                    </div>
                )
            }
        </div>
    )
}


interface ChatboxProps  {
    filename: string
}

export default function Chatbox({filename}:ChatboxProps) {

    const [message, setMessage] = useState("")
    const [loading,setLoading] = useState(false)
    const endRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [messageHistory, setMessageHistory] = useState<Message[]>([])


    function scroll(){
        if(endRef.current){
            endRef.current?.scrollIntoView({
                behavior:"smooth"
            })
        }
    }

    const handleSend = () => {
        try {

            setLoading(true)


            const newUserMessage: Message = {
                content: message,
                timestamp: new Date(),
                type: "user"
            }

            const newAIMessage: Message = {
                content: "",
                timestamp: new Date(),
                type: "ai"
            }


            setMessageHistory((prev) => [...prev, newUserMessage, newAIMessage])
            
            
            const eventSource = new EventSource(`http://localhost:8000/api/chat/stream?query=${message}&filename=${decodeURIComponent(filename)}`, {
                withCredentials: true
            })

            eventSource.onmessage = (ev: MessageEvent) => {
                if (!ev.data) return
                const event = JSON.parse(ev.data)

                if (event?.type === "DONE") {
                    eventSource.close()
                    setMessage("")
                    setLoading(false)
                }

                else if (event?.type === "message") {
                    console.log(event.chunk)
                    setMessageHistory((prev) => {
                        const newMessages = [...prev];
                        const lastIndex = newMessages.length - 1;
                        if (lastIndex === -1) return newMessages;
                        newMessages[lastIndex] = {
                            ...newMessages[lastIndex],
                            content: event.chunk,
                        };
                        return newMessages;
                    });
                    scroll()
                }

                else if (event.type === "ERROR") {
                    const messages = [...messageHistory]
                    messages.pop()
                    messages.pop()
                    setMessageHistory(messages);
                    toastify(event.message, "error")
                }
            }
            eventSource.onerror = (ev: Event) => {
                console.log(ev)
                eventSource.close()
                setLoading(false)
                const messages = [...messageHistory]
                messages.pop()
                messages.pop()
                setMessageHistory(messages);
            
                toastify("Something went wrong","error")
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                console.log(err.message)
            }
            console.log(err, typeof err)
            setLoading(false)
            setLoading(false)
            const messages = [...messageHistory]
            messages.pop()
            messages.pop()
            setMessageHistory(messages);
            
        }
    }

    useEffect(()=>{
        if(inputRef && inputRef.current){
            inputRef.current.focus()
        }
    },[])


    useEffect(() => {
        if (!loading && inputRef.current) {
            inputRef.current.focus()
        }
    }, [loading])

    useEffect(() => {
        scroll()
    }, [messageHistory])


    return (
        <div className="relative w-full h-[calc(100vh-100px)]">
            <div className="h-[calc(100vh-170px)] overflow-auto mb-2">
                {
                    messageHistory.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            {messageHistory.length} messages, Start typing...
                        </div>
                    )
                }
                {
                    messageHistory.map((message, index) => (
                        <Message loading={loading} key={index + 1} message={message} />
                    ))
                }
                <div ref={endRef}/>
            </div>

            <div className="flex w-full absolute bottom-0 gap-2">
                <Input
                    name="message"
                    disabled={loading}
                    type="text"
                    ref={inputRef}
                    placeholder="write your message here"
                    value={message}
                    onKeyDown={(key) => {
                        if (key.code === "Enter") {
                            handleSend()
                        }
                    }}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full"
                />
                <Button title="Send" type="button" disabled={loading} className="px-8 py-0" onClick={()=>{
                    handleSend()
                }} />
            </div>
        </div>
    )
}
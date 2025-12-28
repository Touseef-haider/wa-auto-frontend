
"use client";
import Button from "@/app/common/Button/Index";
import { useRouter } from "next/navigation";


const ChatStarter = () => {
    const router = useRouter();
    return (
        <div className="p-4 bg-white shadow">
            <h2 className="text-lg font-semibold mb-4">Start a New Chat</h2>
            <Button
                title="Start Chat"
                type="button"
                className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => {
                    router.push("/business-data/all/chat");
                }}

            />
        </div>
    );
};

export default ChatStarter;
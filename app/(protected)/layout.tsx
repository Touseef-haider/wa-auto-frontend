import React from "react"
import Sidebar from "../common/Sidebar/Index";

export default function Root({ children }: { children: React.ReactNode }) {
    return (
        <Sidebar>
            {children}
        </Sidebar>
    )
}
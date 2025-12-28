
interface ButtonProps {
    title: string | React.ReactElement,
    type: "submit" | "button" | "reset",
    disabled?: boolean,
    onClick?: () => void,
    className?: string
    isBackground?:boolean
    isHover?:boolean
}


const Button = ({ title, onClick, type, className, disabled = false,isBackground=true,isHover=true }: ButtonProps) => {
    return (
        <button 
            disabled={disabled}
            type={type}
            onClick={onClick}
            className={`
                ${className} disabled:cursor-not-allowed  rounded-lg ${isBackground ? "bg-primary":""}  text-secondary text-sm font-semibold 
                ${isHover ? "hover:bg-primary/90":""}  transition duration-200 cursor-pointer
                focus:outline-none focus:ring-4 focus:ring-primary/50`
            }
        >
            {title}
        </button>
    )
}

export default Button
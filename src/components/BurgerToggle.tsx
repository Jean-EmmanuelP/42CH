interface BurgerToggleProps {
    isOpen?: boolean;
    onDefiClick: () => void;
    onClose: () => void;
}

export default function BurgerToggle({isOpen = false, onDefiClick, onClose }:BurgerToggleProps) {
    return (
        <div className={`absolute inset-0 top-[9%] bottom-[18%] bg-[#272A30] z-50`}>
            <div className="flex flex-col w-full h-full text-white items-center justify-center gap-6 text-[18px]">
                <p onClick={ () => {onClose();onDefiClick();}}>Defi</p>
                <p>Social</p>
                <p>Classement</p>
            </div>
        </div>
    )
}
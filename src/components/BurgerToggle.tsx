interface BurgerToggleProps {
    isOpen?: boolean;
    onDefiClick: () => void;
    onSocialClick: () => void;
    onClose: () => void;
    resetState: () => void;
}

export default function BurgerToggle({ resetState, isOpen = false, onDefiClick, onClose, onSocialClick }: BurgerToggleProps) {
    return (
        <div className={`absolute inset-0 top-[9%] bottom-[18%] bg-[#272A30] z-20`}>
            <div className="flex flex-col w-full h-full text-white items-center justify-center gap-6 text-[18px]">
                <p onClick={() => { onClose(); resetState(); onDefiClick(); }}>Defi</p>
                <p onClick={() => { onClose(); resetState(); onSocialClick(); }}>Social</p>
                <p onClick={() => { window.location.href = "/classement" }}>Classement</p>
            </div>
        </div>
    )
}
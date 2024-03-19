"use client";

import { useModal } from "@/hooks/use-modal-store";


export const NavigationAction = () => {
    const {onOpen} = useModal();
    return(
        <div style={{position: 'fixed', bottom: '20px', right: '20px' }}>
            <button
            onClick={() => onOpen("createChallenge")}
            className="group items-center"
            >
                <div className="flex h-[40px] w-[150px] rounded-[12px]  items-center justify-center bg-[rgb(102,26,138)] group-hover:bg-[rgb(122,46,158)]">
                    <div className="text-white">Create Challenge</div>
                </div>
            </button>
        </div>
    )
}

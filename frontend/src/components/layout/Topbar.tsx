import {useState} from "react";


const Topbar = () => {
    const [user, ] = useState({
        name: "Serhii",
        role: "admin"
    })

    return (
        <header className="bg-white px-6 py-3 border-b border-border flex justify-between">


            <div className="flex gap-2.5">
                <div className="size-9 flex items-center justify-center bg-gradient-primary text-lg text-white rounded-full">
                    {user.name[0]}
                </div>
                <div className="flex flex-col justify-center gap-0">
                    <h3 className="font-semibold text-sm">{user.name}</h3>
                    <p className="text-[12px] text-text-muted leading-tight">{user.role}</p>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
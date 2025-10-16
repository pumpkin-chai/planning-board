'use client';

import { Button } from "@/components/ui/button";
import {CalendarPlus} from "lucide-react";

import { useState } from "react";

export default function CreateEvent(){

    const[openModal, setOpenModal] = useState(false);

    function handleClick(){
        // alert("Event Created")
        return(
        <div className="modalBackground">
            <div className="modalContainer">
                <button> X </button>
                <div className="title">
                    <h1>Create Event</h1>
                </div>
                <div className="body">
                    <p>
                        Placeholder
                    </p>
                </div>
                <div className="footer">
                    <button>Button 1</button>
                    <button>Button 2</button>
                </div>
            </div>
        </div>
        )
    }

    return <Button onClick={() => {
                            setOpenModal(false);
                            handleClick();}}><CalendarPlus /> Propose Event</Button>;
}
import React from 'react';
import { getLocalDateString } from "../../../utils/DateUtils.js";
import { get } from 'react-hook-form';

const PageIntro = ( { user } ) => {

    const getGreeting = () => {
        const hour = getLocalDateString(new Date(), { hour: 'numeric', hour12: false }).split(':')[0];
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="border border-dashed border-gray-400 p-4 rounded flex items-center justify-between w-full">
            
            {/* Left Aligned */}
            <h2 className="text-sm font-semibold flex-1 text-left">
                {getGreeting()}{ ", " + user?.first_name || ""}
            </h2>

            {/* Center Aligned */}
            <h2 className="text-base font-medium flex-1 text-center">
                Today is {getLocalDateString(new Date())}
            </h2>

            {/* Right Aligned */}
            <div className="flex-1 text-right">
                <button className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded border">
                    Settings
                </button>
            </div>
        </div>
    );
};

export default PageIntro;
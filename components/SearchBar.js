import React, { useState } from "react";

const SearchBar = ({handler, label, multiline}) => {
    const [value, setValue] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handler(value);
    };

    // The form looks different depending on whether it's a single line or multi-line
    if (multiline) {
        return (
            <form onSubmit={handleSubmit}>
                <label>{label}</label>
                <textarea
                    value={value}
                    onChange={handleChange}
                />
                <input type="submit" value="Submit" />
            </form>
        )
    } else {
        return (
            <form onSubmit={handleSubmit}>
            <label>{label}</label>
            <input
                type="text"
                value={value}
                onChange={handleChange}
            />        
            <input type="submit" value="Submit" />
        </form>
        );
    }
    
};

export default SearchBar;

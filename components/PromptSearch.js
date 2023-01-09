import SearchBar from "./SearchBar";

const PromptSearch = ({handler}) => {

    
    const handleSearch = (value) => {
        on_search_button_press(value, handler);
    };

    return (
        <div className="prompt-search">
            {/* A large text box at least 7 lines in height with search button (uses same search value as other mode*/}
            <div className="search-container">
                <SearchBar
                    label={"Prompt:"}
                    handler={handleSearch}
                    multiline={true}
                />
            </div>
        </div>
    );
};

/**
 * Find fictions that match the search query
 * @param {String} prompt the text of the search query
 * @param {Function} handler the function to call to set results
 */
async function on_search_button_press(prompt, handler){
// params will contain the page number if provided in the URL
    // make a request to the fictions serverless function
    const params = new URLSearchParams();
    params.set("p", prompt);
    
    const res =  await fetch(`api/search_with_prompt?${params.toString()}`);
    if (!res) throw new Error("Failed fetch to api/search_with_prompt");

    const data = await res.json();

    // send the data as props to the component
    handler(data);
}

export default PromptSearch;
import React from "react";

class TextForm extends React.Component {
    constructor(props) {
        super(props);
        this.label = props.label;
        this.state = { value: "" };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handler = props.handler;
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    handleSubmit(event) {
        //alert('A name was submitted: ' + this.state.value);
        this.handler(this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>{this.label}
                <input
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default TextForm;

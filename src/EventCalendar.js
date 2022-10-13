import React from "react";

class EventCalendar extends React.Component {
    handleClick( e ) {
        e.preventDefault()
        fetch('/view', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        // .then(response => response.json())
        // .then(json => {
            
        // })
        window.location.href = "http://localhost:8080/edit-calendar"
    }

    render() {
        return (
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title d-inline">{this.props.title}</h5>
                    <div className="d-md-flex justify-content-md-end">
                        <button className="btn btn-primary view-button" type="submit" onClick={this.handleClick}>View</button>
                        <button className="btn btn-danger ms-1">Delete</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default EventCalendar;

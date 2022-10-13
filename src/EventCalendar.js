import React from "react";

class EventCalendar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "Holder", 
            ready: false
        }
    } 

    handleView( e ) {
        // handleView( e, id )
        e.preventDefault()

        // const json = {
        //     youFreeID: id
        // }

        const json = {
            "youFreeID": this.props.event.youFreeID
        }

        let body = JSON.stringify(json)
        fetch('/view', {
            method:'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
        // .then(response => response.json())
        // .then(json => {
            
        // })
        window.location.href = "http://localhost:8080/edit-calendar"
    }

    handleDelete( e, id, creator ) {
        e.preventDefault()

        const json = {
            youFreeID: id,
            creator: creator
        }
        let body = JSON.stringify(json)

        fetch('/delete', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
    }

    componentDidMount( e ) {
        // e.preventDefault()
        const json = {
            "youFreeID": this.props.event.youFreeID
        }

        let body = JSON.stringify(json)
        fetch("/grabName", {
            method:'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(json => {
            this.setState({ name: json.name })
            this.setState({ ready: true})
        })
    }

    render() {            
        this.componentDidMount()
        if (this.state.ready) {
            return (
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title d-inline">{this.state.name}</h5>
                        <div className="d-md-flex justify-content-md-end">
                            <button className="btn btn-primary view-button" type="submit" onClick={(e) => this.handleView(e, this.props.youFreeID)}>View</button>
                            <button className="btn btn-danger ms-1" onClick={(e) => this.handleDelete(e, this.props.youFreeID, this.props.creator)}>Delete</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default EventCalendar;

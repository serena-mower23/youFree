import React from "react";

class EventCalendar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "", 
            creator: "",
            ready: false
        }

        this.handleView = this.handleView.bind(this)
        this.handleLoad = this.handleLoad.bind(this)
    }

    async handleLoad() {
        const props = {
            "youFreeID": this.props.event.youFreeID
        }

        let body = JSON.stringify(props)
        const res = await fetch("/getInfo", {
            method:'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const json = await res.json()
        this.setState({ name: json.name })
        this.setState({ creator: json.creator })
        this.setState({ ready: true})
    }

    handleView( e ) {
        e.preventDefault()
        window.location.href = `/edit-calendar?id=${this.props.event.youFreeID}`
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
        .then(window.location.href = "/home", true)
    }

    async componentDidMount() {
        this.handleLoad()
    }

    render() {
        if (this.state.ready) {
            return (
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title d-inline">{this.state.name}</h5>
                        <div className="d-md-flex justify-content-md-end">
                            <button className="btn btn-primary view-button" type="submit" onClick={(e) => this.handleView(e)}>View</button>
                            <button className="btn btn-danger ms-1" onClick={(e) => this.handleDelete(e, this.props.event.youFreeID, this.state.creator)}>Delete</button>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default EventCalendar;

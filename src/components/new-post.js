import React, { Component } from 'react'
import Modal from './modal'

class NewPost extends Component {
constructor (props){
    super(props)
    this.state = {
        classNameModal:''
    }
}

showModal = () => {
    this.setState({
        classNameModal:'is-active'
    })
}

handleClose = () => {
    this.setState({
        classNameModal:''
    })
}

    render() {
        let {
            classNameModal
        } = this.state

        return (
            <div>
                <Modal 
                title="Nueva Publicación"
                onClose={this.handleClose}
                className={classNameModal}>
                    Hola Modal
                </Modal>
                <button 
                onClick={this.showModal}
                className="button is-info">
                    Nueva Publicación
                </button>
            </div>
        )
    }
}

export default NewPost
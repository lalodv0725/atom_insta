import React, {Component} from 'react'
import firebase from 'firebase'

class PostCard extends Component {
    constructor(props){
        super(props)
        this.state = {
            author: null,
            loading: true
        }
    }

    componentDidMount = () => {
        this.loadAuthor()
    }

    loadAuthor = () => {
        let {
            post
        } = this.props

        let authorRef = firebase.database().ref(`users/${post.authorId}`)

        authorRef.once('value', (snapshot) => {
            console.log("Datos de Autor",snapshot.val());
            this.setState({
                author: snapshot.val(),
                loading: false
            })
        })
    }

    render(){
        let {
            post
        }= this.props

        let {
            loading,
            author
        } = this.state

        if(loading){
            return(
                <div>
                    <p className="my-letter-font">Loading...</p>
                </div>
            )
        }

        return (
            <div className="card">
                <div className="card-header">
                    <div className="card-header-title">
                        <div className="media">
                            <div className="media-left">
                                <figure className="image is-96x96">
                                    <img className="is-rounded" src={author.photoURL} alt=""/>
                                </figure>
                            </div>
                            <div className="media-content">
                                <p className="title is-4">{author.displayName}</p>
                                <p className="subtitle is-6">{author.email}</p>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="card-image">
                    <figure className="image is-1by1">
                        <img src={post.photoURL} alt=""/>
                    </figure>
                </div>
            </div>
        )
    }
}
export default PostCard
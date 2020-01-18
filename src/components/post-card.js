import React, { Component } from 'react'
import firebase from 'firebase'
import { Link } from 'react-router-dom'

class PostCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            author: null,
            loading: true,
            comment: ''
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
            console.log("Datos de Autor", snapshot.val());
            this.setState({
                author: snapshot.val(),
                loading: false
            })
        })
    }

    handleChange = (e) => {
        let {
            target
        } = e
        this.setState({
            comment: target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const {
            comment
        } = this.state

        const {
            post
        } = this.props

        if (comment) {
            let commentsRef = firebase.database().ref(`postComments/${post.id}`)

            let commentRef = commentsRef.push()

            commentRef.set({
                content: comment,
                userId: 'TWNITntVyrQSPiShCcESAAcgXPg2',
                createdAt: new Date().toJSON()
            })

            this.setState({
                comment:''
            })
        }
    }

    render() {
        let {
            post,
            readOnly
        } = this.props

        let {
            loading,
            author,
            comment,
            postComments
        } = this.state

        if (loading) {
            return (
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
                                    <img className="is-rounded" src={author.photoURL} alt="" />
                                </figure>
                            </div>
                            <div className="media-content">
                                <p className="title is-4">{author.displayName}</p>
                                <p className="subtitle is-6">{author.email}</p>
                            </div>
                        </div>
                    </div>

                    {
                        !readOnly && (<div className="card-header-icon">
                            <Link to={`/posts/${post.id}`}>
                                Ver Post
                             </Link>
                        </div>)
                    }

                </div>
                <div className="card-image">
                    <figure className="image is-1by1">
                        <img src={post.photoURL} alt="" />
                    </figure>
                </div>

                <div className="card-footer">
                    <p className="card-footer-item"></p>
                </div>

                {
                    !readOnly && (<div className="card-footer">
                        <form
                            onSubmit={this.handleSubmit}
                            className="card-footer-item">
                            <div className="field is-grouped fields-comments">
                                <p className="control is-expanded">
                                    <input
                                        value={comment}
                                        className="input"
                                        placeholder="Write a comment"
                                        onChange={this.handleChange}
                                    />
                                </p>
                                <p className="control">
                                    <button
                                        className="button is-info">
                                        Send
                                        </button>
                                </p>
                            </div>
                        </form>
                    </div>)
                }




            </div>
        )
    }
}
export default PostCard
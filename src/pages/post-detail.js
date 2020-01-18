import React, { Component } from 'react'
import PostCard from '../components/post-card'
import firebase from "firebase"


class PostDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            post: null,
            loading: true
        }
    }

    componentDidMount = () => {
        this.loadDetail()
    }

    loadDetail = () => {
        const {
            match: {
                params: {
                    id
                }
            }
        } = this.props

        console.log("Props", this.props)

        let postRef = firebase.database().ref(`posts/${id}`)

            postRef.once('value', (snapshot) => {
            console.info("Valores Post", snapshot.val())

            //Comentarios
            let commentsRef = firebase.database().ref(`postComments/${id}`)

                commentsRef.on('value', (snapshot) => {
                let comments = snapshot.val()


                console.log("Comentarios:", comments)
            })

            this.setState({
                post: snapshot.val(),
                loading: false
            })
        })
    }

    render() {
        let {
            loading,
            post
        } = this.state

        if (loading) {
            return (
                <div 
                className='is-vertical-center'
                style={{
                    height:'100vh'
                }}>
                    <p className="has-text-centered my-letter-font">Loading...</p>
                </div>
            )
        }

        return (
            <div className="columns">
                <div className="column is-half is-offset-one-quarter">
                    <PostCard 
                    post={post} 
                    readOnly/>
                </div>
            </div>
        )
    }
}

export default PostDetail
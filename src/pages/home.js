import React, { Component } from 'react'
import firebase from 'firebase'
import Post from '../components/post'


class Home extends Component{

constructor (props){
    super(props)
        this.state = {
            posts:[]
        } 
}

componentDidMount = () => {
    let postsRef = firebase.database().ref('posts')

    postsRef.on('value', (snapshot) => {
        let posts = snapshot.val()
        console.log("Publicaciones:", posts)

        let newPosts = []

        for(let post in posts){
            console.log("Publicacion:", post)
            newPosts.push({
                id:post,
                content: posts[post].content,
                photoURL: posts[post].photoURL,
                authorId: posts[post].authorId,
                createdAt: posts[post].createdAt

            })
        }

        this.setState({
            posts:newPosts
        })
    })
}


    render(){
        let {
            posts
        } = this.state
    
        return(
        <div className="">
            <h1>BIENVENIDO</h1>

            <Post/>

            <div className="columns is-multiline">
                {
                    posts.map(l => {
                        return (
                            <div key={l.id} className="column is-4">
                                <img src={l.photoURL}/>
                            </div>
                        )
                    })
                }
            </div>
        </div>
        )        
    }
}


export default Home
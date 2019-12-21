import React, { Component } from 'react'
import firebase, { storage } from 'firebase'
import LoadingBar from 'react-top-loading-bar';
import {toast} from 'react-toastify';


class Home extends Component{

constructor (props){
    super(props)
        this.state = {
            image: '',
            progressUpload: 0,
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
                photoURL: posts[post].photoURL
            })
        }

        this.setState({
            posts:newPosts
        })
    })
}

handleChange = (e) => {
    let [image] = e.target.files

    this.setState({
        image
    })

    let name = `${new Date().toDateString()}-${image.name}`

    let refStorage = firebase.storage().ref(`/photos/${name}`)
    let task =  refStorage.put(image)

    task.on('state_changed', (snapshot) => {
        let percentage =(snapshot.bytesTransferred / snapshot.totalBytes) * 100
        //task.cancel()
        this.setState({
            progressUpload:percentage <= 0 ? 20 : percentage
        })
    }, (error) => {
        this.restartProgressBar()
        toast.error(`Error al subir la imagen!\nReintente la subida de la imagen por favor.\n Error:${error.message}` , {
            position: toast.POSITION.TOP_RIGHT
          });
        console.log("error",error)
    }, () => {
        task.snapshot.ref.getDownloadURL().then((url) => {
            toast.success("Imagen subida con exito!", {
                position: toast.POSITION.TOP_RIGHT
              });
            console.log("url", url)
        })
    })
}

// handleCancelUpload = () => {    
// }

restartProgressBar = () => {
    this.setState({
        progressUpload:0
    })
}


addPost = () => {
    let posts = firebase.database().ref('posts')
    let newPost = posts.push()

    newPost.set({
        content:`Hola ${new Date().toDateString()}`,
        photoURL:'https://firebasestorage.googleapis.com/v0/b/atom-insta-100.appspot.com/o/photos%2FSat%20Dec%2021%202019-cf68bc3e9416fc435e0b76db4bad3033.jpg?alt=media&token=301b49bf-d690-4776-ab58-56fdedb7bb45',
        createdAt: new Date().toJSON()
    })
}
    

    render(){
        let {
            image,
            progressUpload,
            posts
        } = this.state
    
        return(
        <div className="">
            <h1>BIENVENIDO</h1>

            <LoadingBar 
            progress={progressUpload} 
            color="blue" 
            onLoaderFinished={this.restartProgressBar}/>

            <button
            onClick={this.addPost}>
                Post Nuevo
            </button>

            <div className="file has-name is-boxed">
                <label className="file-label">
                    <input 
                    className="file-input" 
                    type="file" name="resume" 
                    onChange={this.handleChange} 
                    />
                    <span className="file-cta">
                        <span className="file-icon">
                            <i className="fas fa-upload"></i>
                        </span>
                        <span className="file-label">
                            Selecciona una imagen:
                        </span>
                    </span>
                    {
                        image ? ( <span className="file-name">
                            {image.name}
                        </span>) : null
                    }
                </label>
            </div>
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
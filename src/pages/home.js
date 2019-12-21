import React, { Component } from 'react'
import firebase, { storage } from 'firebase'
import LoadingBar from 'react-top-loading-bar';
import {toast} from 'react-toastify';



class Home extends Component{

constructor (props){
    super(props)
        this.state = {
            image: '',
            progressUpload: 0 
        } 
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
        task.cancel()
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
    

    render(){
        let {
            image,
            progressUpload
        } = this.state
    
        return(
        <div className="">
            <h1>BIENVENIDO</h1>

            <LoadingBar 
            progress={progressUpload} 
            color="blue" 
            onLoaderFinished={this.restartProgressBar}/>

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
        </div>
        )        
    }
}


export default Home
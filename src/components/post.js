import React, { Component } from 'react'
import Modal from './modal'
import firebase from 'firebase'
import LoadingBar from 'react-top-loading-bar';
import {toast} from 'react-toastify';

class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            classNameModal: '',
            errorForm: false,
            formData: {
                content: '',
                image: ''
            },
            progressUpload: 0,
            loading: false
        }
    }

    handleModal = (classNameModal) => {
        this.setState({
            classNameModal
        })
    }

    handleChange = (e) => {
        let {
            formData
        } = this.state

        let {
            target
        } = e

        if (target.type === "file") {
            formData[target.name] = target.files[0]

        } else {
            formData[target.name] = target.value

        }

        this.setState({
            formData,
            errorForm: false
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()

        let {
            formData,
        } = this.state

        if (formData.content && formData.image) {
            //Llamar subida de archivo
            this.setState({
            loading:true
            }, this.handleUploadImage())
        } else {
            this.setState({
                errorForm: true
            })
        }
    }

    handleUploadImage = () => {
        //Subida del archivo y obtner url
        let {
            formData: {image}
        } = this.state


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
            this.setState({
                loading:false
                })
            toast.error(`Error al subir la imagen!\nReintente la subida de la imagen por favor.\n Error:${error.message}` , {
                position: toast.POSITION.TOP_RIGHT
            });
            console.log("error",error)
        }, () => {
            task.snapshot.ref.getDownloadURL().then((url) => {               
                console.log("url", url)
                this.handleCreatePost(url)
            })
        })
    }

    handleCreatePost = (url) => {
        //Crear post
        let {
            formData:{content}
        } = this.state

        let posts = firebase.database().ref('posts')
        let newPost = posts.push()

        newPost.set({
        content,
        photoURL:url,
        authoredId: 'TWNITntVyrQSPiShCcESAAcgXPg2',
        createdAt: new Date().toJSON()
        })

        this.setState({
            classNameModal: '',
            formData: {
                content: '',
                image: ''
            },
            progressUpload: 0,
            loading: false
        })

        toast.success("Publicación creada con exito!!", {
            position: toast.POSITION.TOP_RIGHT
        });
    }

    restartProgressBar = () => {
        this.setState({
            progressUpload:0
        })
    }

    render() {
        let {
            classNameModal,
            formData,
            errorForm,
            progressUpload,
            loading
        } = this.state

        return (
            <div>
                <button className="button is-info"
                    onClick={() => this.handleModal('is-active')}>
                    Nueva Publicación
                </button>

                <Modal
                    className={classNameModal}
                    onClose={() => this.handleModal('')}>

                    <LoadingBar 
                        progress={progressUpload} 
                        color="blue" 
                        onLoaderFinished={this.restartProgressBar}/>

                    {
                        errorForm && (<div className="notification is-danger">
                            Completa los campos del formulario
                        </div>)
                    }

                    <form
                        onSubmit={this.handleSubmit}>
                        <div className="field">
                            <label className="label">
                                Titulo
                        </label>
                            <div className="control">
                                <input
                                    type="text"
                                    value={formData.content}
                                    onChange={this.handleChange}
                                    name="content"
                                    className="input is-info"
                                />
                            </div>
                        </div>

                        <div className="field">
                            <div className="file">
                                <label className="file-label">
                                    <input
                                        className="file-input"
                                        type="file"
                                        name="image"
                                        onChange={this.handleChange} />
                                    <span className="file-cta">
                                        <span className="file-icon">
                                            <i className="fas fa-upload"></i>
                                        </span>
                                        {
                                            formData.image ? (<span className="file-name">
                                                {formData.image.name}
                                            </span>) : (<span className="file-label">
                                                Selecciona una imagen:
                                        </span>)
                                        }
                                    </span>
                                </label>
                            </div>
                        </div>

                        {
                        loading ? (
                            <div>
                                <p className="my-letter-font">Loading...</p>
                            </div>
                        ) : (<div className="columns">
                            <div className="column">
                                <div className='buttons'>
                                    <button
                                        type="button"
                                        onClick={
                                            () => this.handleModal('')
                                        }
                                        className="button is-danger">
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit"
                                        className="button is-success">
                                        Publicar
                                    </button>
                                </div>
                            </div>
                        </div>)
                        }
                    </form>
                </Modal>
            </div>
        )
    }
}

export default Post
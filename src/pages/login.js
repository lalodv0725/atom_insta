import React, { Component } from 'react'
import firebase from 'firebase'
import store from '../tree'

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading : true
        }
    }

    componentDidMount = async () => {
        try{
            let data = await firebase.auth().getRedirectResult()

            if(data.credential){

            let user = firebase.database().ref(`users/${data.user.uid}`)

            console.log("Datos Usuario:", data.user);

            let userFormat = {
                displayName: data.user.displayName,
                photoURL: data.user.photoURL,
                email: data.user.email
            }

            user.set(userFormat)
            window.localStorage.setItem('user', JSON.stringify(userFormat))
            store.set("user",userFormat)
            store.commit()

                console.log('Sesion iniciada')
                
                let {
                    history
                } = this.props
                history.push('/home');
                //this.props.history.push('/home');
            }else{
                console.log('Sesion NO iniciada')
                this.setState({
                    loading: false
                })
            }
        }catch(error){
            console.log(error)
        }
    }

    handleLoginWithSocialNetwork = async (service) => {
        let provider
        let stringService

        if(service === 'facebook'){
            // let provider = new firebase.auth.FacebookAuthProvider()            
            stringService = "FacebookAuthProvider"
        }else {
            //let provider = new firebase.auth.GoogleAuthProvider()
            stringService = "GoogleAuthProvider"
        }
        provider = new firebase.auth[stringService]()
        firebase.auth().signInWithRedirect(provider)
    }

  render() {
    console.log(process.env)

    let {
        loading
    }= this.state

    let content = <p className="my-letter-font">Loading...</p>

    if(!loading){
    content = (<div className="buttons">
            <button 
            onClick={() => this.handleLoginWithSocialNetwork('facebook')}
            className="button is-info is-fullwidth">
                Iniciar sesion con Facebook
            </button>
            <button 
            onClick={() => this.handleLoginWithSocialNetwork('google')}
            className="button is-danger is-fullwidth">
                Iniciar sesion con Google
            </button>        
        </div>)
    }



    return ( 
        <div className="columns">
            <div className="column is-two-thirds">
                <img src="/assets/preview.jpg" alt=""/>
            </div>
            <div className="column">
                <h1 className="title is-1 has-text-centered my-title-font">Insta Atom</h1>
                {
                    content
                }             
            </div>            
      </div>
    );
  }
}

export default Login;
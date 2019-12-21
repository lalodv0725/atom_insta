import React, { Component } from 'react'
import { ToastContainer} from 'react-toastify';

import Navbar from '../components/navbar'

class Layout extends Component {
    render() {
        return (
            <div>
                <ToastContainer/>
                <Navbar/>
                <div>
                    <div className="section">
                        {
                            this.props.children
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Layout
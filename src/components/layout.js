import React, { Component } from 'react'

import Navbar from '../components/navbar'

class Layout extends Component {
    render() {
        return (
            <div>
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
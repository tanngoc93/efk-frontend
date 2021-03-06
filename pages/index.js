import React from "react"
import fetch from "isomorphic-unfetch"
import getConfig from "next/config"
import Router from "next/router"

// Only holds serverRuntimeConfig and publicRuntimeConfig
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
// Will only be available on the server-side
console.log(">>> ON_SERVER:", serverRuntimeConfig.API_HOST_ON_SERVER)
// Will be available on both server-side and client-side
console.log(">>> ON_PUBLIC", publicRuntimeConfig.API_HOST)

class Index extends React.Component {
  state = {
    name: "",
    url: ""
  }

  static async getInitialProps ({ ctx }) {
    let images = []

    const res = await fetch(
      `${publicRuntimeConfig.API_HOST}/api/v1/images`
    )
    .then(response => response.json())
    .then(data => {
      images = data
    })
    .catch(error => {
      console.log("=== error ===")
    })

    return {
      images
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = event => {
    event.preventDefault();

    fetch(`${publicRuntimeConfig.API_HOST}/api/v1/images`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({
        name:this.state.name,
        url:this.state.url
      })
    })
    .then(response => response.json())
    .then(data => {
      Router.replace("/")
    })
    .catch(error => {
      console.log(error)
    })
  };

  handleDestroy = (event, id) => {
    event.preventDefault();

    fetch(`${publicRuntimeConfig.API_HOST}/api/v1/images/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      Router.replace("/")
    })
    .catch(error => {
      console.log(error)
    })
  };

  render () {
    const { images } = this.props

    return(
      <div className="container">
        <form className="form" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input 
              id="name" 
              name="name" 
              type="text"
              placeholder="Name"
              className="form-control"
              onChange={ this.handleChange }
              value={ this.state.name }
            >
            </input>
          </div>
          <div className="form-group">
            <input 
              id="url" 
              name="url" 
              type="text"
              placeholder="Image URL"
              className="form-control"
              onChange={ this.handleChange }
              value={ this.state.url }
            >
            </input>
          </div>
          <button className="btn btn-primary">
            Submit
          </button>
        </form>
        <div className="row">
          {
            images.map((image, index) => {
              return(
                <div key={ index } className="col-md-3">
                  <img className="img-thumbnail" src={ image.url } />
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(event) => this.handleDestroy(event, image.id)}
                  >
                    Destroy
                  </button>
                </div>
              )
            })
          }
        </div>
        <style jsx>{`
          .form {
            width: 450px;
            margin: 20px auto;
            text-align: center;
          }
          .col-md-3 {
            text-align: center;
            margin-bottom: 20px;
          }
          img {
            width: 100%;
            margin-bottom: 5px;
          }
        `}</style>
      </div>
    )
  }
}

export default Index

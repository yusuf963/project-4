import React, { useState, useEffect } from 'react'
// import axios from 'axios'
import 'bulma'

import { getLoggedInUser } from '../lib/auth'
import useAxios from '../hooks/useAxios'

const Profile = ({ match }) => {

  const currentUser = getLoggedInUser()

  const { loading, results, error } = useAxios({ url: `/api/users/${match.params.id}`, method: 'get'})

  // Display something while loading
  if (loading) {
    return <h1>Loading</h1>
  }

  // If user is not found
  if (!results.id) {
    return <h1>User not found</h1>
  }

  let loggedInUser

  if (results.id === currentUser.sub) {
    loggedInUser = <h3>Your profile</h3>
  }

  const userItems = results.items.map(item => {
    return <div key={item.id} className={'card'}>
      <div className={'card-image-container'}>
        <img src={item.image} />
      </div>
      <div className={'card-description-container'}>
        <h4>{item.title}</h4>
        <p>{item.description}</p>
      </div>
    </div>
  })

  return <div>
    <figure className="image is-3by2 mb-2">
      <img src={results.profilePic} alt={results.lastName} />
    </figure>
    <div className={'container'}>
      <h1>{results.firstName} {results.lastName}</h1>
      <h2>{results.address}</h2>

      <div className={'card-container'}>
        {userItems}
      </div>
    </div>

  </div>
}

export default Profile
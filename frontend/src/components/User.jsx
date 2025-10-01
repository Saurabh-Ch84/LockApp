import React from 'react'
import './User.css'

const User = ({username}) => {
  return (
    <div className='user-container'>
      <h2>Welcome</h2>
      <h3>{username}</h3>
    </div>
  )
}

export default User

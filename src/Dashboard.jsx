import React from 'react'

const Dashboard = () => {
  return (
    <div>
        Dashboard
        <button onClick={()=>localStorage.removeItem('token')}>Logout</button>
        </div>
    
  )
}

export default Dashboard
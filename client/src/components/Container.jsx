import React from 'react'

const Container = ({children, className}) => {
  return (
    <section className={`bg-black text-white text-sm min-h-screen ${className}`}>{children}</section>
  )
}

export default Container
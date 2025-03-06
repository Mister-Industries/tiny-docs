import React, { useEffect } from "react"
import { navigate } from "gatsby"

// Simple redirect template for section pages
const SectionRedirect = ({ pageContext }) => {
  useEffect(() => {
    navigate(`/page/${pageContext.section}/index`, { replace: true })
  }, [pageContext.section])

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh", 
      backgroundColor: "var(--bg-color)", 
      color: "var(--text-color)" 
    }}>
      Redirecting to {pageContext.section} overview...
    </div>
  )
}

export default SectionRedirect
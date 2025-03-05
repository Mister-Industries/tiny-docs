import React from 'react';
import { graphql, Link } from 'gatsby';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';

// Main container with sidebar
const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
`;

// Content area (right side)
const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
`;

// Top navigation bar
const TopNav = styled.div`
  position: sticky;
  top: 0;
  background-color: var(--sidebar-bg);
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border-radius: 0 0 8px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

// Back to map button with constellation icon
const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  background-color: transparent;
  color: var(--text-color);
  border: none;
  font-size: 0.9rem;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--highlight-color);
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

// Navigation between pages
const PageNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavButton = styled(Link)`
  display: flex;
  align-items: center;
  background-color: var(--sidebar-bg);
  color: var(--text-color);
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  max-width: 45%;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--highlight-color);
  }
  
  &.prev-button {
    margin-right: auto;
  }
  
  &.next-button {
    margin-left: auto;
    flex-direction: row-reverse;
  }
  
  svg {
    flex-shrink: 0;
    margin: 0 0.5rem;
  }
  
  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  
  h1:first-child {
    display: none; /* Hide the first h1 to prevent duplicate titles */
  }
  
  h1 {
    color: var(--highlight-color);
    margin-bottom: 1.5rem;
  }
  
  /* Rest of your content styling */
  p, ul, ol {
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  
  ul, ol {
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  img {
    max-width: 100%;
    margin: 1.5rem 0;
    border-radius: 4px;
  }
  
  code {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
  }
  
  pre {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    margin-bottom: 1.5rem;
  }
`;

const PageTemplate = ({ data }) => {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;
  
  // Function to find previous and next pages
  const findPrevNextPages = () => {
    // Import navigation data
    const { navigationStructure } = require('../data/navigationData');
    
    // Flatten the navigation structure
    const allPages = [];
    navigationStructure.forEach(section => {
      section.items.forEach(item => {
        allPages.push(item);
      });
    });
    
    // Find current page index
    const currentIndex = allPages.findIndex(page => page.id === frontmatter.slug);
    
    // Get prev and next
    const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null;
    const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null;
    
    return { prevPage, nextPage };
  };
  
  const { prevPage, nextPage } = findPrevNextPages();
  
  return (
    <PageContainer>
      <Helmet>
        <title>{frontmatter.title} | TinyCore ESP32</title>
      </Helmet>
      
      {/* Include the sidebar */}
      <Sidebar />
      
      <ContentArea>
        <TopNav>
          <BackButton to="/">
            {/* Constellation icon with back arrow */}
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
              <path d="M12 5 L15 10 L12 8 L9 10 Z" fill="currentColor" />
              <path d="M12 19 L9 14 L12 16 L15 14 Z" fill="currentColor" />
              <path d="M5 12 L10 9 L8 12 L10 15 Z" fill="currentColor" />
              <path d="M19 12 L14 15 L16 12 L14 9 Z" fill="currentColor" />
              <path d="M12 2 L12 22" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              <path d="M2 12 L22 12" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              <path d="M8 8 L16 16" stroke="currentColor" strokeWidth="0.5" />
              <path d="M8 16 L16 8" stroke="currentColor" strokeWidth="0.5" />
            </svg>
            Back to Map
          </BackButton>
          
          {/* Current page title */}
          <h2>{frontmatter.title}</h2>
          
          {/* Optional: add additional controls here */}
          <div></div>
        </TopNav>
        
        <ContentWrapper>
          <h1>{frontmatter.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </ContentWrapper>
        
        <PageNavigation>
          {prevPage && (
            <NavButton to={`/page/${prevPage.id}`} className="prev-button">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M10 4 L6 8 L10 12" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <span>Previous: {prevPage.name}</span>
            </NavButton>
          )}
          
          {nextPage && (
            <NavButton to={`/page/${nextPage.id}`} className="next-button">
              <span>Next: {nextPage.name}</span>
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M6 4 L10 8 L6 12" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </NavButton>
          )}
        </PageNavigation>
      </ContentArea>
    </PageContainer>
  );
};

export const query = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        slug
        image
      }
    }
  }
`;

export default PageTemplate;